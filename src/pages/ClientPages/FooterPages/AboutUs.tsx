const About = () => {
  return (
    <div className="bg-white text-gray-800">

      {/* HERO */}
      <section className="py-24 text-center bg-linear-to-r from-blue-600 to-indigo-700 text-white">
        <h1 className="text-5xl font-bold mb-6">
          About Volcanorom
        </h1>

        <p className="max-w-2xl mx-auto text-lg opacity-90">
          Volcanorom is a modern digital marketplace built to deliver
          high-quality software solutions to developers, businesses,
          and technology enthusiasts around the world.
        </p>
      </section>

      {/* MISSION */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Our Mission
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Our mission is to simplify how people discover, purchase,
            and deploy powerful software tools. We connect developers
            and users through a secure and seamless marketplace
            experience.
          </p>
        </div>

        <div className="bg-gray-100 p-10 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">
            Why Volcanorom?
          </h3>

          <ul className="space-y-3 text-gray-600">
            <li>⚡ Secure digital delivery</li>
            <li>🚀 Fast downloads</li>
            <li>🛡️ Verified software</li>
            <li>🌍 Global accessibility</li>
          </ul>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 text-center gap-10">

          <div>
            <h3 className="text-3xl font-bold text-blue-600">1000+</h3>
            <p className="text-gray-500">Products</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-blue-600">50K+</h3>
            <p className="text-gray-500">Users</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-blue-600">120+</h3>
            <p className="text-gray-500">Developers</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-blue-600">99.9%</h3>
            <p className="text-gray-500">Uptime</p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;