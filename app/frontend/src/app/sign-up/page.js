'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Container, Button, Form, Modal, Alert, Col} from 'react-bootstrap';
import axios from 'axios';

const signup = async (username, password, setMessage) => {
    //const username = "filippos1000";
    //const password = "2002";

    try {
        const response = await axios.post("http://localhost:3001/users", {username, password});
        console.log("User created successfully:", response.data);
        setMessage("User created successfully: " + response.data.username);
    } catch (error) {
        console.log("Error creating user:", error.response.data.message);
        setMessage(`${error.response.data.message}`);
    }
}

const SignupPage = () => {
    const router = useRouter();
    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    // const [showModal, setShowModal] = useState(false);
    // const [modalMessage, setModalMessage] = useState('');
    const [message, setMessage] = useState('');

    // const signup = async (username, password) => {
    //     try {
    //         const response = await axios.post('http://localhost:3001/users', {username, password});
    //         setModalMessage('User created successfully: ' + response.data.username);
    //         setShowModal(true);
    //         setTimeout(() => {
    //             setShowModal(false);
    //             router.push('/');
    //         }, 2000); // 5 seconds
    //     } catch (error) {
    //         setModalMessage('Error creating user: ' + (error.response?.data?.message || error.message));
    //         setShowModal(true);
    //     }
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     await signup(signupUsername, signupPassword);
    // };

    return (
        <Container className="my-5">
            <Col md={4}>
                <h2>Sign Up</h2>
                <Form>
                    <Form.Group controlId="signupUsername">
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={signupUsername}
                            onChange={(e) => setSignupUsername(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="signupPassword" className="mt-2">
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        variant="light"
                        className="w-100 mb-2 mt-3"
                        onClick={() => signup(signupUsername, signupPassword, setMessage)}
                    >
                        signup
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

export default SignupPage;
