'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Container, Button, Form, Modal, Alert, Col} from 'react-bootstrap';
import axios from 'axios';

const checkLogin = async (username, password, setMessage, router) => {
    //const username = "filippos";
    //const password = "2002";
    try {
        const response = await axios.get(`http://localhost:3001/users/${username}`);
        if (response.data && response.data.password === password) {
            console.log("Successful Login");
            setMessage("Successful Login");
            router.push('/home');
        } else {
            console.log("Wrong Username or Password");
            setMessage("Wrong Username or Password");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        setMessage(`${error.response.data}`);
    }
}

const LoginPage = () => {
    const router = useRouter();
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');

    return (
        <Container className="my-5">
            <Col md={4}>
                <h2>Login</h2>
                <Form>
                    <Form.Group controlId="loginUsername">
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="loginPassword" className="mt-2">
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        variant="light"
                        className="w-100 mb-2 mt-3"
                        onClick={() => checkLogin(loginUsername, loginPassword, setMessage, router)}
                    >
                        Login
                    </Button>
                    <Button
                        variant="light"
                        className="w-100 mb-2 mt-3"
                        onClick={() => router.push('/')}
                    >
                        Go Back
                    </Button>
                </Form>
            </Col>
            {message && <Alert variant="info" className="mt-4">{message}</Alert>}
        </Container>
    );
};

export default LoginPage;