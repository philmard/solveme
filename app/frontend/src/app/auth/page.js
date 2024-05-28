import React from "react";
import { Container, Button, Alert } from "react-bootstrap";

const SignIn = () => {
  return (
    <Container>
      <h1 className="mt-5">Hello, Bootstrap with Next.js!</h1>
      <Alert variant="primary">This is a primary alert—check it out!</Alert>
      <Button variant="primary">Click me</Button>
    </Container>
  );
};
export default SignIn;
