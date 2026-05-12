import { Edit, Trash } from "lucide-react";

export default function AnnouncementRow({
  item,
  onEdit,
  onDelete,
}: any) {
  return (
    <tr className="border-b hover:bg-gray-50">

      <td className="p-4 font-medium">
        {item.title}
      </td>

      <td className="p-4 text-gray-600 max-w-md truncate">
        {item.message}
      </td>

      <td className="p-4">
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            item.is_active
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="p-4">
        {new Date(item.created_at).toLocaleDateString()}
      </td>

      <td className="p-4 flex gap-2">

        <button
          onClick={() => onEdit(item)}
          className="p-2 bg-blue-500 text-white rounded"
        >
          <Edit size={14} />
        </button>

        <button
          onClick={() => onDelete(item.id)}
          className="p-2 bg-red-500 text-white rounded"
        >
          <Trash size={14} />
        </button>

      </td>

    </tr>
  );
}