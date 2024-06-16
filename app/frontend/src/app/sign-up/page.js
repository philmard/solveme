"use client";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Button, Form, Modal, Alert, Col } from "react-bootstrap";
import axios from "axios";
import { useAuthDispatch } from "@/app/AppContext";

const SignupPage = () => {
  const router = useRouter();
  const dispatch = useAuthDispatch();

  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [message, setMessage] = useState("");

  const signup = async (username, password, setMessage, router) => {
    try {
      const response = await axios.post("http://localhost:3001/users", {
        username,
        password,
      });
      setMessage("User created successfully: " + response.data.username);
      dispatch({
        type: "signup",
        username: username,
      });
      router.push("/home"); // reroute to login page after successfull signup
    } catch (error) {
      console.log("Error creating user:", error.response.data.message);
      setMessage(`${error.response.data.message}`);
    }
  };

  return (
    <Container className="my-5">
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
            onClick={() => {
              signup(signupUsername, signupPassword, setMessage, router);
            }}
          >
            signup
          </Button>
          <Button
            variant="light"
            className="w-100 mb-2 mt-3"
            onClick={() => router.replace("/")}
          >
            Go Back
          </Button>
        </Form>
      </Col>
      {message && (
        <Alert variant="info" className="mt-4">
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default SignupPage;
