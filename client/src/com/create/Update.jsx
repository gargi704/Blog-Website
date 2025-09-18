import { useState, useEffect, useContext } from 'react';
import { Box, styled, FormControl, InputBase, Button, TextareaAutosize } from '@mui/material';
import { AddCircle as Add } from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { API, uploadFile } from '../../service/api';
import { getAccessToken } from '../../utils/common-utill';

const Container = styled(Box)(({ theme }) => ({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: 0
    }
}));

const Image = styled('img')({
    width: '100%',
    height: '50vh',
    objectFit: 'cover'
});

const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
`;

const InputTextField = styled(InputBase)`
    flex: 1;
    margin: 0 30px;
    font-size: 25px;
`;

const StyledTextArea = styled(TextareaAutosize)`
    width: 100%;
    border: none;
    margin-top: 50px;
    font-size: 18px;
    &:focus-visible {
        outline: none;
    }
`;

const initialPost = {
    title: '',
    description: '',
    picture: '',
    username: 'codeforinterview',
    categories: 'Tech',
    createdDate: new Date()
}

const Update = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState(initialPost);
    const [file, setFile] = useState('');
    const [imageURL, setImageURL] = useState('');
    const { id } = useParams();

    const url = 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';

    useEffect(() => {
        const fetchData = async () => {
            let response = await API.getPost({},id);
            if (response.isSuccess) {
                setPost(response.data);
            }
        }
        fetchData();
    }, [id]); 

    useEffect(() => {
        const getImage = async () => {
            if (!file) return;
            try {
                const formData = new FormData();
                formData.append("file", file); // match multer.single('file')
                const response = await uploadFile(formData);
                if (response && response.url) {
                    setPost(prev => ({ ...prev, picture: response.url }));
                } else {
                    console.error("Update-upload missing url:", response);
                    alert("Image upload failed while updating. Check console.");
                }
            } catch (err) {
                console.error("Error uploading file in Update:", err);
                alert("Image upload failed while updating. See console.");
            }
        };
        getImage();
    }, [file]);

    const updateBlogPost = async () => {
        const updateData = {
            title: post.title,
            description: post.description,
            username: post.username,
            categories: post.categories || "All",
            picture: post.picture || "",
        };
        const response = await API.updatePost(updateData, id);

        if (response.isSuccess) {
            navigate(`/details/${id}`);
        } else {
            console.error("Update failed:", response);
            alert("Update failed: " + (response.msg?.message || "Unknown error"));
        }
    };

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    }

    return (
        <Container>
            <Image src={post.picture || url} alt="post" />

            <StyledFormControl>
                <label htmlFor="fileInput">
                    <Add fontSize="large" color="action" />
                </label>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <InputTextField onChange={(e) => handleChange(e)} value={post.title} name='title' placeholder="Title" />
                <Button onClick={() => updateBlogPost()} variant="contained" color="primary">Update</Button>
            </StyledFormControl>

            <StyledTextArea
                minRows={5}
                placeholder="Tell your story..."
                name='description'
                onChange={(e) => handleChange(e)}
                value={post.description}
            />
        </Container>
    )
}

export default Update;

