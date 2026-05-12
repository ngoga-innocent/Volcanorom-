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
                      Created at:
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
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
      {/* DRAWER */}
      {selected && (
        <div className="fixed inset-0 z-50">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />

          {/* DRAWER PANEL */}
          <div
            className="
        absolute right-0 top-0 h-full
        w-full sm:w-[90%] md:w-[600px]
        bg-slate-900 border-l border-white/10
        shadow-2xl
        flex flex-col
        animate-in slide-in-from-right duration-300
      "
          >
            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-slate-900 border-b border-white/10 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">Order Details</h2>

                <p className="text-sm text-slate-400 mt-1">#{selected.id}</p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="
            h-10 w-10 rounded-full
            bg-white/5 hover:bg-white/10
            transition flex items-center justify-center
            text-slate-300 hover:text-white
          "
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              {/* SOFTWARE */}
              <div className="flex items-start gap-4">
                <img
                  src={selected.software_details?.thumbnail}
                  alt="thumb"
                  className="w-20 h-20 rounded-xl object-cover border border-white/10"
                />

                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selected.software_details?.name}
                  </h3>

                  <p className="text-slate-400 mt-1">
                    {selected.software_details?.type}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        selected.status,
                      )}`}
                    >
                      {selected.status}
                    </span>

                    <span className="text-blue-400 font-semibold">
                      {selected.price_paid} Credits
                    </span>
                  </div>
                </div>
              </div>

              {/* ORDER INFO */}
              <div className="bg-slate-800/60 rounded-2xl p-4 space-y-3">
                <h4 className="font-semibold text-lg">Order Information</h4>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Duration</p>
                    <p>{selected.duration}</p>
                  </div>

                  <div>
                    <p className="text-slate-400">Created</p>
                    <p>
                      {new Date(selected.created_at).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* LICENSE */}
              {selected.license_key && (
                <div className="bg-slate-800/60 rounded-2xl p-4">
                  <p className="font-semibold mb-3">License Key</p>

                  <div className="bg-black/40 rounded-xl p-3 overflow-x-auto">
                    <pre className="text-sm text-green-400 whitespace-pre-wrap break-all">
                      {selected.license_key}
                    </pre>
                  </div>
                </div>
              )}

              {/* DOWNLOAD */}
              {selected.status === "completed" &&
                selected.software_details?.type === "mdm_files" &&
                selected.software_details?.download_link && (
                  <div className="bg-slate-800/60 rounded-2xl p-4">
                    <p className="font-semibold mb-3">Download File</p>

                    <a
                      href={selected.software_details?.download_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                  inline-flex items-center gap-2
                  bg-orange-600 hover:bg-orange-700
                  px-4 py-2 rounded-xl
                  font-medium transition
                "
                    >
                      Download File
                    </a>
                  </div>
                )}

              {/* ADMIN NOTE */}
              {selected.admin_note && (
                <div
                  className={`
              rounded-2xl p-4
              ${
                selected.status === "cancelled"
                  ? "bg-red-500/20 border border-red-500/30"
                  : "bg-slate-800/60"
              }
            `}
                >
                  <p className="font-semibold mb-2">Admin Note</p>

                  <p className="text-slate-200 whitespace-pre-wrap">
                    {selected.admin_note}
                  </p>
                </div>
              )}

              {/* CLIENT DATA */}
              {(selected.client_data || selected.files?.length > 0) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Submitted Data</h3>

                  {/* TEXT DATA */}
                  {selected.client_data && (
                    <div className="grid gap-3">
                      {Object.entries(selected.client_data).map(
                        ([key, value]: any) => (
                          <div
                            key={key}
                            className="bg-slate-800/60 rounded-2xl p-4"
                          >
                            <p className="text-sm text-slate-400 capitalize mb-1">
                              {key.replaceAll("_", " ")}
                            </p>

                            <p className="break-words text-sm">{value}</p>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* FILES */}
                  {selected.files?.length > 0 && (
                    <div className="grid gap-4">
                      {selected.files.map((file: any) => (
                        <div
                          key={file.id}
                          className="bg-slate-800/60 rounded-2xl p-4"
                        >
                          <p className="text-sm text-slate-400 mb-3">
                            {file.field_name}
                          </p>

                          <img
                            src={file.file}
                            alt="uploaded"
                            className="
                        w-full rounded-xl
                        border border-white/10
                        object-cover max-h-[300px]
                      "
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 border-t border-white/10 bg-slate-900 p-4">
              <button
                onClick={() => setSelected(null)}
                className="
            w-full bg-blue-600 hover:bg-blue-700
            py-3 rounded-xl font-medium transition
          "
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
