import { useState } from "react";
import { Search, Edit, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { useDeleteUserMutation, useGetUsersQuery } from "../../features/adminApi";
import type { UserProfile } from "../../features/auth/types";


// interface User {
//   id: number;
//   username: string;
//   email: string;
//   phone_number?: string;
//   balance: number;
// }

export default function AdminUsers() {
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading, isError } = useGetUsersQuery();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;

    const toastId = toast.loading("Deleting user...");

    try {
      await deleteUser(id).unwrap();

      toast.update(toastId, {
        render: "User deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch {
      toast.update(toastId, {
        render: "Failed to delete user",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const filtered = users.filter(
    (u: UserProfile) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full text-black">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

        <h1 className="text-2xl font-bold">Users</h1>

        <div className="flex items-center border rounded-lg px-3 py-2 bg-white shadow-sm w-full md:w-72">
          <Search size={16} className="text-gray-400 mr-2" />
          <input
            placeholder="Search users..."
            className="outline-none text-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

      </div>

      <div className="bg-white shadow rounded-xl overflow-hidden">

        {isLoading && (
          <div className="p-6 text-center text-gray-500">
            Loading users...
          </div>
        )}

        {isError && (
          <div className="p-6 text-center text-red-500">
            Failed to load users
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No users found
          </div>
        )}

        {filtered.length > 0 && (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Balance</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((user: UserProfile) => (

                  <tr key={user.id} className="border-b hover:bg-gray-50">

                    <td className="p-3 font-medium">{user.username}</td>

                    <td className="p-3 text-gray-600">{user.email}</td>

                    <td className="p-3">{user.phone_number || "-"}</td>

                    <td className="p-3 font-semibold text-blue-600">
                      ${user.balance}
                    </td>

                    <td className="p-3 flex gap-2">

                      <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
                        <Edit size={14} />
                      </button>

                      <button
                        disabled={deleting}
                        onClick={() => handleDelete(user.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
                      >
                        <Trash size={14} />
                      </button>

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
}