import { FiDownload, FiHeart, FiShare2 } from "react-icons/fi";

const SoftwareCard = ({ software, userCredits }: any) => {
  const canDownload = userCredits >= software.price_in_credits;

  return (
    <div className="relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col lg:flex-row p-6 gap-6 hover:shadow-2xl transition">

      {/* LEFT SIDE (Thumbnail) */}
      <div className="relative flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl w-full lg:w-1/2 h-64">

        {/* Pagination Indicator */}
        <div className="absolute top-4 left-4 text-xs bg-white px-3 py-1 rounded-full shadow">
          1/3
        </div>

        <img
          src={software.thumbnail}
          alt={software.name}
          className="max-h-40 object-contain transition group-hover:scale-110"
        />

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-3">
          <button className="bg-white shadow p-2 rounded-full hover:bg-gray-100">
            <FiShare2 size={16} />
          </button>

          <button className="bg-white shadow p-2 rounded-full hover:bg-gray-100">
            <FiHeart size={16} />
          </button>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-between flex-1">

        {/* Top */}
        <div>

          {/* Badges */}
          <div className="flex gap-3 mb-3">

            {software.is_featured && (
              <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                ⭐ Featured
              </span>
            )}

            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
              Developer Tool
            </span>

          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-900 leading-snug">
            {software.name}
          </h2>

          {/* Meta */}
          <p className="text-sm text-gray-500 mt-2">
            {software.downloads ?? 120}+ downloads • Secure instant access
          </p>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">

            <span className="text-3xl font-bold text-gray-900">
              {software.price_in_credits}
            </span>

            <span className="text-sm text-gray-500">
              Credits
            </span>

            <span className="text-green-600 text-sm font-medium">
              Available
            </span>

          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
            ⭐⭐⭐⭐☆ 4.5 (1,245 downloads)
          </div>

        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between mt-6">

          {/* Developer */}
          <div className="text-sm text-gray-500">
            by <span className="font-medium text-gray-800">
              Volcanorom Labs
            </span>
          </div>

          {/* Button */}
          {canDownload ? (
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition">
              <FiDownload />
              Download
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-200 text-gray-500 px-6 py-2.5 rounded-xl cursor-not-allowed"
            >
              Not enough credits
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default SoftwareCard;