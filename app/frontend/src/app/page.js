// Ensure the component is treated as a client component
'use client';

import axios from "axios";
import React, {useState} from "react";
import {Container, Button, Alert, Row, Col} from "react-bootstrap";

const checkLogin = async () => {
    const username = "filippos";
    const password = "2002";
    try {
        const response = await axios.get(`http://localhost:3001/users/${username}`);
        if (response.data && response.data.password === password) {
            console.log("Successful Login");
        } else {
            console.log("Wrong Username or Password");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const signup = async () => {
    const username = "filippos1000";
    const password = "2002";

    try {
        const response = await axios.post("http://localhost:3001/users", {username, password});
        console.log("User created successfully:", response.data);
        // Optionally, you can perform actions after successful signup
    } catch (error) {
        console.error("Error creating user:", error);
        // Optionally, handle the error
    }
}

const submitProblem = async () => {
    // upothetontas pws phra ta credentials apto session:
    const username = "filippos";

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

            // RUN THE SOLVER HERE
            console.log("Running Solver...");
            // http://localhost/solver-service/solve

            // 2 second pause gia na kanw simulate ton solver
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log("Solver Done...");
        } else { // if credits = 0
            console.log("Insufficient Credits."); // ta credits tha parameinoun 0. de tha ginoun arnhtika.
        }
    } catch (error) {
        console.error("Error removing credit:", error);
        // Optionally, handle the error
    }
}

const addCredits = async () => {
    // upothetontas pws phra ta credentials apto session:
    const username = "filippos";

    try {
        // Add 1 credit
        await axios.put(`http://localhost:3001/users/${username}/add-credit`);

        // Fetch user data to get the updated credits
        const response = await axios.get(`http://localhost:3001/users/${username}`);
        const {credits} = response.data;

        console.log("Successfully Added 1 credit. Total credits:", credits);
    } catch (error) {
        console.error("Error adding credit:", error);
        // Optionally, handle the error
    }
}

export default function Landing() {
    return (
        <Container className="my-5 text-center">
            <div className="bg-secondary p-5 mb-4">big solveME photo</div>
            <Row className="justify-content-center">
                <Col md={2}>
                    <Button variant="light" className="w-100 mb-2" onClick={checkLogin}>
                        checkLogin
                    </Button>
                </Col>
                <Col md={2}>
                    <Button variant="light" className="w-100 mb-2" onClick={signup}>
                        signup
                    </Button>
                </Col>
                <Col md={2}>
                    <Button variant="light" className="w-100 mb-2" onClick={submitProblem}>
                        Submit Problem
                    </Button>
                </Col>
                <Col md={2}>
                    <Button variant="light" className="w-100 mb-2" onClick={addCredits}>
                        Buy Credits
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
