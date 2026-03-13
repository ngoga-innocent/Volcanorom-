import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../../pages/ClientPages/Home";
import PublicRoute from "./PublicRoutes";
import Login from "../../pages/ClientPages/Login";
import Register from "../../pages/ClientPages/Register";
import RequestReset from "../../pages/ClientPages/PasswordReset";
import VerifyOtp from "../../pages/ClientPages/VerifyOTP";
import NewPassword from "../../pages/ClientPages/NewPassword";
import ProtectedRoute from "./ProtectedRoutes";
import Profile from "../../pages/ClientPages/Profile";
import NotFound from "../../pages/NotFound";
import Deposit from "../../pages/ClientPages/Deposit";
import AdminDashboard from "../../pages/AdminPages/Dashboard";
import AdminLayout from "../layouts/AdminLayout";
import AdminUsers from "../../pages/AdminPages/User";
import AdminTransactions from "../../pages/AdminPages/Transactions";
import SoftwareManager from "../../pages/AdminPages/SoftwareManagement";
import SoftwareDetails from "../../pages/CommonPages/SoftwareDetails";
import UploadSoftware from "../../pages/AdminPages/UploadSoftware";
import SoftwareStore from "../../pages/ClientPages/Store";
import AdminChatsPage from "../../pages/AdminPages/AdminChat";
import About from "../../pages/ClientPages/FooterPages/AboutUs";
import Contact from "../../pages/ClientPages/FooterPages/Contact";
import Terms from "../../pages/ClientPages/FooterPages/Term";
import Refund from "../../pages/ClientPages/FooterPages/Refund";
import HelpCenter from "../../pages/ClientPages/FooterPages/HelpCenter";
import PaymentResult from "../../pages/CommonPages/PaymentResult";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/software/:id" element={<SoftwareDetails />} />
        <Route path="/store" element={<SoftwareStore />} />
        <Route path="/about" element={<About />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        
        <Route path="/contact" element={<Contact />} />

        <Route path="/help" element={<HelpCenter />} />
        <Route path="/terms" element={<Terms />} />
        {/* <Route path="/privacy" element={<Privacy />} /> */}
        <Route path="/refund" element={<Refund />} />
        {/* Public only (not logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<RequestReset />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/new-password" element={<NewPassword />} />
        </Route>

        {/* Protected Pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/deposit" element={<Deposit />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="softwares" element={<SoftwareManager />} />
          <Route path="upload-software" element={<UploadSoftware />} />
          <Route path="chats" element={<AdminChatsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
