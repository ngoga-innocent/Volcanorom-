import GlobalLoader from "../../../../components/GlobalLoader";

export default function NotificationModal({
  isOpen,
  onClose,
  isLoading,
  error,
  notifications = [],
}: any) {
  if (!isOpen) return null;
  if (isLoading) {
    return <GlobalLoader />;
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3">
      {isLoading && <GlobalLoader />}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 md:px-6 py-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Notifications
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Latest announcements and updates
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
          >
            ✕
          </button>
        </div>
        <div>
          {error && (
            <div className="p-4 bg-red-100 text-red-700 text-sm rounded-b-lg">
              Failed to load notifications. Please try again later.{error}
            </div>
          )}
        </div>
        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🔔</div>
              <h3 className="text-lg font-semibold text-gray-700">
                No notifications yet
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Updates will appear here when available.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className="group px-4 md:px-6 py-4 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex gap-3 md:gap-4">
                    {/* Icon */}
                    <div className="shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg font-bold">
                        🔔
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <h3 className="text-sm md:text-base font-semibold text-gray-800 leading-relaxed group-hover:text-black">
                          {notification.title}
                        </h3>

                        <p className="text-xs text-gray-400 whitespace-nowrap md:ml-4">
                          {new Date(notification.created_at).toLocaleString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>

                      {notification.message && (
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                          {notification.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
