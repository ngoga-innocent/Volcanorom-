import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaStore,
  FaCoins,
  // FaUser,
//   FaDownload
} from "react-icons/fa";

const MobileBottomNav = () => {
  const location = useLocation();

  const tabs = [
    { name: "Home", path: "/", icon: FaHome },
    { name: "Buy Tools", path: "/store", icon: FaStore },
    { name: "Add Credits", path: "/deposit", icon: FaCoins },
    // { name: "Downloads", path: "/downloads", icon: FaDownload },
    // { name: "Profile", path: "/profile", icon: FaUser },
  ];

  return (
    <nav className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">

      <div className="flex justify-between items-center px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-xl">

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = location.pathname === tab.path;

          return (
            <Link
              key={tab.name}
              to={tab.path}
              className="flex flex-col items-center justify-center relative w-full"
            >
              {/* Active pill */}
              {active && (
                <span className="absolute -top-2 w-10 h-1 rounded-full bg-blue-400" />
              )}

              <Icon
                size={22}
                className={`transition-all duration-200 ${
                  active
                    ? "text-blue-400 scale-110"
                    : "text-gray-400"
                }`}
              />

              <span
                className={`text-[11px] mt-1 ${
                  active ? "text-blue-400" : "text-gray-400"
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}

      </div>

    </nav>
  );
};

export default MobileBottomNav;