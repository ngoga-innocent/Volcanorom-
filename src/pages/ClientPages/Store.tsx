import { useState } from "react";
import { FiSearch, FiDownload, FiLock } from "react-icons/fi";
import { useGetSoftwaresQuery } from "../../features/softwareApi";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../features/auth/authApi";

const SoftwareStore = () => {
  const { data: softwares, isLoading } = useGetSoftwaresQuery({});
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();
  const filtered = softwares?.filter((s: any) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "all" || s.type === category;

    return matchesSearch && matchesCategory;
  });
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery();
  console.log(profileData);

  return (
    <div className="flex-1 min-h-screen bg-linear-to-r from-slate-900 via-slate-950 to-slate-900 text-white">
      {/* HERO HEADER */}
      <div className="border-b border-white/10 bg-linear-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Software Marketplace
          </h1>

          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Discover powerful developer tools to boost productivity
          </p>

          {/* Search */}
          <div className="mt-6 relative max-w-md mx-auto md:mx-0">
            <FiSearch className="absolute top-3.5 left-3 text-slate-400" />

            <input
              placeholder="Search  tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 flex flex-col md:flex-row gap-8">
        {/* SIDEBAR */}
        <div className="w-full md:w-1/3 lg:w-1/4 shrink-0 flex flex-col gap-6">
          {/* Categories / Sidebar */}
          <div className="bg-white/5 border flex flex-col items-start border-white/10 rounded-xl p-2 backdrop-blur gap-1">
            <button
              onClick={() => setCategory("all")}
              className={`px-3 py-1 rounded-lg w-full text-left ${
                category === "all" ? "bg-amber-600/60" : "hover:bg-amber-600/60"
              }`}
            >
              All Softwares
            </button>

            <button
              onClick={() => setCategory("mdm files")}
              className={`px-3 py-1 rounded-lg w-full text-left ${
                category === "mdm files" ? "bg-amber-600/60" : "hover:bg-amber-600/60"
              }`}
            >
              MDM FILES
            </button>

            <button
              onClick={() => setCategory("tools")}
              className={`px-3 py-1 rounded-lg w-full text-left ${
                category === "tools"
                  ? "bg-amber-600/60"
                  : "hover:bg-amber-600/60"
              }`}
            >
              TOOLS
            </button>
          </div>

          {/* Credits Card */}
          <div className="bg-linear-to-r from-blue-700 to-indigo-800 p-3 flex flex-col items-center justify-center rounded-xl shadow-lg text-center md:text-left">
            {profileLoading ? (
              <p className="text-white font-bold">Loading...</p>
            ) : profileData ? (
              <>
                <p className="text-sm opacity-80">Your Credits</p>
                <p className="text-3xl font-bold">{profileData.balance}</p>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="rounded-full hover:bg-blue-300 border-white border p-2 font-bold"
              >
                Login To view Your credits
              </button>
            )}
          </div>
        </div>

        {/* SOFTWARE GRID */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {isLoading ? (
            <div className="text-center py-20 text-slate-400 col-span-full">
              Loading software...
            </div>
          ) : filtered?.length === 0 ? (
            <div className="text-center py-20 text-slate-400 col-span-full">
              No software found.
            </div>
          ) : (
            filtered.map((software: any) => {
              const canDownload =
                profileData?.balance &&
                profileData.balance >= software.price_in_credits;

              return (
                <div
                  key={software.id}
                  onClick={() => navigate(`/software/${software.id}`)}
                  className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/40 transition hover:shadow-2xl cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="h-40 sm:h-48 bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                    <img
                      src={software.thumbnail}
                      alt={software.name}
                      className="h-20 sm:h-24 object-contain group-hover:scale-110 transition"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold group-hover:text-blue-400 transition">
                      {software.name}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      Professional developer tool
                    </p>

                    <div className="flex items-center justify-between mt-5">
                      <span className="text-sm font-semibold text-blue-400">
                        {software.price_in_credits} credits
                      </span>

                      {canDownload ? (
                        <button className="flex items-center gap-2 text-sm bg-blue-600 px-3 py-2 rounded-lg hover:bg-blue-700 transition">
                          <FiDownload />
                          Download
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex items-center gap-2 text-sm bg-white/10 px-3 py-2 rounded-lg text-slate-400"
                        >
                          <FiLock />
                          Locked
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SoftwareStore;
