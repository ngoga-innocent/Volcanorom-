import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetSoftwaresQuery,
  useDeleteSoftwareMutation,
  useUpdateSoftwareMutation,
} from "../../features/softwareApi";
import { toast } from "react-toastify";

const PAGE_SIZE = 15;

const SoftwareManager = () => {
  type ClientField = {
    name: string;
    type: "text" | "image";
  };
  const { data: softwares = [], isLoading, refetch } = useGetSoftwaresQuery({});
  const [deleteSoftware] = useDeleteSoftwareMutation();
  const [updateSoftware, { isLoading: updating }] = useUpdateSoftwareMutation();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState<"text" | "image">("text");
  const [clientFields, setClientFields] = useState<ClientField[]>([]);
  const [viewing, setViewing] = useState<any>(null);
  const filtered = softwares.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );
  const durations = [
    "1-10minutes",
    "1-30minutes",
    "1 Hour",
    "2 Hours",
    "4 Hours",
    "6 Hours",
    "12 Hours",
    "24 Hours",
    "48 Hours",
    "1 Week",
    "1 Month",
    "3 Months",
    "6 Months",
    "12 Months",
  ];
  const mdmCategories = [
    {
      value: "transsion",
      label: "Transsion Devices",
    },

    {
      value: "samsung",
      label: "Samsung Mobile",
    },

    {
      value: "hmd",
      label: "HMD",
    },

    {
      value: "onfone",
      label: "Onfone Mobile",
    },
  ];
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
      name: software.name || "",
      description: software.description || "",
      price_in_credits: software.price_in_credits || "",

      type: software.type || "",

      duration: software.duration || "",

      service: software.service || "",
      mdm_category: software.mdm_category || "",
      download_link: software.download_link || "",
    });

    setClientFields(software.client_fields || []);
  };

  const closeModal = () => {
    setEditing(null);
    setThumbnail(null);
  };
  const addField = () => {
    if (!fieldName) return;

    setClientFields([...clientFields, { name: fieldName, type: fieldType }]);

    setFieldName("");
    setFieldType("text");
  };

  const removeField = (index: number) => {
    const updated = [...clientFields];
    updated.splice(index, 1);
    setClientFields(updated);
  };
  const handleUpdate = async (e: any) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", form.name);

      data.append("description", form.description);

      data.append("price_in_credits", form.price_in_credits);

      data.append("type", form.type);

      data.append("duration", form.duration || "");
      data.append("mdm_category", form.mdm_category || "");
      data.append("service", form.service || "");

      data.append("download_link", form.download_link || "");

      data.append("client_fields", JSON.stringify(clientFields));

      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      await updateSoftware({
        id: editing.id,
        data,
      }).unwrap();

      toast.success("Software updated successfully");

      closeModal();
    } catch (error) {
      toast.error("Failed to update software");
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

                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setViewing(s)}
                        className="
        px-3 py-1.5 rounded-lg
        bg-slate-700 hover:bg-slate-800
        text-white text-sm
      "
                      >
                        View
                      </button>

                      <button
                        onClick={() => openEdit(s)}
                        className="
        px-3 py-1.5 rounded-lg
        bg-green-600 hover:bg-green-700
        text-white text-sm
      "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="
        px-3 py-1.5 rounded-lg
        bg-red-600 hover:bg-red-700
        text-white text-sm
      "
                      >
                        Delete
                      </button>
                    </div>
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
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* BACKDROP */}
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* DRAWER */}
          <div className="relative h-full w-full sm:w-[650px] bg-white shadow-2xl overflow-y-auto animate-slideLeft">
            {/* HEADER */}
            <div className="sticky top-0 bg-white border-b z-10 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Software
                </h2>

                <p className="text-sm text-gray-500">
                  Update software information
                </p>
              </div>

              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              {/* BASIC INFO */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold text-gray-700">
                  Basic Information
                </h3>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg w-full"
                  placeholder="Software name"
                />

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  rows={5}
                  className="border p-3 rounded-lg w-full resize-none"
                  placeholder="Description"
                />
              </div>

              {/* TYPE & PRICE */}
              <div className="bg-gray-50 rounded-xl p-5 grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Software Type
                  </label>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value,
                      })
                    }
                    className="border p-3 rounded-lg w-full"
                  >
                    <option value="tools">Tools</option>
                    <option value="mdm_files">MDM Files</option>
                    <option value="services">Services</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">
                    Price
                  </label>

                  <input
                    type="number"
                    value={form.price_in_credits}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price_in_credits: e.target.value,
                      })
                    }
                    className="border p-3 rounded-lg w-full"
                    placeholder="Price"
                  />
                </div>
              </div>

              {/* SERVICES */}
              {form.type === "services" && (
                <div className="bg-gray-50 rounded-xl p-5 grid md:grid-cols-2 gap-4">
                  <select
                    value={form.service}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        service: e.target.value,
                      })
                    }
                    className="border p-3 rounded-lg"
                  >
                    <option value="">Select Service</option>

                    <option value="imei">IMEI Service</option>

                    <option value="server">Server Service</option>

                    <option value="remote">Remote Service</option>
                  </select>

                  <select
                    value={form.duration}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        duration: e.target.value,
                      })
                    }
                    className="border p-3 rounded-lg"
                  >
                    {durations.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* DOWNLOAD LINK */}
              {form.type === "mdm_files" && (
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <select
                    value={form.mdm_category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mdm_category: e.target.value,
                      })
                    }
                    className="border p-3 rounded-lg w-full"
                  >
                    <option value="">Select MDM Category</option>

                    {mdmCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={form.download_link}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        download_link: e.target.value,
                      })
                    }
                    className="border p-3 rounded-lg w-full"
                    placeholder="Download link"
                  />
                </div>
              )}

              {/* CLIENT FIELDS */}
              {(form.type === "tools" || form.type === "services") && (
                <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                  <h3 className="font-semibold">Client Required Fields</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Field name"
                      value={fieldName}
                      onChange={(e) => setFieldName(e.target.value)}
                      className="border p-3 rounded-lg"
                    />

                    <select
                      value={fieldType}
                      onChange={(e) =>
                        setFieldType(e.target.value as "text" | "image")
                      }
                      className="border p-3 rounded-lg"
                    >
                      <option value="text">Text</option>

                      <option value="image">Image</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={addField}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Add Field
                  </button>
                  {clientFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center border rounded-lg p-3 bg-white"
                    >
                      <div>
                        <p className="font-medium">{field.name}</p>

                        <p className="text-xs text-gray-500">{field.type}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* THUMBNAIL */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <h3 className="font-semibold">Thumbnail</h3>

                {editing.thumbnail && (
                  <img
                    src={editing.thumbnail}
                    className="w-full h-52 object-cover rounded-xl border"
                  />
                )}

                <input
                  type="file"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  className="border p-3 rounded-lg w-full"
                />
              </div>

              {/* FOOTER */}
              <div className="sticky bottom-0 bg-white pt-4 flex justify-end gap-3 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-3 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* VIEW DRAWER */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* BACKDROP */}
          <div
            onClick={() => setViewing(null)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* DRAWER */}
          <div
            className="
        relative h-full
        w-full sm:w-[600px]
        bg-white shadow-2xl
        overflow-y-auto
      "
          >
            {/* HEADER */}
            <div className="sticky top-0 bg-white border-b z-10 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{viewing.name}</h2>

                <p className="text-sm text-gray-500 mt-1 capitalize">
                  {viewing.type}
                </p>
              </div>

              <button
                onClick={() => setViewing(null)}
                className="
            w-10 h-10 rounded-full
            hover:bg-gray-100
            flex items-center justify-center
          "
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-6">
              {/* IMAGE */}
              <img
                src={viewing.thumbnail}
                className="
            w-full h-64 object-cover
            rounded-2xl border
          "
              />

              {/* INFO */}
              <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>

                    <h3 className="font-semibold text-lg">
                      {viewing.price_in_credits} Credits
                    </h3>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Type</p>

                    <h3 className="font-semibold text-lg capitalize">
                      {viewing.type}
                    </h3>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>

                  <p className="leading-relaxed text-gray-700">
                    {viewing.description}
                  </p>
                </div>
              </div>

              {/* SERVICES */}
              {viewing.type === "services" && (
                <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                  <h3 className="font-semibold text-lg">Service Details</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Service</p>

                      <p className="font-medium capitalize">
                        {viewing.service}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Duration</p>

                      <p className="font-medium">{viewing.duration}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* MDM */}
              {viewing.type === "mdm_files" && (
                <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                  <h3 className="font-semibold text-lg">MDM Information</h3>

                  <div>
                    <p className="text-sm text-gray-500">Category</p>

                    <p className="font-medium capitalize">
                      {viewing.mdm_category}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Download Link</p>

                    <a
                      href={viewing.download_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 break-all"
                    >
                      {viewing.download_link}
                    </a>
                  </div>
                </div>
              )}

              {/* CLIENT FIELDS */}
              {viewing.client_fields?.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h3 className="font-semibold text-lg mb-4">
                    Client Required Fields
                  </h3>

                  <div className="space-y-3">
                    {viewing.client_fields.map((field: any, index: number) => (
                      <div
                        key={index}
                        className="
                      flex items-center justify-between
                      bg-white border rounded-xl
                      p-4
                    "
                      >
                        <div>
                          <p className="font-medium">{field.name}</p>

                          <p className="text-sm text-gray-500">{field.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CREATED */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-sm text-gray-500">Created At</p>

                <p className="font-medium mt-1">
                  {new Date(viewing.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoftwareManager;
