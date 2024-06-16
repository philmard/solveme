'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Container, Button, Form, Modal, Alert, Col} from 'react-bootstrap';
import axios from 'axios';

const addCredits = async (num_credits, username, setMessage) => {
    // upothetontas pws phra ta credentials apto session:
    //const username = "filippos";

    // Ensure num_credits is greater than 0
    if (num_credits <= 0) {
        console.log("Credits should be positive integers!");
        setMessage("Credits should be positive integers!");
        return;
    }

    try {
        // Add credit(s)
        await axios.put(`http://localhost:3001/users/${username}/add-credit`, {credits: num_credits});

        // Fetch user data to get the updated credits
        const response = await axios.get(`http://localhost:3001/users/${username}`);
        const {credits} = response.data;

        console.log(`Successfully added ${num_credits} credit(s). Total credits:`, credits);
        setMessage(`Successfully added ${num_credits} credit(s). Total credits: ${credits}`);
    } catch (error) {
        console.error("Error adding credit:", error);
        setMessage("Error adding credit.");
    }
}

const HomePage = () => {
    const router = useRouter();
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');
    const [numCredits, setNumCredits] = useState('');

    return (
        <Container className="my-5">
            <Col md={4}>
                <h2>Buy Credits</h2>
                <Form.Group controlId="numCredits" className="mt-2">
                    <Form.Label>Number of Credits</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter number of credits"
                        value={numCredits}
                        onChange={(e) => setNumCredits(e.target.value)}
                    />
                </Form.Group>
                <Button
                    variant="light"
                    className="w-100 mb-2 mt-3"
                    onClick={() => addCredits(parseInt(numCredits), "filippos", setMessage)}
                >
                    Buy Credits
                </Button>
                <Button
                    variant="light"
                    className="w-100 mb-2 mt-3"
                    onClick={() => router.push('/home')}
                >
                    Go Home
                </Button>
            </Col>
            {message && <Alert variant="info" className="mt-4">{message}</Alert>}
        </Container>
    );
};

export default HomePage;