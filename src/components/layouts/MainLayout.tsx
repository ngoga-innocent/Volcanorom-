import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ClientChatWidget from "../ChatComponent/ChatWidget";


const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh" }}>
        <Outlet />
        <ClientChatWidget />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;