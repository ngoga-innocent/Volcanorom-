import { Link } from "react-router-dom";

const tools = [
  {
    name: "Hero Camera API",
    description:
      "Advanced automation tool for capturing screenshots and generating previews.",
    credits: 25,
    tag: "API",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    name: "Apple Dev Toolkit",
    description:
      "Powerful utilities for iOS development, automation, and testing workflows.",
    credits: 40,
    tag: "iOS",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    name: "Smart Watch Debugger",
    description:
      "Debug and analyze smartwatch applications with powerful developer tools.",
    credits: 30,
    tag: "Debugger",
    gradient: "from-indigo-500 to-blue-500",
  },
];

const FeaturedTools = () => {
  return (
    <section className="relative py-24 px-6 bg-linear-to-b from-slate-50 to-white overflow-hidden">

      {/* background blur shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 blur-3xl opacity-20 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 blur-3xl opacity-20 rounded-full"></div>

      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-20 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
          Featured Software Tools
        </h2>

        <p className="mt-5 text-gray-500 max-w-xl mx-auto text-lg">
          Explore powerful developer tools available in our marketplace.
          Purchase credits and unlock premium downloads instantly.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto relative z-10">

        {tools.map((tool, index) => (
          <div
            key={index}
            className="group relative bg-white/70 backdrop-blur border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >

            {/* linear icon */}
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold bg-linear-to-br ${tool.gradient}`}
            >
              {tool.tag}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mt-6 text-slate-800 group-hover:text-blue-600 transition">
              {tool.name}
            </h3>

            {/* Description */}
            <p className="mt-3 text-gray-500 leading-relaxed">
              {tool.description}
            </p>

            {/* Bottom */}
            <div className="flex items-center justify-between mt-8">

              {/* Credits */}
              <span className="px-3 py-1 text-sm rounded-full bg-blue-50 text-blue-600 font-semibold">
                {tool.credits} Credits
              </span>

              {/* Button */}
              <Link
                to="/store"
                className="text-sm bg-slate-900 hover:bg-black text-white px-5 py-2 rounded-lg transition"
              >
                View Tool
              </Link>

            </div>

            {/* Hover gradient glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-linear-to-r from-blue-500/10 to-purple-500/10"></div>

          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-20 relative z-10">
        <Link
          to="/store"
          className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
        >
          Browse All Software →
        </Link>
      </div>

    </section>
  );
};

export default FeaturedTools;