"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Button,
  Form,
  Modal,
  Alert,
  Col,
  Row,
} from "react-bootstrap";
import axios from "axios";

const ResultPage = ({ params }) => {
  const router = useRouter();
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState("");

  //const {id} = router.query; // Get the id from the route
  const id = params.id;

  useEffect(() => {
    const fetchResults = async () => {
      const response = await axios.get(`http://localhost:3003/results/${id}`);
      setResults(response.data);
      console.log(response.data);
    };
    fetchResults();
  }, [id]);

  // Example logic to determine result based on id

  //console.log(results.data)
  return (
    <Container className="my-5">
      <Col className="w-full bg-emerald-100 rounded-xl p-5">
        {results?.results}
      </Col>
      <Button
        variant="light"
        className="w-100 mb-2 mt-3"
        onClick={() => router.push("/home")}
      >
        Go Home
      </Button>
      {message && (
        <Alert variant="info" className="mt-4">
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default ResultPage;
