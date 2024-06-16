'use client';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Container, Button, Form, Modal, Alert, Col, Row} from 'react-bootstrap';
import axios from 'axios';

const ResultPage = ({params}) => {
    const router = useRouter();
    const [results, setResults] = useState(null);
    const [message, setMessage] = useState('');

    //const {id} = router.query; // Get the id from the route
    const id = params.id

    useEffect(() => async () => setResults(await axios.get(`http://localhost:3003/results/${id}`))
        , [id]);

    // Example logic to determine result based on id
    let resultText = '';
    switch (id) {
        case '1':
            resultText = 'Result 1';
            break;
        case '2':
            resultText = 'Result 2';
            break;
        // Add more cases as needed
        default:
            resultText = 'Unknown Result';
            break;
    }
    console.log(results.data)
    return (
        <Container className="my-5">
            <Col md={4}>
                <h2>{id}</h2>
            </Col>
            <Col md={4}>
                <h2>....................................</h2>
                <h2>....................................</h2>
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

export default ResultPage;