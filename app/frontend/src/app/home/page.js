"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Button, Alert, Col, Row } from "react-bootstrap";
import { useAuth } from "@/app/AppContext";
import axios from "axios";

const HomePage = () => {
  const router = useRouter();
  const { username, credits } = useAuth();
  const [message, setMessage] = useState("");
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    username === "" && router.replace("/");
  }, [username]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        if (username) {
          const response = await axios.get(
            `http://localhost:5002/problems/${username}`,
          );
          setProblems(response.data);
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchProblems();
  }, [username]);

  return (
    <Container className="my-10 w-full items-center">
      <Col className="w-full h-15" md={4}>
        <h1>My Submissions</h1>
      </Col>
      <Col md={4} className="w-full flex">
        {problems?.length > 0 ? (
          problems?.map(({ name, state, createdOn, submissionId }) => (
            <Col className="flex bg-gray-400 py-1 px-1">
              <Container className="flex-1 mr-5 bg-white h-10 items-center justify-center flex">
                {name}
              </Container>
              <Container className="flex-1 mx-5 bg-white items-center justify-center flex">
                {state}
              </Container>
              <Container className="flex-1 ml-5 bg-white items-center justify-center flex">
                {createdOn}
              </Container>
              <Button
                className="flex-1 ml-5 bg-white text-black items-center justify-center flex"
                disabled={state !== "solved"}
                onClick={() => router.push(`result/${submissionId}`)}
              >
                View Results
              </Button>
            </Col>
          ))
        ) : (
          <></>
        )}
      </Col>
      <Button
        variant="light"
        className="w-100 mb-2 mt-3"
        onClick={() => router.push("/new-submission")}
      >
        New Problem
      </Button>
      <Button
        variant="light"
        className="w-100 mb-2 mt-3"
        onClick={() => router.push("/buy-credits")}
      >
        Buy Credits
      </Button>
      {message && (
        <Alert variant="info" className="mt-4">
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default HomePage;