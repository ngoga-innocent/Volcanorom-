import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetSoftwaresQuery,
  useDeleteSoftwareMutation,
  useUpdateSoftwareMutation,
} from "../../features/softwareApi";
import { toast } from "react-toastify";

const PAGE_SIZE = 5;

const SoftwareManager = () => {
  const { data: softwares = [], isLoading, refetch } = useGetSoftwaresQuery({});
  const [deleteSoftware] = useDeleteSoftwareMutation();
  const [updateSoftware, { isLoading: updating }] = useUpdateSoftwareMutation();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const filtered = softwares.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const pages = Math.ceil(filtered.length / PAGE_SIZE);

  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this software?")) return;

    await deleteSoftware(id).unwrap();
    refetch();
  };

  const openEdit = (software: any) => {
    setEditing(software);
    setForm({
      name: software.name,
      description: software.description,
      price_in_credits: software.price_in_credits,
      type: software.type,
    });
  };

  const closeModal = () => {
    setEditing(null);
    setThumbnail(null);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price_in_credits", form.price_in_credits);
      data.append("type", form.type);

      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      await updateSoftware({
        id: editing.id,
        data,
      }).unwrap();
      toast.success("Successfully updated the Tools");
      closeModal();
      refetch();
    } catch (error) {
      toast.error("Failed to update the tool, Try again Later!!!")
    }
  };

  return (
    <div className="space-y-6 text-gray-800">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Software Management</h1>

        <Link
          to="/admin/upload-software"
          className="bg-blue-600 text-white px-4 py-2 rounded w-fit"
        >
          Upload
        </Link>
      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search software..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full md:w-80"
      />

      {/* TABLE */}

      <div className="bg-white rounded shadow overflow-x-auto">
        {isLoading && <p className="p-6">Loading...</p>}

        {!isLoading && (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Thumbnail</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((s: any) => (
                <tr key={s.id} className="border-b">
                  <td className="p-3">
                    <img
                      src={s.thumbnail}
                      className="w-12 h-12 rounded object-cover"
                    />
                  </td>

                  <td className="p-3">{s.name}</td>

                  <td className="p-3">{s.price_in_credits} credits</td>

                  <td className="p-3 capitalize">{s.type}</td>

                  <td className="p-3">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => openEdit(s)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(s.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}

      {pages > 1 && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${
                p === page ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Edit Software</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border p-2 rounded w-full"
                placeholder="Software name"
              />

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="border p-2 rounded w-full"
                placeholder="Description"
              />

              <input
                type="number"
                value={form.price_in_credits}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price_in_credits: e.target.value,
                  })
                }
                className="border p-2 rounded w-full"
                placeholder="Price"
              />

              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="border p-2 rounded w-full"
              >
                <option value="tools">Tools</option>
                <option value="mdm files">MDM Files</option>
              </select>

              {/* CURRENT THUMBNAIL */}
              {editing.thumbnail && (
                <div>
                  <p className="text-sm mb-1">Current Thumbnail</p>
                  <img
                    src={editing.thumbnail}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                </div>
              )}

              {/* NEW THUMBNAIL */}
              <div>
                <p className="text-sm mb-1">Change Thumbnail (optional)</p>
                <input
                  type="file"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {updating ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoftwareManager;
