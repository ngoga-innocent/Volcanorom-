import { useState } from "react";
import {  FiSearch, FiLock, FiCpu } from "react-icons/fi";
import { useGetSoftwaresQuery } from "../../../../features/softwareApi";
import { useGetProfileQuery } from "../../../../features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa";

const SoftwareStore = () => {
  const { data: softwares, isLoading } = useGetSoftwaresQuery({});
  const { data: profileData } = useGetProfileQuery();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = softwares?.filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_40%)]"></div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-28">
        {/* HEADER */}
        <div className="sticky top-16 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 mb-10 pb-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                Marketplace
              </h1>

              <p className="text-slate-400 text-sm mt-1">
                Discover powerful tools
              </p>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              {/* Credits */}
              <div className="bg-blue-500/10 border flex flex-row items-center gap-x-2 border-blue-500/30 px-4 py-1 rounded-lg">
                <p className="text-xs text-blue-300">Credits</p>
                <p className="text-lg font-semibold text-blue-400">
                  {profileData?.balance ?? 0}
                </p>
              </div>

              {/* Search */}
              <div className="relative flex-1 lg:w-72">
                <FiSearch className="absolute top-3 left-3 text-slate-400" />

                <input
                  placeholder="Search tools..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Results count */}
          {!isLoading && (
            <p className="text-xs text-slate-500 mt-3">
              {filtered?.length ?? 0} tools available
            </p>
          )}
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white/5 h-72 rounded-xl"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && filtered?.length === 0 && (
          <div className="text-center py-24 text-slate-400">
            No software found
          </div>
        )}

        {/* SOFTWARE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered?.map((software: any) => {
            const canDownload =
              profileData?.balance &&
              profileData.balance >= software.price_in_credits;

            return (
              <div
                onClick={() => navigate(`/software/${software.id}`)}
                key={software.id}
                className="group relative bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              >
                {/* FEATURED */}
                {software.is_featured && (
                  <div className="absolute top-4 left-4 bg-linear-to-r from-emerald-400 to-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    Featured
                  </div>
                )}

                {/* PRICE */}

                {/* THUMBNAIL */}
                <div className="h-44 flex items-center justify-center bg-slate-900">
                  {software.thumbnail ? (
                    <img
                      src={software.thumbnail}
                      className="h-24 transition group-hover:scale-110"
                    />
                  ) : (
                    <FiCpu size={42} className="text-blue-400" />
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg group-hover:text-blue-400 transition">
                      {software.name}
                    </h2>
                    <div className=" bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {software.price_in_credits} credits
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                    {software.description ||
                      "Professional developer tool designed for productivity and automation."}
                  </p>

                  {/* Stats */}
                  {/* <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
                    <span>⬇ {software.downloads ?? 1200}</span>
                    <span>⭐ {software.rating ?? 4.8}</span>
                  </div> */}

                  <div className="border-t border-white/10 my-5"></div>

                  {/* ACTIONS */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-slate-300">
                      {software.type}
                    </span>

                    {canDownload ? (
                      <button className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
                        <FaCartPlus />
                        Place Order
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex items-center gap-2 bg-white/10 text-slate-400 text-sm px-4 py-2 rounded-lg cursor-not-allowed"
                      >
                        <FiLock />
                        Locked
                      </button>
                    )}
                  </div>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-linear-to-r from-blue-500/10 via-transparent to-indigo-500/10"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SoftwareStore;
