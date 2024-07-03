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

      <Col className="w-full flex h-50 mt-3">
        <div className="overflow-y-auto max-h-96 p-4 bg-emerald-200 w-full rounded-xl">
          <Col className="flex ml-5">
            <Container className="flex-1 ml-5 ">name</Container>
            <Container className="flex-1 mx-5">status</Container>
            <Container className="flex-1 ml-5 ">created on</Container>
            <Container className="flex-1 ml-5 "></Container>
          </Col>
          {problems?.length > 0 ? (
            problems?.map(({ name, state, createdOn, submissionId }) => (
              <Col
                key={submissionId}
                className="flex bg-amber-950 rounded-xl py-1 px-1 mb-2"
              >
                <Container className="flex-1 mr-5 bg-white rounded-xl h-10 items-center justify-center d-flex">
                  {name}
                </Container>
                <Container className="flex-1 mx-5 bg-white rounded-xl items-center justify-center d-flex">
                  {state}
                </Container>
                <Container className="flex-1 ml-5 bg-white rounded-xl items-center justify-center d-flex">
                  {createdOn}
                </Container>
                <Button
                  className="flex-1 ml-5 bg-white text-black items-center justify-center d-flex"
                  disabled={state !== "solved"}
                  onClick={() => router.push(`result/${submissionId}`)}
                >
                  View Results
                </Button>
              </Col>
            ))
          ) : (
            <Container className={"m-auto"}>No Submissions Found</Container>
          )}
        </div>
      </Col>
      <Button
        variant="light"
        className="w-100 mb-2 mt-5"
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
