import type { Order } from "../../features/auth/types";
import { useGetMyOrdersQuery } from "../../features/orderApi";
import { useState } from "react";

const MyOrders = () => {
  const { data: orders = [], isLoading } = useGetMyOrdersQuery();
  const [selected, setSelected] = useState<Order | null>(null);
  // console.log("my all orders",orders)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 md:px-8 py-20">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">My Orders</h1>
          <span className="text-slate-400 text-sm">{orders.length} Orders</span>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            You have no orders yet.
          </div>
        )}

        {/* ORDER LIST */}
        <div className="grid gap-5">
          {orders.map((order: Order) => (
            <div
              key={order.id}
              onClick={() => setSelected(order)}
              className="cursor-pointer bg-slate-900 border border-white/10 rounded-xl p-5 hover:border-blue-500 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <img
                    src={order.software_details?.thumbnail}
                    alt="thumb"
                    className="w-16 h-16 object-cover rounded-lg"
                  />

                  <div>
                    <h3 className="font-semibold text-lg">
                      {order.software_details?.name}
                    </h3>

                    <p className="text-slate-400 text-sm">
                      Duration: {order.duration}
                    </p>

                    <p className="text-slate-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-blue-400">
                      {order.price_paid} Credits
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center  flex-col flex-1 p-4 z-50">
          <div className="bg-slate-900 rounded-xl w-full max-w-xl p-6 relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">Order Details</h2>

            {/* BASIC INFO */}
            <div className="space-y-3">
              <p>
                <strong>Software:</strong> {selected.software_details?.name}
              </p>

              <p>
                <strong>Type:</strong> {selected.software_details?.type}
              </p>

              <p>
                <strong>Duration:</strong> {selected.duration}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded ${getStatusColor(
                    selected.status,
                  )}`}
                >
                  {selected.status}
                </span>
              </p>

              <p>
                <strong>Credits Paid:</strong> {selected.price_paid}
              </p>
            </div>

            {/* COMPLETED DATA */}
            {selected.status === "completed" && (
              <div className="mt-6 space-y-4">
                {/* TOOL → LICENSE */}
                {selected.software_details?.type === "tools" &&
                  selected.license_key && (
                    <div>
                      <p className="font-semibold mb-1">License Key</p>
                      <pre className="bg-slate-800 p-3 rounded text-sm overflow-x-auto">
                        {selected.license_key}
                      </pre>
                    </div>
                  )}

                {/* MDM → DOWNLOAD */}
                {selected.software_details?.type === "mdm_files" &&
                  selected.software_details?.download_link && (
                    <div>
                      <p className="font-semibold mb-1">Download File</p>
                      <a
                        href={selected.software_details?.download_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-bold rounded p-2 bg-orange-700"
                      >
                        Download
                      </a>
                    </div>
                  )}

                {/* ADMIN NOTE */}
              </div>
            )}
            {selected.admin_note && (
              <div className={`${selected?.status=='cancelled'? 'bg-red-500/20':'bg-slate-800'}  p-3 rounded-lg my-2`}>
                <p className="font-semibold mb-1">Admin Note</p>
                <p className="text-slate-200">{selected.admin_note}</p>
              </div>
            )}

            {/* CLIENT DATA */}
            {(selected.client_data || selected.files?.length > 0) && (
              <div className="mt-6 space-y-4 flex flex-col ">
                <h3 className="text-lg font-semibold">Your Submitted Data</h3>

                <div className="grid gap-3">
                  {/* TEXT */}
                  {selected.client_data &&
                    Object.entries(selected.client_data).map(
                      ([key, value]: any) => (
                        <div key={key} className="bg-slate-800 w-[40%] md:w-[70%] p-3 rounded-lg">
                          <p className="text-sm text-slate-400 mb-1">{key}</p>
                          <p className="text-sm text-ellipsis text-wrap w-[40%] md:w-[70%] line-clamp-1">{value}</p>
                        </div>
                      ),
                    )}

                  {/* FILES */}
                  {selected.files?.map((file: any) => (
                    <div key={file.id} className="bg-slate-800 w-[40%] md:w-[70%] p-3 rounded-lg">
                      <p className="text-sm text-slate-400 mb-2">
                        {file.field_name}
                      </p>

                      <img
                        src={file.file}
                        alt="uploaded"
                        className="w-full h-40 object-cover rounded-lg border border-white/10"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION */}
            <div className="flex justify-end mt-8">
              <button
                onClick={() => setSelected(null)}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
