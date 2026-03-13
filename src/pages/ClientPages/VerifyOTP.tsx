import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useVerifyOtpMutation } from "../../features/auth/authApi";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp({ email: state.email, otp }).unwrap();
      toast.success("OTP verified");
      navigate("/new-password", { state });
    } catch {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Verify OTP</h2>
        <input
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;