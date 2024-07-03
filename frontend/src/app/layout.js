"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Footer, Header } from "./components";
import { AppProvider } from "@/app/AppContext";
import { useRouter } from "next/navigation";
import "../output.css";
import { Col } from "react-bootstrap";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const router = useRouter();

  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Header />
          <Col className="h-100">{children}</Col>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
