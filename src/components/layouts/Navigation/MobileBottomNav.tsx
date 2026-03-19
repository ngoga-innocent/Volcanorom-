import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaStore,
  FaCoins,
  FaDownload,
  // FaUser,
  //   FaDownload
} from "react-icons/fa";
import { useGetMyOrdersQuery } from "../../../features/orderApi";
// import { useGetTransactionsQuery } from "../../../features/adminApi";
import { useGetMyTransactionsQuery } from "../../../features/auth/authApi";

const MobileBottomNav = () => {
  const location = useLocation();
  const { data: orders = [] } = useGetMyOrdersQuery();
  const { data: transactions = [] } = useGetMyTransactionsQuery();

  const pendingOrders = orders.filter(
    (o: any) => o.status === "pending",
  ).length;

  const pendingTransactions = transactions.filter(
    (t: any) => t.status === "pending",
  ).length;
  // const tabs = [
  //   { name: "Home", path: "/", icon: FaHome },
  //   { name: "Services", path: "/store", icon: FaStore },
  //   { name: "Add Credits", path: "/deposit", icon: FaCoins },
  //   { name: "My Orders", path: "/my-orders", icon: FaDownload },
  //   // { name: "Profile", path: "/profile", icon: FaUser },
  // ];
  const tabs = [
    { name: "Home", path: "/", icon: FaHome },
    { name: "Services", path: "/store", icon: FaStore },
    {
      name: "Add Credits",
      path: "/deposit",
      icon: FaCoins,
      badge: pendingTransactions >0 && pendingTransactions,
    },
    {
      name: "My Orders",
      path: "/my-orders",
      icon: FaDownload,
      badge: pendingOrders >0 && pendingOrders,
      // badge:1
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
      <div className="flex justify-between items-center px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = location.pathname === tab.path;

          return (
            // <Link
            //   key={tab.name}
            //   to={tab.path}
            //   className="flex flex-col items-center justify-center relative w-full"
            // >
            //   {/* Active pill */}
            //   {active && (
            //     <span className="absolute -top-2 w-10 h-1 rounded-full bg-blue-400" />
            //   )}

            //   <Icon
            //     size={22}
            //     className={`transition-all duration-200 ${
            //       active ? "text-blue-400 scale-110" : "text-gray-400"
            //     }`}
            //   />

            //   <span
            //     className={`text-[11px] mt-1 ${
            //       active ? "text-blue-400" : "text-gray-400"
            //     }`}
            //   >
            //     {tab.name}
            //   </span>
            // </Link>
            <Link
              key={tab.name}
              to={tab.path}
              className="flex flex-col items-center justify-center relative w-full"
            >
              {/* Active pill */}
              {active && (
                <span className="absolute -top-2 w-10 h-1 rounded-full bg-blue-400" />
              )}

              {/* ICON WRAPPER (needed for badge positioning) */}
              <div className="relative">
                <Icon
                  size={22}
                  className={`transition-all duration-200 ${
                    active ? "text-blue-400 scale-110" : "text-gray-400"
                  }`}
                />

                {/* 🔴 BADGE */}
                {tab?.badge && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-px rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>

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
