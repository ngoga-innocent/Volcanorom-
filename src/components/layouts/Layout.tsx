import type { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";


interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "80vh",
          background: "var(--bg-light)",
          padding: "2rem"
        }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}