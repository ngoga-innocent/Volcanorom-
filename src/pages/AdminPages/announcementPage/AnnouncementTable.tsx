import AnnouncementRow from "./AnnouncementRow";

export default function AnnouncementTable({
  announcements,
  loading,
  onEdit,
  onDelete,
}: any) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-10 text-center">
        Loading...
      </div>
    );
  }

  if (!announcements.length) {
    return (
      <div className="bg-white rounded-xl p-10 text-center text-gray-500">
        No announcements found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      {/* DESKTOP */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Message</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {announcements.map((item: any) => (
              <AnnouncementRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>

        </table>
      </div>

      {/* MOBILE */}
      <div className="md:hidden divide-y">
        {announcements.map((item: any) => (
          <div key={item.id} className="p-4">

            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">
                {item.title}
              </h3>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.is_active
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {item.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              {item.message}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item)}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(item.id)}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg"
              >
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}