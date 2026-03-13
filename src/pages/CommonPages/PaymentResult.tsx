import { CheckCircle, XCircle, Loader } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import url from "../../url";

const PaymentResult = () => {

  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState("loading");

  useEffect(() => {

    if (!orderId) return;

    const checkPayment = async () => {

      try {

        const res = await axios.get(
          `${url}/api/wallet/check-payment/?order_id=${orderId}`
        );

        setStatus(res.data.status);

      } catch {
        setStatus("failed");
      }

    };

    checkPayment();

  }, [orderId]);

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-md text-center w-100">

        {status === "loading" && (
          <>
            <Loader className="mx-auto animate-spin text-blue-500" size={60}/>
            <h2 className="mt-4 text-xl font-semibold">
              Verifying payment...
            </h2>
          </>
        )}

        {status === "completed" && (
          <>
            <CheckCircle className="mx-auto text-green-700" size={70}/>
            <h2 className="text-2xl font-bold mt-4">
              Payment Successful
            </h2>

            <p className="text-gray-500 mt-2">
              Your wallet has been credited.
            </p>

            <a
              href="/wallet"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded"
            >
              Go to Wallet
            </a>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="mx-auto text-red-500" size={70}/>
            <h2 className="text-2xl font-bold mt-4">
              Payment Failed
            </h2>

            <p className="text-gray-500 mt-2">
              The payment could not be completed.
            </p>

            <a
              href="/wallet"
              className="mt-6 inline-block bg-gray-800 text-white px-6 py-2 rounded"
            >
              Try Again
            </a>
          </>
        )}

      </div>

    </div>

  );
};

export default PaymentResult;