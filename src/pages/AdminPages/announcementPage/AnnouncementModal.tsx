import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementModal({
  title,
  announcement,
  onClose,
  onSubmit,
}: any) {
  const [form, setForm] = useState({
    title: announcement?.title || "",
    message: announcement?.message || "",
    is_active: announcement?.is_active || false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg">

        <div className="flex justify-between items-center mb-5">
          <h2 className="font-semibold text-lg">
            {title}
          </h2>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">

          <input
            name="title"
            placeholder="Announcement title"
            value={form.title}
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="message"
            placeholder="Announcement message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            className="input resize-none"
          />

          <label className="flex items-center gap-2 text-sm">

            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />

            Active announcement

          </label>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(form)}
            className="btn-primary"
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
}