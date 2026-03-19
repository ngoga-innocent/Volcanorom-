import { useState } from "react";
import {
  useGetMyOrdersQuery,
  useCompleteOrderMutation,
  useCancelOrderMutation,
} from "../../features/orderApi";

import { toast } from "react-toastify";
import { useLoader } from "../../app/LoaderContext";

import { FiCheckCircle, FiXCircle, FiEye, FiPackage } from "react-icons/fi";

const AdminOrders = () => {
  const { showLoader, hideLoader } = useLoader();

  const { data: orders = [], isLoading } = useGetMyOrdersQuery();

  const [completeOrder, { isLoading: completing }] =
    useCompleteOrderMutation();
  const [cancelOrder, { isLoading: cancelling }] =
    useCancelOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [cancelTarget, setCancelTarget] = useState<any>(null);

  const [downloadLink, setDownloadLink] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [adminNote, setAdminNote] = useState("");

  if (completing || cancelling) showLoader();
  else hideLoader();

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        Loading orders...
      </div>
    );
  }

  const handleComplete = async () => {
    try {
      await completeOrder({
        orderId: selectedOrder.id,
        data: {
          download_link: downloadLink,
          license_key: licenseKey,
          admin_note: adminNote,
        },
      }).unwrap();

      toast.success("Order completed");
      setSelectedOrder(null);
    } catch {
      toast.error("Failed to complete order");
    }
  };

  const handleCancel = async () => {
    if (!adminNote) {
      toast.error("Admin note is required");
      return;
    }

    try {
      await cancelOrder({
        orderId: cancelTarget.id,
        data: { admin_note: adminNote },
      }).unwrap();

      toast.success("Order cancelled & refunded");
      setCancelTarget(null);
    } catch {
      toast.error("Cancel failed");
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "completed") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-gray-700">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <FiPackage size={24} />
        <h1 className="text-2xl md:text-3xl font-bold">
          Orders Management
        </h1>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {orders.map((order: any) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-xl shadow border"
          >
            <div className="space-y-1 text-sm">
              <p>
                <b>User:</b> {order.user_details.username}
              </p>
              <p>
                <b>Software:</b> {order.software_details?.name}
              </p>
              <p>
                <b>Credits:</b> {order.price_paid}
              </p>
              <p>
                <b>Status:</b>{" "}
                <span
                  className={`px-2 py-1 text-xs rounded ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setSelectedOrder(order)}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
              >
                <FiEye /> View
              </button>

              {order.status === "pending" && (
                <>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-xs"
                  >
                    <FiCheckCircle /> Complete
                  </button>

                  <button
                    onClick={() => setCancelTarget(order)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg text-xs"
                  >
                    <FiXCircle /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white shadow-sm rounded-2xl border overflow-x-auto">
        <table className="min-w-175 w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Software</th>
              <th className="p-4 text-center">Credits</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order: any) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4 font-medium">
                  {order.user_details.username}
                </td>

                <td className="p-4">
                  {order.software_details?.name}
                </td>

                <td className="p-4 text-center font-semibold">
                  {order.price_paid}
                </td>

                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-4 flex flex-col lg:flex-row justify-center gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    <FiEye /> View
                  </button>

                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        <FiCheckCircle /> Complete
                      </button>

                      <button
                        onClick={() => setCancelTarget(order)}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        <FiXCircle /> Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODALS (UNCHANGED LOGIC, CLEANED UI) ================= */}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full md:w-125 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Order Details
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <b>User:</b> {selectedOrder.user_details.username}
              </p>
              <p>
                <b>Software:</b>{" "}
                {selectedOrder.software_details?.name}
              </p>
              <p>
                <b>Price:</b> {selectedOrder.price_paid} credits
              </p>
            </div>

            {(selectedOrder.client_data ||
              selectedOrder.files?.length > 0) && (
              <div className="mt-5">
                <h3 className="font-semibold mb-3">
                  Client Data
                </h3>

                <div className="grid gap-3">
                  {selectedOrder.client_data &&
                    Object.entries(
                      selectedOrder.client_data
                    ).map(([key, value]: any) => (
                      <div
                        key={key}
                        className="bg-gray-100 p-3 rounded-lg"
                      >
                        <p className="text-sm font-medium mb-1">
                          {key}
                        </p>
                        <p className="text-sm">{value}</p>
                      </div>
                    ))}

                  {selectedOrder.files?.map((file: any) => (
                    <div
                      key={file.id}
                      className="bg-gray-100 p-3 rounded-lg"
                    >
                      <p className="text-sm font-medium mb-2">
                        {file.field_name}
                      </p>
                      <img
                        src={file.file}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedOrder.status === "pending" && (
              <div className="mt-6 space-y-3">
                <input
                  placeholder="Download Link"
                  className="w-full border p-3 rounded-lg"
                  onChange={(e) =>
                    setDownloadLink(e.target.value)
                  }
                />

                <textarea
                  placeholder="License Key"
                  className="w-full border p-3 rounded-lg"
                  onChange={(e) =>
                    setLicenseKey(e.target.value)
                  }
                />

                <textarea
                  placeholder="Admin Note"
                  className="w-full border p-3 rounded-lg"
                  onChange={(e) =>
                    setAdminNote(e.target.value)
                  }
                />

                <button
                  onClick={handleComplete}
                  className="w-full bg-green-600 text-white py-3 rounded-lg"
                >
                  Complete Order
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {cancelTarget && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full md:w-100">
            <h2 className="text-lg font-bold mb-3">
              Cancel Order
            </h2>

            <textarea
              placeholder="Reason for cancellation"
              className="w-full border p-3 rounded-lg"
              onChange={(e) =>
                setAdminNote(e.target.value)
              }
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Close
              </button>

              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;