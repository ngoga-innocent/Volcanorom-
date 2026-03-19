import { useState } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiFilter,
  FiX,
} from "react-icons/fi";

import { useGetSoftwaresQuery } from "../../features/softwareApi";
import { useNavigate } from "react-router-dom";
import { useGetProfileQuery } from "../../features/auth/authApi";

const SoftwareStore = () => {
  const { data: softwares = [], isLoading } =
    useGetSoftwaresQuery({});

  const { data: profileData } = useGetProfileQuery();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [service, setService] = useState("all");

  const [showFilters, setShowFilters] = useState(false);

  /* FILTER */

  const filtered = softwares.filter((s: any) => {
    const matchesSearch = s.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || s.type === category;

    const matchesService =
      service === "all" || s.service === service;

    return matchesSearch && matchesCategory && matchesService;
  });

  return (
    <div className="min-h-screen bg-linear-to-r from-slate-900 via-slate-950 to-slate-900 text-white">

      {/* HERO */}

      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-12">

          <h1 className="text-3xl md:text-4xl font-bold text-blue-400">
            Software Marketplace
          </h1>

          <p className="text-slate-400 mt-2">
            Order professional tools and Files 
          </p>

          {/* SEARCH + MOBILE FILTER */}

          <div className="mt-6 flex gap-3">

            <div className="relative flex-1">
              <FiSearch className="absolute top-3.5 left-3 text-slate-400" />

              <input
                placeholder="Search tools..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 outline-none"
              />
            </div>

            {/* MOBILE FILTER BUTTON */}

            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden bg-blue-600 px-4 rounded-lg flex items-center gap-2"
            >
              <FiFilter />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-5 py-10 grid lg:grid-cols-4 gap-8">

        {/* DESKTOP SIDEBAR */}

        <div className="hidden lg:block space-y-6">

          <Filters
            category={category}
            setCategory={setCategory}
            service={service}
            setService={setService}
            profileData={profileData}
          />

        </div>

        {/* SOFTWARE GRID */}

        <div className="lg:col-span-3">

          {isLoading && (
            <p className="text-slate-400">
              Loading marketplace...
            </p>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              No software found
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map((software: any) => (
              <div
                key={software.id}
                onClick={() =>
                  navigate(`/software/${software.id}`)
                }
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition cursor-pointer"
              >
                {/* IMAGE */}

                <div className="h-40 flex items-center justify-center bg-slate-900">
                  <img
                    src={software.thumbnail}
                    className="h-24 object-contain"
                  />
                </div>

                {/* BODY */}

                <div className="p-4">

                  <h3 className="font-semibold">
                    {software.name}
                  </h3>

                  {software.service && (
                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-600/30 text-blue-400 rounded">
                      {software.service.toUpperCase()}
                    </span>
                  )}

                  {software.duration && (
                    <p className="text-xs text-slate-400 mt-1">
                      Duration: {software.duration}
                    </p>
                  )}

                  <p className="text-sm text-slate-400 mt-2">
                    {software.price_in_credits} credits
                  </p>

                  <button className="mt-4 flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                    <FiShoppingCart />
                    Place Order
                  </button>

                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}

      {showFilters && (
        <div className="fixed inset-0 z-50 flex">

          {/* BACKDROP */}

          <div
            className="flex-1 bg-black/50"
            onClick={() => setShowFilters(false)}
          />

          {/* DRAWER */}

          <div className="w-[70%] max-w-sm bg-slate-900 p-6 overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">
                Filters
              </h2>

              <button
                onClick={() => setShowFilters(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            <Filters
              category={category}
              setCategory={setCategory}
              service={service}
              setService={setService}
              profileData={profileData}
            />

          </div>
        </div>
      )}
    </div>
  );
};

export default SoftwareStore;


/* FILTER COMPONENT */

const Filters = ({
  category,
  setCategory,
  service,
  setService,
  profileData,
}: any) => {
  return (
    <div className="space-y-6">

      {/* CATEGORY */}

      <div>
        <h3 className="text-sm text-slate-400 mb-2">
          Category
        </h3>

        <div className="space-y-2">

          {[
            { label: "All", value: "all" },
            { label: "Tools", value: "tools" },
            { label: "MDM Files", value: "mdm_files" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setCategory(item.value)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                category === item.value
                  ? "bg-blue-600"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}

        </div>
      </div>

      {/* SERVICE FILTER */}

      <div>
        <h3 className="text-sm text-slate-400 mb-2">
          Service Type
        </h3>

        <div className="space-y-2">

          {[
            { label: "All Services", value: "all" },
            { label: "IMEI Service", value: "imei" },
            { label: "Server Service", value: "server" },
            { label: "Remote Service", value: "remote" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setService(item.value)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                service === item.value
                  ? "bg-blue-600"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}

        </div>
      </div>

      {/* USER CREDITS */}

      <div className="bg-blue-700 p-5 rounded-xl text-center">
        <p className="text-sm text-blue-100">
          Your Credits
        </p>

        <p className="text-3xl font-bold mt-1">
          {profileData?.balance || 0}
        </p>
      </div>

    </div>
  );
};