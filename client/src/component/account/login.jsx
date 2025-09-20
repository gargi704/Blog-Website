import React, { useState, useContext } from 'react';
import { Box, TextField, Button, styled, Typography } from '@mui/material';
import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const Component = styled(Box)`
    width: 400px;
    margin: auto;
    box-shadow: 5px 2px 5px 2px rgb(0 0 0 / 0.6);
`;

const Image = styled('img')({
    width: 100,
    display: 'flex',
    margin: 'auto',
    padding: '50px 0 0'
});

const Wrapper = styled(Box)`
    padding: 25px 35px;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    & > div, & > button, & > p {
        margin-top: 20px;
    }
`;

const LoginButton = styled(Button)`
    text-transform: none;
    background: #FB641B;
    color: #fff;
    height: 48px;
    border-radius: 2px;
`;

const SignupButton = styled(Button)`
    text-transform: none;
    background: #fff;
    color: #2874f0;
    height: 48px;
    border-radius: 2px;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 20%);
`;

const Text = styled(Typography)`
    color: #878787;
    font-size: 12px;
`;

const loginInitialValues = {
    username: '',
    password: ''
};

const signupInitialValues = {
    name: '',
    username: '',
    password: '',
};

const Login = ({ isUserAuthenticated }) => {
    const [login, setLogin] = useState(loginInitialValues);
    const [signup, setSignup] = useState(signupInitialValues);
    const [account, toggleAccount] = useState('login');

    const navigate = useNavigate();
    const { setAccount } = useContext(DataContext);

    const imageURL = process.env.PUBLIC_URL + '/Image/logo-blog.png';

    const onValueChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    }

    const onInputChange = (e) => {
        setSignup({ ...signup, [e.target.name]: e.target.value });
    }

    const loginUser = async () => {
        try {
            let response = await API.userLogin({
                username: login.username,
                password: login.password
            });

            if (response.isSuccess) {
                sessionStorage.setItem('accessToken', response.data.accessToken);
                sessionStorage.setItem('refreshToken', response.data.refreshToken);

                isUserAuthenticated(true);
                setAccount({ name: response.data.name, username: response.data.username });
                toast.success("Login successful!");
                navigate('/');

            } else {
                toast.error(response.msg || "Something went wrong");
            }
        } catch (err) {
            toast.error("Something went wrong!");
        }
    };

    const signupUser = async () => {
        try {
            let response = await API.userSignup(signup);
            if (response.isSuccess) {
                setSignup(signupInitialValues);
                toggleAccount('login');
                toast.success("Account created successfully!");
            } else {
                toast.error(response.msg?.message || "Signup failed! Try again.");
            }
        } catch (err) {
            console.error("Signup Failed:", err);
            toast.error("Something went wrong!");
        }
    }

    const toggleSignup = () => {
        toggleAccount(account === 'signup' ? 'login' : 'signup');
    }

    return (
        <Component>
            <Box>
                <Image src={imageURL} alt="blog" />
                {account === 'login' ?
                    <Wrapper>
                        <TextField variant="standard" value={login.username} onChange={onValueChange} name='username' label='Enter Username' />
                        <TextField variant="standard" value={login.password} onChange={onValueChange} name='password' label='Enter Password' type="password" />
                        <LoginButton variant="contained" onClick={loginUser}>Login</LoginButton>
                        <Text style={{ textAlign: 'center' }}>OR</Text>
                        <SignupButton onClick={toggleSignup} style={{ marginBottom: 50 }}>Create an account</SignupButton>
                    </Wrapper>
                    :
                    <Wrapper>
                        <TextField variant="standard" value={signup.name} onChange={onInputChange} name='name' label='Enter Name' />
                        <TextField variant="standard" value={signup.username} onChange={onInputChange} name='username' label='Enter Username' />
                        <TextField variant="standard" value={signup.password} onChange={onInputChange} name='password' label='Enter Password' type="password" />
                        <SignupButton onClick={signupUser}>Signup</SignupButton>
                        <Text style={{ textAlign: 'center' }}>OR</Text>
                        <LoginButton variant="contained" onClick={toggleSignup}>Already have an account</LoginButton>
                    </Wrapper>
                }
            </Box>
        </Component>
    )
}

export default Login;
