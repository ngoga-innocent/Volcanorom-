import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useConfirmPasswordResetMutation } from "../../features/auth/authApi";

const NewPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = (state as any)?.email || "";

  const [form, setForm] = useState({
    otp: "",
    new_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [confirmReset, { isLoading }] = useConfirmPasswordResetMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.otp || !form.new_password) {
      setError("All fields are required");
      return;
    }

    try {
      await confirmReset({
        email,
        otp: form.otp,
        new_password: form.new_password,
      }).unwrap();

      setSuccess(true);
      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Failed to reset password. Check OTP and try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-blue-950 to-blue-900 px-4">
      <div className="w-full max-w-md bg-linear-to-b from-blue-950 to-blue-900 rounded-3xl shadow-2xl p-8 text-white">
        <h2 className="text-3xl font-bold text-center mb-2">Set New Password</h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          Enter the OTP sent to your email and choose a new password
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* OTP */}
          <div>
            <label className="text-sm text-gray-400">OTP</label>
            <input
              type="text"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
              placeholder="Enter OTP"
              autoFocus
              className="w-full mt-2 px-4 py-3 rounded-full bg-blue-800/40 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="text-sm text-gray-400">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={form.new_password}
              onChange={(e) => setForm({ ...form, new_password: e.target.value })}
              placeholder="Enter new password"
              className="w-full mt-2 px-4 py-3 rounded-full bg-blue-800/40 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-11 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Error / Success */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-400 text-sm text-center">
              Password reset successful! Redirecting to login...
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !form.otp || !form.new_password}
            className={`w-full bg-white text-blue-900 font-semibold py-3 rounded-full hover:bg-gray-200 transition duration-300 flex justify-center items-center ${
              (isLoading || !form.otp || !form.new_password) && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Resetting...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;