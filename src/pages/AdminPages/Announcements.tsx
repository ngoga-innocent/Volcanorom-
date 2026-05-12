import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import {
  useGetAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} from "../../features/auth/announcementApi";
import AnnouncementTable from "./announcementPage/AnnouncementTable";
import AnnouncementModal from "./announcementPage/AnnouncementModal";



export default function Announcements() {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data = [], isLoading } =
    useGetAnnouncementsQuery();

  const [createAnnouncement] =
    useCreateAnnouncementMutation();

  const [updateAnnouncement] =
    useUpdateAnnouncementMutation();

  const [deleteAnnouncement] =
    useDeleteAnnouncementMutation();

  const handleDelete = async (id: number) => {
    if (!confirm("Delete announcement?")) return;

    const toastId = toast.loading("Deleting...");

    try {
      await deleteAnnouncement(id).unwrap();

      toast.update(toastId, {
        render: "Deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch {
      toast.update(toastId, {
        render: "Delete failed",
        type: "error",
        isLoading: false,
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Announcements
          </h1>

          <p className="text-sm text-gray-500">
            Manage homepage announcements
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Add Announcement
        </button>

      </div>

      <AnnouncementTable
        announcements={data}
        loading={isLoading}
        onEdit={setEditing}
        onDelete={handleDelete}
      />

      {/* CREATE */}
      {showModal && (
        <AnnouncementModal
          title="Create Announcement"
          onClose={() => setShowModal(false)}
          onSubmit={async (formData: any) => {
            const toastId =
              toast.loading("Creating...");

            try {
              await createAnnouncement(
                formData
              ).unwrap();

              toast.update(toastId, {
                render: "Created successfully",
                type: "success",
                isLoading: false,
                autoClose:3000
              });

              setShowModal(false);
            } catch(err:any) {
                console.log(err)
              toast.update(toastId, {
                render: "Creation failed",
                type: "error",
                isLoading: false,
                autoClose:3000
              });
            }
          }}
        />
      )}

      {/* EDIT */}
      {editing && (
        <AnnouncementModal
          title="Edit Announcement"
          announcement={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (formData: any) => {
            const toastId =
              toast.loading("Updating...");

            try {
              await updateAnnouncement({
                id: editing.id,
                data: formData,
              }).unwrap();

              toast.update(toastId, {
                render: "Updated successfully",
                type: "success",
                isLoading: false,
              });

              setEditing(null);
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