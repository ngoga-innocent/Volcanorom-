import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaMoneyBill,
  FaWallet,
  FaBox,
  FaComments,
  // FaCog,
  FaTimes
} from "react-icons/fa";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }: any) => {

  const menu = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dashboard" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Transactions", icon: <FaMoneyBill />, path: "/admin/transactions" },
    { name: "Deposits", icon: <FaWallet />, path: "/deposit" },
    { name: "Softwares", icon: <FaBox />, path: "/admin/softwares" },
    { name: "Chats", icon: <FaComments />, path: "/admin/chats" },
    // { name: "Settings", icon: <FaCog />, path: "/admin/settings" }
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

            <button
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-2">

            {menu.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}

          </nav>

        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;