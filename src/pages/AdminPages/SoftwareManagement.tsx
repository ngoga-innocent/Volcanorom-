import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetSoftwaresQuery,
  useDeleteSoftwareMutation,
} from "../../features/softwareApi";
import { FiTrash2, FiEye, FiPlus, FiSearch } from "react-icons/fi";

const PAGE_SIZE = 5;

const SoftwareManager = () => {
  const { data: softwares = [], isLoading, isError, refetch } =
    useGetSoftwaresQuery({});

  const [deleteSoftware] = useDeleteSoftwareMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredSoftwares = softwares.filter((s: any) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSoftwares.length / PAGE_SIZE);

  const paginatedSoftwares = filteredSoftwares.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedSoftwares.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedSoftwares.map((s: any) => s.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;

    if (!confirm("Delete selected softwares?")) return;

    try {
      for (const id of selectedIds) {
        await deleteSoftware(id).unwrap();
      }

      setSelectedIds([]);
      refetch();
    } catch {
      alert("Failed to delete some softwares");
    }
  };

  return (
    <div className="w-full text-gray-900 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <h1 className="text-2xl md:text-3xl font-bold">
          Software Management
        </h1>

        <Link
          to="/admin/upload-software"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus /> Upload Software
        </Link>

      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">

        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search software..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {selectedIds.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Delete Selected ({selectedIds.length})
          </button>
        )}

      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        {isLoading && (
          <p className="p-6 text-gray-500">Loading softwares...</p>
        )}

        {isError && (
          <p className="p-6 text-red-500">Failed to load softwares</p>
        )}

        {!isLoading && paginatedSoftwares.length === 0 && (
          <p className="p-6 text-gray-500">
            No software uploaded yet
          </p>
        )}

        {paginatedSoftwares.length > 0 && (
          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-600">

                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length ===
                      paginatedSoftwares.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>

                <th className="p-3 text-left">Thumbnail</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Credits</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Created</th>
                <th className="p-3 text-center">Actions</th>

              </tr>
            </thead>

            <tbody>

              {paginatedSoftwares.map((software: any) => (

                <tr
                  key={software.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(software.id)}
                      onChange={() =>
                        toggleSelect(software.id)
                      }
                    />
                  </td>

                  <td className="p-3">
                    <img
                      src={
                        software.thumbnail ||
                        "/placeholder.png"
                      }
                      className="w-14 h-14 rounded object-cover border"
                    />
                  </td>

                  <td className="p-3 font-medium">
                    {software.name}
                  </td>

                  <td className="p-3">
                    {software.price_in_credits} credits
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        software.is_featured
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {software.is_featured
                        ? "Featured"
                        : "Regular"}
                    </span>

                  </td>

                  <td className="p-3">
                    {new Date(
                      software.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-3 flex justify-center gap-2">

                    <Link
                      to={`/admin/software/${software.id}`}
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <FiEye />
                    </Link>

                    <button
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={async () => {
                        if (
                          confirm(
                            "Delete this software?"
                          )
                        ) {
                          await deleteSoftware(
                            software.id
                          ).unwrap();
                          refetch();
                        }
                      }}
                    >
                      <FiTrash2 />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-center gap-2">

          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((page) => (

            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>

          ))}

        </div>

      )}

    </div>
  );
};

export default SoftwareManager;