import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../../features/auth/authApi";
import { useLoader } from "../../app/LoaderContext";

export default function Profile() {
  const { data, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: updating }] =
    useUpdateProfileMutation();

  const { showLoader, hideLoader } = useLoader();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
  });

  /* FIXED LOADER */
  useEffect(() => {
    if (isLoading) showLoader();
    else hideLoader();
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      setForm({
        username: data.username,
        email: data.email,
        phone_number: data.phone_number || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile(form).unwrap();
      toast.success("Profile updated successfully 🚀");
    } catch {
      toast.error("Update failed ❌");
    }
  };

  const getInitials = () => {
    if (!form.username) return "U";
    return form.username.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT PANEL */}
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6">

          {/* AVATAR */}
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
              {getInitials()}
            </div>

            <h3 className="mt-4 font-semibold text-lg">
              {form.username}
            </h3>

            <p className="text-slate-400 text-sm">{form.email}</p>

            {/* ROLE */}
            <span className="mt-3 px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
              {data?.is_superuser ? "Admin" : "User"}
            </span>
          </div>

          {/* STATS */}
          <div className="mt-6 border-t border-white/10 pt-6">

            <div className="flex justify-between text-sm mb-3">
              <span className="text-slate-400">Balance</span>
              <span className="font-semibold text-green-400">
                {data?.balance} Credits
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Phone</span>
              <span>{form.phone_number || "-"}</span>
            </div>

          </div>

          {/* ACTIONS */}
          <div className="mt-6 border-t border-white/10 pt-6 space-y-2">

            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5">
              My Profile
            </button>

            <button className="w-full text-left px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10">
              Logout
            </button>

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-2 bg-slate-900 border border-white/10 rounded-xl p-8">

          <div className="mb-8">
            <h2 className="text-xl font-semibold">
              Profile Information
            </h2>
            <p className="text-slate-400 text-sm">
              Update your personal information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* NAME ROW */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">
                  First Name
                </label>
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  className="mt-1 w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">
                  Last Name
                </label>
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  className="mt-1 w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* USERNAME */}
            <div>
              <label className="text-sm text-slate-400">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="mt-1 w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* EMAIL (READ ONLY) */}
            <div>
              <label className="text-sm text-slate-400">
                Email
              </label>
              <input
                value={form.email}
                disabled
                className="mt-1 w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 opacity-60 cursor-not-allowed"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm text-slate-400">
                Phone Number
              </label>
              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                className="mt-1 w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* SAVE */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={updating}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  updating
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}