import { useEffect, useState } from "react";
import axios from "axios";
import url from "../../url";
import { Users, Wallet, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  email: string;
  phone_number?: string;
  balance: number;
}

interface Transaction {
  id: number;
  user: User;
  amount: number;
  type: string;
  status: string;
  reference: string;
  created_at: string;
}

const AdminDashboard = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTxs, setLoadingTxs] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchUsers();
    fetchTransactions();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/dashboard/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);

    } catch (err: any) {

      if (err?.response?.status === 401) {
        navigate("/login");
      }

      console.error(err);

    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTransactions = async () => {
    try {

      const res = await axios.get(`${url}/dashboard/transactions/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTxs(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {

      await axios.post(`${url}/dashboard/${id}/approve/`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === id ? { ...tx, status: "completed" } : tx
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: number) => {
    try {

      await axios.post(`${url}/dashboard/reject/${id}/`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === id ? { ...tx, status: "rejected" } : tx
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  const pendingDeposits = transactions.filter(
    (tx) => tx.status === "pending"
  ).length;

  return (
    <div className="w-full text-black">

      {/* Page Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">

        <div className="bg-white shadow rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-2xl md:text-3xl font-bold">
              {users.length}
            </h2>
          </div>
          <Users className="text-blue-500" size={36} />
        </div>

        <div className="bg-white shadow rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Transactions</p>
            <h2 className="text-2xl md:text-3xl font-bold">
              {transactions.length}
            </h2>
          </div>
          <Wallet className="text-green-500" size={36} />
        </div>

        <div className="bg-white shadow rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Pending Deposits</p>
            <h2 className="text-2xl md:text-3xl font-bold">
              {pendingDeposits}
            </h2>
          </div>
          <Clock className="text-orange-500" size={36} />
        </div>

      </div>

      {/* Transactions */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">

        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Wallet Transactions
        </h2>

        {loadingTxs ? (
          <p className="text-gray-500">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found</p>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Reference</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>

                {transactions.map((tx) => (

                  <tr key={tx.id} className="border-b hover:bg-gray-50">

                    <td className="p-3 font-medium">
                      {tx.user.username}
                    </td>

                    <td className="p-3 font-semibold text-green-600">
                      ${tx.amount}
                    </td>

                    <td className="p-3 capitalize">
                      {tx.type}
                    </td>

                    <td className="p-3">

                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium
                        ${
                          tx.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : tx.status === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tx.status}
                      </span>

                    </td>

                    <td className="p-3 text-gray-500">
                      {tx.reference}
                    </td>

                    <td className="p-3">

                      {tx.status === "pending" && tx.type === "manual" && (

                        <div className="flex flex-wrap gap-2">

                          <button
                            onClick={() => handleApprove(tx.id)}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => handleReject(tx.id)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                          >
                            Reject
                          </button>

                        </div>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Users */}
      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Users
        </h2>

        {loadingUsers ? (
          <p className="text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No users found</p>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Balance</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.id} className="border-b hover:bg-gray-50">

                    <td className="p-3 font-medium">
                      {user.username}
                    </td>

                    <td className="p-3 text-gray-600">
                      {user.email}
                    </td>

                    <td className="p-3">
                      {user.phone_number || "-"}
                    </td>

                    <td className="p-3 font-semibold text-blue-600">
                      ${user.balance}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminDashboard;