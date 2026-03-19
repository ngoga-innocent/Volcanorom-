import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaMoneyBill,
  FaWallet,
  FaBox,
  FaComments,
  // FaCog,
  FaTimes,
  FaJediOrder,
} from "react-icons/fa";
import { ImageDown } from "lucide-react";
import { useGetMyOrdersQuery } from "../../features/orderApi";
import { useGetTransactionsQuery } from "../../features/adminApi";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }: any) => {
  const { data: transactions = [] } = useGetTransactionsQuery(undefined,{pollingInterval:5000});
  const { data: orders = [] } = useGetMyOrdersQuery(undefined,{pollingInterval:5000});

  const pendingTransactions = transactions.filter(
    (t: any) => t.status === "pending",
  ).length;

  const pendingOrders = orders.filter(
    (o: any) => o.status === "pending",
  ).length;
  // const menu = [
  //   { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
  //   { name: "Users", icon: <FaUsers />, path: "/admin/users" },
  //   { name: "Transactions", icon: <FaMoneyBill />, path: "/admin/transactions" },
  //   { name: "Deposits", icon: <FaWallet />, path: "/deposit" },
  //   { name: "Softwares", icon: <FaBox />, path: "/admin/softwares" },
  //   { name: "Chats", icon: <FaComments />, path: "/admin/chats" },
  //   { name: "orders", icon: <FaJediOrder />, path: "/admin/orders" },
  //   { name: "Hero", icon: <ImageDown />, path: "/admin/hero" }
  // ];
  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    {
      name: "Transactions",
      icon: <FaMoneyBill />,
      path: "/admin/transactions",
      badge: pendingTransactions,
    },
    { name: "Deposits", icon: <FaWallet />, path: "/deposit" },
    { name: "Softwares", icon: <FaBox />, path: "/admin/softwares" },
    { name: "Chats", icon: <FaComments />, path: "/admin/chats" },
    {
      name: "Orders",
      icon: <FaJediOrder />,
      path: "/admin/orders",
      badge: pendingOrders,
    },
    { name: "Hero", icon: <ImageDown />, path: "/admin/hero" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:static z-50 top-0 left-0 h-full w-64 bg-gray-900 text-white
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Admin Panel</h2>

            <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-2">
            {menu.map((item) => (
              // <Link
              //   key={item.name}
              //   to={item.path}
              //   className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition"
              //   onClick={() => setSidebarOpen(false)}
              // >
              //   <span className="text-lg">{item.icon}</span>
              //   {item.name}
              // </Link>
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center justify-between p-3 rounded hover:bg-gray-700 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </div>

                {/* BADGE */}
                {item?.badge && item?.badge >= 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
