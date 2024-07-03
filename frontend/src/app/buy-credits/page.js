"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Button, Form, Modal, Alert, Col } from "react-bootstrap";
import axios from "axios";
import { useAuth, useAuthDispatch } from "@/app/AppContext";

const HomePage = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [numCredits, setNumCredits] = useState("");
  const { username, credits } = useAuth();
  const dispatch = useAuthDispatch();

  const addCredits = async (num_credits, username, setMessage) => {
    // Ensure num_credits is greater than 0
    if (num_credits <= 0) {
      setMessage("Credits should be positive integers!");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/users/${username}/add-credit`, {
        credits: num_credits,
      });

      dispatch({
        type: "addCredits",
        credits: num_credits,
      });

      setMessage(`Successfully added ${num_credits} credit(s).`);
    } catch (error) {
      console.error("Error adding credit:", error);
      setMessage("Error adding credit.");
    }
  };
  return (
    <Container className="my-5 w-full">
      <Col>
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
          className="w-100 mb-2 mt-16"
          onClick={() => addCredits(parseInt(numCredits), username, setMessage)}
        >
          Buy Credits
        </Button>
        <Button
          variant="light"
          className="w-100 mb-2 mt-3"
          onClick={() => router.push("/home")}
        >
          Go Home
        </Button>
      </Col>
      {message && (
        <Alert variant="info" className="mt-4">
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default HomePage;
