import React, { useEffect } from "react";
import { Navbar, Container, Row, Col, Button } from "react-bootstrap";
import { useAuth, useAuthDispatch } from "@/app/AppContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const { username, credits } = useAuth();
  const dispatch = useAuthDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!username) {
      router.replace("/");
    }
  }, [username, router]);

  return (
    <Navbar bg="emerald" className="w-full h-20">
      <Container fluid className="bg-emerald-900 ">
        <Row className="w-full bg-emerald-900">
          <Col className="flex justify-between items-center">
            <Button
              onClick={() => {
                dispatch({ type: "logout" });
                router.replace("/");
              }}
              className="text-center w-20 m-1 bg-white text-black"
            >
              <div className="p-1">Logout</div>
            </Button>
            {username && (
              <>
                <div className="text-center text-white p-3 font-bold">
                  Username: {username}
                </div>
                <div className="text-center text-white p-3 font-bold">
                  Credits: {credits}
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Header;
