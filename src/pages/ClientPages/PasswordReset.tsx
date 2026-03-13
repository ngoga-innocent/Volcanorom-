import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRequestPasswordResetMutation } from "../../features/auth/authApi";
import { FaEnvelope } from "react-icons/fa";

const RequestReset = () => {
  const [email, setEmail] = useState("");
  const [requestReset, { isLoading, isError, isSuccess }] = useRequestPasswordResetMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      await requestReset({ email }).unwrap();
      toast.success("OTP sent to your email");
      navigate("/new-password", { state: { email } });
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-blue-950 to-blue-900 px-4">
      <div className="w-full max-w-md bg-linear-to-b from-blue-950 to-blue-900 rounded-3xl shadow-2xl p-8 text-white">
        <h2 className="text-3xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          Enter your email and we will send you a one-time password (OTP)
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoFocus
              className="w-full mt-2 px-4 py-3 rounded-full bg-blue-800/40 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaEnvelope className="absolute right-4 top-11 text-gray-400" />
          </div>

          {isError && (
            <p className="text-red-400 text-sm text-center">
              Failed to send email, try again
            </p>
          )}
          {isSuccess && (
            <p className="text-green-400 text-sm text-center">
              OTP sent! Redirecting...
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !email}
            className={`w-full bg-white text-blue-900 font-semibold py-3 rounded-full hover:bg-gray-200 transition duration-300 flex justify-center items-center ${
              (!email || isLoading) && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestReset;