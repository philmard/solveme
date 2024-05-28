import React from "react";
import { Container, Button, Alert, Row, Col } from "react-bootstrap";
import { Button as MyButton } from "@altify/components";

export default function Landing() {
  return (
    <Container className="my-5 text-center">
      <div className="bg-secondary p-5 mb-4">big solveME photo</div>
      <Row className="justify-content-center">
        <Col md={2}>
          <MyButton
            onPress={() => {}}
            text={"ewgwe"}
            size={"large"}
            type={"primary"}
          />
          <Button variant="light" className="w-100 mb-2">
            About
          </Button>
        </Col>
        <Col md={2}>
          <Button variant="light" className="w-100 mb-2">
            Demo
          </Button>
        </Col>
        <Col md={2}>
          <Button variant="light" className="w-100 mb-2">
            Instructions
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
