// Ensure the component is treated as a client component
'use client';

import axios from "axios";
import React, {useState} from "react";
import {Container, Button, Alert, Row, Col, Form} from "react-bootstrap";
import { useRouter } from "next/navigation";

const checkLogin = async (username, password, setMessage) => {
    //const username = "filippos";
    //const password = "2002";
    try {
        const response = await axios.get(`http://localhost:3001/users/${username}`);
        if (response.data && response.data.password === password) {
            console.log("Successful Login");
            setMessage("Successful Login");
        } else {
            console.log("Wrong Username or Password");
            setMessage("Wrong Username or Password");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        setMessage(`${error.response.data}`);
    }
}

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

export default function Landing() {
    const router = useRouter();
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [numCredits, setNumCredits] = useState('');
    const [sessionUsername, setSessionUsername] = useState('');
    const [message, setMessage] = useState('');

    return (
        <Container className="my-5 text-center">
            <div className="bg-secondary p-5 mb-4">big solveME photo</div>
            <Row className="justify-content-center">
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
                            onClick={() => checkLogin(loginUsername, loginPassword, setMessage)}
                        >
                            checkLogin
                        </Button>
                    </Form>
                </Col>
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
                            onClick={() => router.push('/sign-up')}//signup(signupUsername, signupPassword, setMessage)}
                        >
                            signup
                        </Button>
                    </Form>
                </Col>
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
                </Col>
                <Col md={4}>
                    <h2>Submit Problem</h2>
                    <Button
                        variant="light"
                        className="w-100 mb-2 mt-3"
                        onClick={() => submitProblem("filippos", setMessage)}
                    >
                        Submit Problem
                    </Button>
                </Col>
            </Row>
            {message && <Alert variant="info" className="mt-4">{message}</Alert>}
        </Container>
    );
}
