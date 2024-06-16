'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const Page = () => {
    const router = useRouter();
    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const signup = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3001/users', { username, password });
            setModalMessage('User created successfully: ' + response.data.username);
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                router.push('/');
            }, 2000); // 5 seconds
        } catch (error) {
            setModalMessage('Error creating user: ' + (error.response?.data?.message || error.message));
            setShowModal(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(signupUsername, signupPassword);
    };

    return (
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
            </Form>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Signup Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>
            </Modal>
            <Button variant="secondary" className="mt-3" onClick={() => router.push('/')}>
                Go Back
            </Button>
        </Container>
    );
};

export default Page;
