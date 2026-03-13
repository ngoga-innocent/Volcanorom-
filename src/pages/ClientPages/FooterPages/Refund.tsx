const Refund = () => {
  return (
    <div className="bg-white text-black mx-auto py-20 px-6 ">

      <h1 className="text-4xl font-bold mb-8">
        Refund Policy
      </h1>

      <p className="text-gray-600 mb-6">
        At Volcanorom we aim to provide high-quality digital products.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        Refund Eligibility
      </h2>

      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Product does not match description</li>
        <li>Technical issue preventing usage</li>
        <li>Duplicate purchase</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        Non-Refundable Cases
      </h2>

      <ul className="list-disc ml-6 text-gray-600 space-y-2">
        <li>Change of mind after download</li>
        <li>Failure to meet system requirements</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        Requesting a Refund
      </h2>

      <p className="text-gray-600">
        To request a refund contact support within 7 days of purchase.
      </p>

    </div>
  );
};
export default Refund