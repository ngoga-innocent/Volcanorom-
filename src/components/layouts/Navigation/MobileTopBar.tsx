import { Link, useNavigate } from "react-router-dom";
import {  FaUser } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import type { RootState } from "../../../app/store";
import { useState } from "react";
import { logout } from "../../../redux/slices/authSlice";
import Logo from '../../../assets/cuckoo.png'
const MobileTopBar = () => {
  const { access, user } = useAppSelector((state: RootState) => state.auth);
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  return (
    <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10 shadow-md">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold tracking-wider flex flex-row-reverse items-center gap-x-2 text-white">
          VOLCANOROM
          <img src={Logo} className="w-8 h-8 rounded-full" alt="" />
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {/* Admin Dashboard */}
          {user?.is_staff && (
            <Link
              to="/admin/dashboard"
              className="text-sm font-semibold bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
            >
              Dashboard
            </Link>
          )}

          {/* Notifications */}
          {/* <button className="relative p-2 rounded hover:bg-white/10 transition">
            <FaBell className="text-white text-lg" />
            
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-semibold">
              2
            </span>
          </button> */}

          {/* Profile / Login */}
          {access ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="p-2 rounded hover:bg-white/10 transition"
              >
                <FaUser className="text-white text-lg" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-white hover:underline transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileTopBar;
