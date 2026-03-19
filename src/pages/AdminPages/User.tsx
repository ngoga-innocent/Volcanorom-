import { useState } from "react";
import { Search, Edit, Trash, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
} from "../../features/adminApi";

import type { UserProfile } from "../../features/auth/types";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const { data: users = [], isLoading } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [createUser] = useCreateUserMutation();

  const filtered = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getRole = (user: UserProfile) => {
    if (user.is_superuser) return "Admin";
    if (user.is_staff) return "Staff";
    return "User";
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

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
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 text-black min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            User Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage all system users and permissions
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center border bg-white rounded-lg px-3 py-2 shadow-sm w-full md:w-80 mb-6">
        <Search size={16} className="text-gray-400 mr-2" />
        <input
          placeholder="Search by username or email..."
          className="outline-none text-sm w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {isLoading && (
          <div className="p-10 text-center text-gray-500">
            Loading users...
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No users found
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Balance</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* USER */}
                  <td className="p-4">
                    <div className="font-medium text-gray-800">
                      {user.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {user.id}
                    </div>
                  </td>

                  {/* CONTACT */}
                  <td className="p-4">
                    <div>{user.email}</div>
                    <div className="text-xs text-gray-500">
                      {user.phone_number || "No phone"}
                    </div>
                  </td>

                  {/* BALANCE */}
                  <td className="p-4 font-semibold text-blue-600">
                    ${user.balance}
                  </td>

                  {/* ROLE */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        user.is_superuser
                          ? "bg-purple-100 text-purple-600"
                          : user.is_staff
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {getRole(user)}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <Edit size={14} />
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      <Trash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <UserModal
          title="Create User"
          onClose={() => setShowCreate(false)}
          onSubmit={async (data:any) => {
            const toastId = toast.loading("Creating user...");

            try {
              await createUser(data).unwrap();

              toast.update(toastId, {
                render: "User created successfully",
                type: "success",
                isLoading: false,
              });

              setShowCreate(false);
            } catch {
              toast.update(toastId, {
                render: "Failed to create user",
                type: "error",
                isLoading: false,
              });
            }
          }}
        />
      )}

      {/* EDIT MODAL */}
      {editingUser && (
        <UserModal
          title="Edit User"
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={async (data:any) => {
            const toastId = toast.loading("Updating user...");

            try {
              await updateUser({
                id: editingUser.id,
                data,
              }).unwrap();

              toast.update(toastId, {
                render: "User updated successfully",
                type: "success",
                isLoading: false,
              });

              setEditingUser(null);
            } catch {
              toast.update(toastId, {
                render: "Update failed",
                type: "error",
                isLoading: false,
              });
            }
          }}
        />
      )}
    </div>
  );
}

/* =========================
   USER MODAL
========================= */

function UserModal({ title, user, onClose, onSubmit }: any) {
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    password: "",
    role: user?.is_superuser
      ? "admin"
      : user?.is_staff
      ? "staff"
      : "user",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    const payload = {
      username: form.username,
      email: form.email,
      phone_number: form.phone_number,
      password: form.password || undefined,
      is_staff: form.role === "staff" || form.role === "admin",
      is_superuser: form.role === "admin",
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="input"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="input"
          />

          <input
            name="phone_number"
            placeholder="Phone number"
            value={form.phone_number}
            onChange={handleChange}
            className="input"
          />

          <input
            name="password"
            type="password"
            placeholder="Password (optional on edit)"
            value={form.password}
            onChange={handleChange}
            className="input"
          />

          {/* ROLE */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="input"
          >
            <option value="user">Normal User</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>

          <button onClick={handleSubmit} className="btn-primary">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}