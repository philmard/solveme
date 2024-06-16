'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Container, Button, Form, Modal, Alert, Col} from 'react-bootstrap';
import axios from 'axios';

const NewSubmissionPage = () => {
    const router = useRouter();
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');

    return (
        <Container className="my-5">
            <Col md={4}>
                <h2>New Submission</h2>
            </Col>
            <Col md={4}>
                <h2>...</h2>
            </Col>
            <Button
                variant="light"
                className="w-100 mb-2 mt-3"
                onClick={() => router.push('/home')}
            >
                Go Home
            </Button>
            {message && <Alert variant="info" className="mt-4">{message}</Alert>}
        </Container>
    );
};

export default NewSubmissionPage;