import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useAppDispatch } from "../../../redux/hooks";
import type { RootState } from "../../../app/store";
import { useState } from "react";
import { logout } from "../../../redux/slices/authSlice";
import Logo from "../../../assets/cuckoo.png";
import { useSelector } from "react-redux";

const MobileTopBar = () => {
  const { access } = useSelector((state: RootState) => state.auth);

  const storedProfile = localStorage.getItem("profile");
  const user = storedProfile ? JSON.parse(storedProfile) : null;
  const [profileOpen, setProfileOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header
      className="
        lg:hidden
        fixed top-0 left-0 right-0
        z-50
        bg-slate-900/90
        backdrop-blur-md
        border-b border-white/10
      "
    >
      <div className="h-14 px-3 sm:px-4">
        <div className="flex items-center justify-between h-full gap-2">
          {/* LOGO */}
          <Link
            to="/"
            className="
              flex items-center gap-2
              min-w-0 flex-1
              text-white
            "
          >
            <img
              src={Logo}
              className="w-8 h-8 rounded-full shrink-0"
              alt="Logo"
            />

            <span
              className="
                font-bold tracking-wide
                text-sm sm:text-base
                truncate
              "
            >
              VOLCANOROM
            </span>
          </Link>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 shrink-0">
            {/* DASHBOARD */}
            {user?.is_staff && (
              <Link
                to="/admin/dashboard"
                className="
                  flex
                  text-xs font-medium
                  bg-green-600 hover:bg-green-700
                  px-2.5 py-1.5
                  rounded-lg
                  text-white
                  transition
                  whitespace-nowrap
                "
              >
                Dashboard
              </Link>
            )}

            {/* AUTH */}
            {access ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="
                    h-9 w-9
                    flex items-center justify-center
                    rounded-full
                    hover:bg-white/10
                    transition
                    text-white
                  "
                >
                  <FaUser className="text-sm" />
                </button>

                {profileOpen && (
                  <div
                    className="
                      absolute right-0 mt-2
                      w-40
                      z-50
                      bg-white
                      text-gray-800
                      rounded-xl
                      shadow-2xl
                      overflow-hidden
                      border border-gray-100
                    "
                  >
                    <Link
                      to="/profile"
                      className="
                        block px-4 py-3
                        text-sm
                        hover:bg-gray-100
                        transition
                      "
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="
                        w-full text-left
                        px-4 py-3
                        text-sm
                        hover:bg-gray-100
                        transition
                      "
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/login"
                  className="
                    text-sm
                    text-white/90
                    hover:text-white
                    transition
                    whitespace-nowrap
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                    text-sm font-medium
                    bg-blue-600 hover:bg-blue-700
                    px-3 py-1.5
                    rounded-lg
                    text-white
                    transition
                    whitespace-nowrap
                  "
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileTopBar;
