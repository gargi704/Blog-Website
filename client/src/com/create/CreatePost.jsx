// client/src/com/create/CreatePost.jsx
import { useState, useEffect, useContext } from 'react';
import { Box, styled, FormControl, InputBase, Button, TextareaAutosize } from '@mui/material';
import { AddCircle as Add } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/DataProvider';
import { API, uploadFile } from '../../service/api';

const Container = styled(Box)(({ theme }) => ({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: { margin: 0 }
}));

const Image = styled('img')({ width: '100%', height: '50vh', objectFit: 'cover' });
const StyledFormControl = styled(FormControl)`margin-top: 10px; display: flex; flex-direction: row;`;
const InputTextField = styled(InputBase)`flex: 1; margin: 0 30px; font-size: 25px;`;
const Textarea = styled(TextareaAutosize)`width: 100%; border: none; margin-top: 50px; font-size: 18px; &:focus-visible { outline: none; }`;

const initialPost = {
    title: '',
    description: '',
    picture: '',
    username: '',
    categories: '',
    createdDate: new Date()
};

const CreatePost = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { account } = useContext(DataContext);

    const [post, setPost] = useState(initialPost);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const url = post.picture || 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';

    // set username & category from context / query
    useEffect(() => {
        setPost(prev => ({
            ...prev,
            categories: location.search?.split('=')[1] || 'All',
            username: account?.username || ''
        }));
    }, [account?.username, location.search]);

    // When file is selected, upload immediately and set picture
    useEffect(() => {
        if (!file) return;

        const uploadImage = async () => {
            try {
                setUploading(true);
                const formData = new FormData();
                // MUST match multer.single('file') on server
                formData.append('file', file);
                const response = await uploadFile(formData); // uploadFile returns res.data (expected { url: ... })
                // guard: response may be { isError: ... } when axios wrapper used elsewhere — but uploadFile returns raw
                if (response && response.url) {
                    setPost(prev => ({ ...prev, picture: response.url }));
                } else {
                    console.error("Upload response missing URL:", response);
                    alert("Image upload failed. Check console for details.");
                }
            } catch (err) {
                console.error("Error uploading file:", err);
                alert("Image upload failed. See console.");
            } finally {
                setUploading(false);
            }
        };

        uploadImage();
    }, [file]);

    const savePost = async () => {
        if (!post.title || !post.description) {
            alert("Please provide title and description.");
            return;
        }
        if (!post.username) {
            alert("User not logged in or username missing.");
            return;
        }
        if (!post.picture) {
            if (uploading) {
                alert("Image is still uploading. Wait for upload to finish.");
                return;
            }
            alert("Please upload an image before publishing.");
            return;
        }

        try {
            const response = await API.createPost(post);
            if (response.isSuccess) {
                navigate('/');
            } else {
                console.error("Create post failed:", response);
                alert("Failed to create post: " + (response.msg?.message || JSON.stringify(response)));
            }
        } catch (error) {
            console.error("Error saving post:", error);
            alert("Server error while saving post. See console.");
        }
    };

    const handleChange = (e) => setPost({ ...post, [e.target.name]: e.target.value });

    return (
        <Container>
            <Image src={url} alt="post" />

            <StyledFormControl>
                <label htmlFor="fileInput"><Add fontSize="large" color="action" /></label>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <InputTextField value={post.title} onChange={handleChange} name='title' placeholder="Title" />
                <Button onClick={savePost} variant="contained" color="primary" disabled={uploading}>
                    {uploading ? "Uploading..." : "Publish"}
                </Button>
            </StyledFormControl>

            <Textarea
                value={post.description}
                minRows={5}
                placeholder="Tell your story..."
                name='description'
                onChange={handleChange}
            />
        </Container>
    );
};

export default CreatePost;
