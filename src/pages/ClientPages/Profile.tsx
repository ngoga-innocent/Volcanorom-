import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../features/auth/authApi";
import { useLoader } from "../../app/LoaderContext";

export default function Profile() {
  const { data, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
const {showLoader}=useLoader()
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      
      setForm({
        username: data.username,
        email: data.email,
        phone_number: data.phone_number || "",
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
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    }
  };

  if (isLoading){
    showLoader()
  }
    

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 text-gray-700">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* LEFT PROFILE CARD */}
        <div className="bg-white rounded-xl shadow-sm border p-6 h-fit">

          <div className="flex flex-col items-center text-center">

            <div className="relative">
              <img
                src="https://i.pravatar.cc/120"
                className="w-24 h-24 rounded-full object-cover"
              />

              <button className="absolute bottom-0 right-0 bg-zinc-200 border rounded-full p-2 shadow hover:bg-gray-100">
                ✏️
              </button>
            </div>

            <h3 className="mt-4 font-semibold text-lg">{form.username}</h3>
            <p className="text-gray-500 text-sm">{form.email}</p>

          </div>

          <div className="mt-6 border-t pt-6 space-y-3 text-sm">

            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">
              My Profile
            </button>

            {/* <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">
              Security
            </button>

            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">
              Notifications
            </button> */}

            <button className="w-full text-left px-3 py-2 rounded-md text-red-500 hover:bg-red-50">
              Logout
            </button>

          </div>

        </div>

        {/* PROFILE FORM */}
        <div className="lg:col-span-2 bg-zinc-200 rounded-xl shadow-sm border p-8">

          <div className="mb-8">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <p className="text-gray-500 text-sm">
              Update your personal information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* USERNAME */}
            <div>
              <label className="text-sm text-gray-600">Username</label>

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600">Email Address</label>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm text-gray-600">Phone Number</label>

              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="+250..."
                className="mt-1 w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end pt-4">

              <button
                type="submit"
                disabled={updating}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
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