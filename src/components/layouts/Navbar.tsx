import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useState } from "react";
import type { RootState } from "../../app/store";
import { logout } from "../../redux/slices/authSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";

import MobileBottomNav from "./Navigation/MobileBottomNav";
import MobileTopBar from "./Navigation/MobileTopBar";
import Logo from '../../assets/cuckoo.png'
const Navbar = () => {
  const { access, user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Helper to check active tab
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-slate-900/80 border-b border-white/10 text-white hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-black tracking-wider items-center flex flex-row gap-x-3"
          >
            <img src={Logo} className="w-10 h-10 rounded-full" alt="" />
            <span className="bg-linear-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
               VOLCANOROM
            </span>
            {/* <span className="text-slate-200">ROM</span> */}
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-8 text-sm font-medium">
            <Link
              to="/"
              className={`hover:text-white transition ${isActive("/") ? "text-blue-400" : "text-gray-300"}`}
            >
              Home
            </Link>
            <Link
              to="/store"
              className={`hover:text-white transition ${isActive("/store") ? "text-blue-400" : "text-gray-300"}`}
            >
              Store
            </Link>
            <Link
              to="/deposit"
              className={`hover:text-white transition ${isActive("/deposit") ? "text-blue-400" : "text-gray-300"}`}
            >
              Credits
            </Link>

            {access ? (
              <>
                <Link
                  to="/profile"
                  className={`hover:text-white transition ${isActive("/profile") ? "text-blue-400" : "text-gray-300"}`}
                >
                  Profile
                </Link>
                {user?.is_staff && (
                  <Link
                    to="/admin/dashboard"
                    className={`hover:text-white transition ${isActive("/admin/dashboard") ? "text-blue-400" : "text-gray-300"}`}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-500 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg font-semibold transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile / Tablet Bottom Tabs */}
      <MobileTopBar />
      <MobileBottomNav />
    </>
  );
};

export default Navbar;
