// Ensure the component is treated as a client component
"use client";

import axios from "axios";
import React, { useState } from "react";
import {
  Container,
  Button,
  Alert,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  return (
    <Container className="my-10 text-center">
      <Row className="justify-content-center my-40">
        <div className="p-5 mb-4 text-8xl">SolveMe</div>

        <Col md={4}>
          <Button
            variant="light"
            className="w-100 mb-2 mt-3"
            onClick={() => router.push("/login")}
          >
            login
          </Button>
        </Col>
        <Col md={4}>
          <Button
            variant="light"
            className="w-100 mb-2 mt-3"
            onClick={() => router.push("/sign-up")}
          >
            signup
          </Button>
        </Col>
      </Row>
      {message && (
        <Alert variant="info" className="mt-4">
          {message}
        </Alert>
      )}
    </Container>
  );
}
