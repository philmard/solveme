'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Container, Button, Form, Modal, Alert, Col, Row} from 'react-bootstrap';
import axios from 'axios';


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
                <Button
                    variant="light"
                    className="w-100 mb-2 mt-3"
                    onClick={() => router.push('/result/69')}
                >
                    View Results 1
                </Button>
                <Button
                    variant="light"
                    className="w-100 mb-2 mt-3"
                    onClick={() => router.push('/result/69')}
                >
                    View Results 2
                </Button>
                <Button
                    variant="light"
                    className="w-100 mb-2 mt-3"
                    onClick={() => router.push('/result/69')}
                >
                    View Results 3
                </Button>
                <Button
                    variant="light"
                    className="w-100 mb-2 mt-3"
                    onClick={() => router.push('/result/69')}
                >
                    View Results 4
                </Button>
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