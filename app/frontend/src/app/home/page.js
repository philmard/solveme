'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Container, Button, Form, Modal, Alert, Col, Row} from 'react-bootstrap';
import axios from 'axios';

const submitProblem = async (username, setMessage) => {
    // upothetontas pws phra ta credentials apto session:
    //const username = "filippos";

    try {
        // Fetch user data to check credits
        const response = await axios.get(`http://localhost:3001/users/${username}`);
        const {credits} = response.data;

        // Check if user has at least 1 credit
        if (credits >= 1) {

            // Call remove-credit endpoint
            await axios.put(`http://localhost:3001/users/${username}/remove-credit`);

            // Fetch user data to get the updated credits
            const response = await axios.get(`http://localhost:3001/users/${username}`);
            const {credits} = response.data;

            console.log("Successfully Removed 1 credit. Total credits: ", credits);
            setMessage("Successfully Removed 1 credit. Total credits: ", credits);

            // RUN THE SOLVER HERE
            console.log("Running Solver...");
            setMessage("Running Solver...");
            // http://localhost/solver-service/solve

            // 2 second pause gia na kanw simulate ton solver
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log("Solver Done...");
            setMessage("Solver Done...");

        } else { // if credits = 0
            console.log("Insufficient Credits."); // ta credits tha parameinoun 0. de tha ginoun arnhtika.
            setMessage("Insufficient Credits.");
        }
    } catch (error) {
        console.error("Error removing credit:", error);
        setMessage("Error removing credit.");
        // Optionally, handle the error
    }
}

const HomePage = () => {
    const router = useRouter();
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');

    return (
        <Container className="my-5">
            <Col md={4}>
                <h2>My Submissions</h2>
            </Col>
            <Col md={4}>
                <h2>....................................</h2>
                <h2>....................................</h2>
                <Row>
                    <Button
                        variant="light"
                        className="w-50 mb-2 mt-3"
                        onClick={() => submitProblem("filippos", setMessage)}
                    >
                        Submit Problem
                    </Button>
                    <Button
                        variant="light"
                        className="w-50 mb-2 mt-3"
                        onClick={() => router.push('/result/2')}
                    >
                        View Results
                    </Button>
                </Row>
                <h2>....................................</h2>
                <h2>....................................</h2>
            </Col>
            <Button
                variant="light"
                className="w-100 mb-2 mt-3"
                onClick={() => router.push('/new-submission')}
            >
                New Problem
            </Button>
            <Button
                variant="light"
                className="w-100 mb-2 mt-3"
                onClick={() => router.push('/buy-credits')}
            >
                Buy Credits
            </Button>
            {message && <Alert variant="info" className="mt-4">{message}</Alert>}
        </Container>
    );
};

export default HomePage;