import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import RootLayout from '../app/layout';

const SignUp = () => {
    const router = useRouter();
    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [message, setMessage] = useState('');

    const signup = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3001/users', { username, password });
            setMessage('User created successfully: ' + response.data.username);
        } catch (error) {
            setMessage('Error creating user: ' + error.response.data.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(signupUsername, signupPassword);
    };

    return (
       // <RootLayout>
            <Container className="my-5">
                <h1>Sign Up</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="signupUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={signupUsername}
                            onChange={(e) => setSignupUsername(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="signupPassword" className="mt-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Sign Up
                    </Button>
                    {message && <Alert variant="info" className="mt-3">{message}</Alert>}
                </Form>
                <Button variant="secondary" className="mt-3" onClick={() => router.push('/')}>
                    Go Back
                </Button>
            </Container>
       // </RootLayout>
    );
};

export default SignUp;
