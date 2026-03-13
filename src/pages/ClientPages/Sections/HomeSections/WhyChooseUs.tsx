const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gray-50 px-6">

      <h2 className="text-3xl font-bold text-center mb-12">
        Why Choose DevTools Market
      </h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

        <div>
          <h3 className="font-semibold text-lg mb-2">
            ⚡ Fast Downloads
          </h3>
          <p className="text-gray-500">
            Instantly download tools after purchase.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            🔒 Secure Payments
          </h3>
          <p className="text-gray-500">
            All transactions are protected.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">
            🧑‍💻 Developer Focused
          </h3>
          <p className="text-gray-500">
            Tools designed specifically for developers.
          </p>
        </div>

      </div>

    </section>
  );
};

export default WhyChooseUs;