const Stats = () => {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-6">

        <div>
          <h2 className="text-3xl font-bold text-blue-600">120+</h2>
          <p className="text-gray-500">Developer Tools</p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-blue-600">10K+</h2>
          <p className="text-gray-500">Downloads</p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-blue-600">4.9</h2>
          <p className="text-gray-500">User Rating</p>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-blue-600">99%</h2>
          <p className="text-gray-500">Customer Satisfaction</p>
        </div>

      </div>
    </section>
  );
};

export default Stats;