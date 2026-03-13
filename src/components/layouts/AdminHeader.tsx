import { FaBars } from "react-icons/fa";

const AdminHeader = ({ setSidebarOpen }: any) => {

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden text-black text-xl"
      >
        <FaBars />
      </button>

      <h1 className="text-lg md:text-xl font-semibold">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-4">

        <span className="text-gray-600 hidden sm:block">
          Admin
        </span>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </header>
  );
};

export default AdminHeader;