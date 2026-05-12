import { useState } from "react";
import { useGetSoftwaresQuery } from "../../features/softwareApi";

const MdmFiles = () => {
  const { data: softwares = [], isLoading } = useGetSoftwaresQuery({
    type: "mdm_files",
  });
  const mdmTabs = [
    {
      key: "all",
      label: "All",
    },
    {
      key: "transsion",
      label: "Transsion",
    },
    {
      key: "samsung",
      label: "Samsung",
    },
    {
      key: "hmd",
      label: "HMD",
    },
    {
      key: "onfone",
      label: "Onfone",
    },
  ];
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = softwares
    .filter((item: any) => item.type === "mdm_files")
    .filter((item: any) =>
      activeTab === "all" ? true : item.mdm_category === activeTab,
    )
    .filter((item: any) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 md:px-10 py-20">
      {/* TOP TABS */}
      <div className="flex overflow-x-auto gap-2 pb-3 border-b border-white/10">
        {mdmTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm transition ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Search Bar */}
      <div className="mt-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search MDM files..."
          className="w-full md:w-96 bg-white/10 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
        />
      </div>
      {/* LOADING STATE */}

      {isLoading && (
        <div className="text-center text-gray-400">Loading MDM files...</div>
      )}
      {/* GRID LAYOUT */}
      <div className="mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item: any) => (
          <div
            key={item.id}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500 transition"
          >
            {/* IMAGE */}
            <img src={item.thumbnail} className="w-full h-40 object-cover" />

            {/* CONTENT */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{item.name}</h3>

              <p className="text-sm text-gray-400 line-clamp-2">
                {item.description}
              </p>

              {/* CATEGORY BADGE */}
              <span className="inline-block text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-400">
                {item.mdm_category}
              </span>

              {/* PRICE */}
              <div className="flex justify-between items-center mt-3">
                <p className="text-blue-400 font-bold">
                  {item.price_in_credits} credits
                </p>

                <a
                  href={`/software/${item.id}`}
                  //   target="_blank"
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-lg"
                >
                  Place Order
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* empty state */}
      {filtered.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          No MDM files found in this category
        </div>
      )}
    </div>
  );
};
export default MdmFiles;
