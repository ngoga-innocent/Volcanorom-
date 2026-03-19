import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../features/auth/authApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // ✅ Basic validation
    if (!form.username || !form.email || !form.password) {
      setFormError("Please fill all required fields");
      return;
    }

    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        phone_number: form.phone_number,
      }).unwrap();

      navigate("/login");
    } catch (err: any) {
      if (err?.data) {
        // Handle Django field errors
        // console.log(err)
        const firstError =
          err.data.username?.[0] ||
          err.data.email?.[0] ||
          err.data.password?.[0] ||
          err.data.detail;

        setFormError(firstError || "Registration failed");
      } else {
        setFormError("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-blue-950 to-blue-900 px-4">
      <div className="w-full max-w-md bg-linear-to-b from-blue-950 to-blue-900 rounded-3xl shadow-2xl p-8 text-white">

        <h2 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h2>

        <p className="text-gray-400 text-center text-sm mb-8">
          Join us and start your journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full bg-blue-800/40 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full bg-blue-800/40 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="phone_number"
            placeholder="Phone Number"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full bg-blue-800/40 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full bg-blue-800/40 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full bg-blue-800/40 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Error */}
          {formError && (
            <p className="text-red-400 text-sm text-center">
              {formError}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-blue-900 font-semibold py-3 rounded-full hover:bg-gray-200 transition flex justify-center items-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <span
            className="text-white cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;