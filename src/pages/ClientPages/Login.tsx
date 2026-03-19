import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginRequest } from "../../features/auth/types";
import { useLoginMutation } from "../../features/auth/authApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAppDispatch } from "../../redux/hooks";
import { setCredentials, setUser } from "../../redux/slices/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();
  // const {data:profile}=useGetProfileQuery()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.email || !form.password) {
      setFormError("All fields are required");
      return;
    }

    try {
      const res = await login(form).unwrap();

      // console.log("LOGIN RESPONSE:", res);

      localStorage.setItem("access", res.access);
      localStorage.setItem("refresh", res.refresh);
      localStorage.setItem("profile", JSON.stringify(res.profile));

      // const isAdmin = res?.profile?.is_staff;
      dispatch(setCredentials(res));
      dispatch(setUser(res.profile));
      // console.log("IS ADMIN:", isAdmin);

      navigate(!res.profile.is_staff ? "/admin/dashboard" : "/");
      
    } catch (err: any) {
      // console.log(err);

      if (err?.data?.error) {
        setFormError(err.data.error);
      } else {
        setFormError("Invalid email or password");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-blue-950 to-blue-900 px-4">
      <div className="w-full max-w-md bg-linear-to-b from-blue-950 to-blue-900 rounded-3xl shadow-2xl p-8 text-white">
        <h2 className="text-3xl font-bold text-center mb-2">Login</h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          Welcome back! Please enter your details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="text"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full mt-2 px-4 py-3 rounded-full bg-blue-800/40 border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm text-gray-400">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
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

          {/* Error Message */}
          {formError && (
            <p className="text-red-400 text-sm text-center">{formError}</p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-blue-900 font-semibold py-3 rounded-full hover:bg-gray-200 transition duration-300 flex justify-center items-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login now"
            )}
          </button>
        </form>
        <p
          className="text-sm text-gray-400 mt-3 text-center cursor-pointer hover:text-blue-400"
          onClick={() => navigate("/reset-password")}
        >
          Forgot Password?
        </p>
      </div>
    </div>
  );
}
