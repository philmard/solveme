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
import { useAuth } from "@/app/AppContext";

const submitProblem = async (
  username,
  selectedPyFile,
  selectedJsonFile,
  numVehicles,
  depot,
  maxDistance,
  setMessage,
  name
) => {
  try {
    // Fetch user data to check credits
    const response = await axios.get(`http://localhost:3001/users/${username}`);
    const { credits } = response.data;

    // Check if user has at least 1 credit
    if (credits >= 1) {
      // Call remove-credit endpoint
      await axios.put(`http://localhost:3001/users/${username}/remove-credit`);

      // Fetch user data to get the updated credits
      const response = await axios.get(
        `http://localhost:3001/users/${username}`
      );
      const { credits } = response.data;

      console.log("Successfully Removed 1 credit. Total credits: ", credits);
      setMessage("Successfully Removed 1 credit. Total credits: ", credits);
      const metadata = { username, name };
      // RUN THE SOLVER HERE
      if (selectedPyFile && selectedJsonFile) {
        const formData = new FormData();
        formData.append("py_file", selectedPyFile);
        formData.append("json_file", selectedJsonFile);
        formData.append("num_vehicles", numVehicles);
        formData.append("depot", depot);
        formData.append("max_distance", maxDistance);
        formData.append("metadata", JSON.stringify(metadata));

        setMessage("Running Solver...");

        const solveResponse = await axios.post(
          "http://localhost:5002/solve",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Solver Done...", solveResponse.data);
        setMessage("Solver Done: " + JSON.stringify(solveResponse.data));
      } else {
        console.log("No file selected.");
        setMessage("No file selected.");
      }
    } else {
      // if credits = 0
      console.log("Insufficient Credits."); // ta credits tha parameinoun 0. de tha ginoun arnhtika.
      setMessage("Insufficient Credits.");
    }
  } catch (error) {
    console.error("Error submitting problem:", error);
    setMessage("Error submitting problem.");
    // Optionally, handle the error
  }
};

const NewSubmissionPage = () => {
  const router = useRouter();
  const [numCredits, setNumCredits] = useState("");
  const [sessionUsername, setSessionUsername] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPyFile, setSelectedPyFile] = useState(null);
  const [selectedJsonFile, setSelectedJsonFile] = useState(null);
  const [numVehicles, setNumVehicles] = useState("");
  const [depot, setDepot] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [name, setName] = useState("");
  const { username } = useAuth();

  useEffect(() => {
    username === "" && router.replace("/");
  }, [username]);

  const handlePyFileChange = (event) => {
    setSelectedPyFile(event.target.files[0]);
  };

  const handleJsonFileChange = (event) => {
    setSelectedJsonFile(event.target.files[0]);
  };

  return (
    <Container className="my-5 text-center">
      <div className="bg-secondary p-5 mb-4">big solveME photo</div>
      <Row className="justify-content-center">
        <Col md={4}>
          <h2>Submit Problem</h2>
          <Button
            variant="light"
            className="w-100 mb-2 mt-3"
            onClick={() =>
              submitProblem(
                username,
                selectedPyFile,
                selectedJsonFile,
                numVehicles,
                depot,
                maxDistance,
                setMessage,
                name
              )
            }
          >
            Submit Problem
          </Button>
        </Col>
        <Col md={4}>
          <h4>Upload Python File</h4>
          <input type="file" onChange={handlePyFileChange} className="mb-2" />
          <h4>Upload JSON File</h4>
          <input type="file" onChange={handleJsonFileChange} className="mb-2" />
          <Button
            variant="light"
            className="w-100 mb-2 mt-3"
            onClick={() => router.push("/home")}
          >
            Go Home
          </Button>
        </Col>
        <Col md={4}>
          <Form.Group controlId="name" className="mt-2">
            <Form.Label>name</Form.Label>
            <Form.Control
              type="string"
              placeholder="enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="numVehicles" className="mt-2">
            <Form.Label>num_vehicles</Form.Label>
            <Form.Control
              as="select"
              value={numVehicles}
              onChange={(e) => setNumVehicles(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Select number of vehicles
              </option>
              <option value="1">1</option>
              <option value="3">3</option>
              <option value="10">10</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="depot" className="mt-2">
            <Form.Label>depot</Form.Label>
            <Form.Control
              as="select"
              value={depot}
              onChange={(e) => setDepot(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Select depot
              </option>
              <option value="1">1</option>
              <option value="10">10</option>
              <option value="100">100</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="maxDistance" className="mt-2">
            <Form.Label>max_distance</Form.Label>
            <Form.Control
              as="select"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Select max distance
              </option>
              <option value="100000">100 km</option>
              <option value="200000">200 km</option>
              <option value="500000">500 km</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      {message && (
        <Alert variant="info" className="mt-4">
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default NewSubmissionPage;