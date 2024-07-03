// components/Header.js
import React, { useEffect } from "react";
import { Navbar, Container, Row, Col, Button } from "react-bootstrap";
import { useAuth, useAuthDispatch } from "@/app/AppContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const { username, credits } = useAuth();
  const dispatch = useAuthDispatch();
  const router = useRouter();
  useEffect(() => {
    username === "" && router.replace("/");
  }, [username]);

  return (
    <Navbar bg="light" className="w-full h-20">
      <Container className="position-absolute top-0 w-full bg-emerald-900 rounded-br-xl">
        <Col className="w-full">
          <Row className="w-full bg-emerald-900">
            <Button
              onClick={() => {
                dispatch({
                  type: "logout",
                });
                router.replace("/");
              }}
              className="text-center w-20 m-1 bg-white text-black"
            >
              <div className="p-1">logout</div>
            </Button>
            {username && (
              <>
                <Col className="text-center bg-emerald-900">
                  <div className="p-3 text-white">username: {username}</div>
                </Col>
                <Col className="text-center bg-emerald-900">
                  <div className="p-3 text-white">credits: {credits}</div>
                </Col>
              </>
            )}
          </Row>
        </Col>
      </Container>
    </Navbar>
  );
};

export default Header;
