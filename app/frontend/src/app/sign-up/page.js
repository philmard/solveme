'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Container, Button, Form, Modal, Alert, Col} from 'react-bootstrap';
import axios from 'axios';

const signup = async (username, password, setMessage, router) => {
    //const username = "filippos1000";
    //const password = "2002";

    try {
        const response = await axios.post("http://localhost:3001/users", {username, password});
        console.log("User created successfully:", response.data);
        setMessage("User created successfully: " + response.data.username);
        router.push('/login'); // reroute to login page after successfull signup
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
                        onClick={() => signup(signupUsername, signupPassword, setMessage, router)}
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
