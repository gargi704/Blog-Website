import { useState, useEffect, useContext } from 'react';
import { Box, TextareaAutosize, Button, styled } from '@mui/material';

import { DataContext } from '../../../context/DataProvider';
import { API } from '../../../service/api';

// Components
import Comment from './Comment';

const Container = styled(Box)`
    margin-top: 100px;
    display: flex;
`;

const Image = styled('img')({
    width: 50,
    height: 50,
    borderRadius: '50%'
});

const StyledTextArea = styled(TextareaAutosize)`
    height: 100px !important;
    width: 100%; 
    margin: 0 20px;
`;

const initialValue = {
    name: '',
    postId: '',
    comment: ''
};

const Comments = ({ post }) => {
    const url = 'https://static.thenounproject.com/png/12017-200.png';
    const [comment, setComment] = useState(initialValue);
    const [comments, setComments] = useState([]);
    const [toggle, setToggle] = useState(false);
    const token = localStorage.getItem("token");
    const { account } = useContext(DataContext);

    useEffect(() => {
        const getData = async () => {
            if (!post?._id) return;
            try {
                let response = await API.getAllComments({}, post._id);
                if (response.isSuccess) setComments(response.data);
            } catch (err) {
                console.error("Error fetching comments:", err);
            }
        };
        getData();
    }, [post, toggle]);

    const handleChange = (e) => {
        setComment({
            ...comment,
            name: account.username,
            postId: post._id,
            comment: e.target.value
        });
    };

    const addComment = async () => {
        if (!comment.comment.trim()) return;
        try {
            const response = await API.newComment(comment);
            if (response.isSuccess) {
                setComment({ ...initialValue, name: account.username, postId: post._id });
                const updated = await API.getAllComments({}, post._id); 
                if (updated.isSuccess) setComments(updated.data);
            }
        } catch (error) {
            console.error("Error posting comment:", error.message || error);
        }
    };

    return (
        <Box>
            <Container>
                <Image src={url} alt="dp" />
                <StyledTextArea
                    minRows={5}
                    placeholder="What's on your mind?"
                    onChange={handleChange}
                    value={comment.comment}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    style={{ height: 40 }}
                    onClick={addComment}
                >
                    Post
                </Button>
            </Container>
            <Box>
                {comments && comments.length > 0 && comments.map(c => (
                    <Comment key={c._id} comment={c} setToggle={setToggle} />
                ))}
            </Box>
        </Box>
    );
};

export default Comments;
