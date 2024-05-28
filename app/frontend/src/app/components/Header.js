// components/Header.js
import React from "react";
import { Navbar, Container, Row, Col } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="p-3">
      <Container fluid>
        <Col className="w-100">
          <Col className="text-center">
            <div className="bg-secondary p-3">solveME logo area (70%)</div>
          </Col>
          <Row>
            <Col md={7} className="text-center">
              <div className="p-3">login</div>
            </Col>
            <Col md={3} className="text-center">
              <div className="p-3">system info: date/time, health, ...</div>
            </Col>
          </Row>
        </Col>
      </Container>
    </Navbar>
  );
};

export default Header;
