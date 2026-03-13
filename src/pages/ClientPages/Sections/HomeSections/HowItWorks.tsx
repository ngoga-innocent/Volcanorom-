const steps = [
  {
    icon: "💳",
    title: "Buy Credits",
    description:
      "Purchase credits securely using our fast and encrypted payment system.",
  },
  {
    icon: "🛠",
    title: "Choose Tools",
    description:
      "Browse our growing marketplace of powerful developer software.",
  },
  {
    icon: "⬇️",
    title: "Instant Download",
    description:
      "Use your credits to unlock and instantly download premium tools.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-24 px-6 bg-linear-to-b from-white to-slate-50 overflow-hidden">

      {/* background glow */}
      <div className="absolute left-0 top-0 w-72 h-72 bg-blue-200 blur-3xl opacity-20 rounded-full"></div>
      <div className="absolute right-0 bottom-0 w-72 h-72 bg-purple-200 blur-3xl opacity-20 rounded-full"></div>

      {/* Header */}
      <div className="text-center mb-20 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800">
          How It Works
        </h2>

        <p className="mt-4 text-gray-500 max-w-xl mx-auto">
          Getting started is simple. Follow these three easy steps to
          unlock powerful software tools instantly.
        </p>
      </div>

      {/* Steps */}
      <div className="relative max-w-6xl mx-auto grid md:grid-cols-3 gap-10 z-10">

        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative bg-white/70 backdrop-blur border border-gray-100 rounded-2xl p-10 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >

            {/* Step number */}
            <div className="absolute -top-4 left-6 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              Step {index + 1}
            </div>

            {/* Icon */}
            <div className="text-5xl mb-6 group-hover:scale-110 transition">
              {step.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-slate-800">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 mt-3 leading-relaxed">
              {step.description}
            </p>

            {/* hover glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-linear-to-r from-blue-500/10 to-purple-500/10"></div>

          </div>
        ))}
      </div>

    </section>
  );
};

export default HowItWorks;