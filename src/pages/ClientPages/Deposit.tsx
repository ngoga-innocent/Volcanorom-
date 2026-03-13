import { useState, useEffect } from "react";
import {
  FiUpload,
  FiDollarSign,
  FiCreditCard,
  FiArrowRight,
} from "react-icons/fi";
import url from "../../url";
import { toast } from "react-toastify";
import { useLoader } from "../../app/LoaderContext";

const USDT_TO_CREDITS = 1;

export default function Deposit() {

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("crypto");

  const [currency, setCurrency] = useState("USD");
  const [currencies, setCurrencies] = useState<string[]>([]);

  const [p2pRate, setP2pRate] = useState<number>(0);

  const [file, setFile] = useState<File | null>(null);

  const { showLoader, hideLoader } = useLoader();

  // Load all currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();

        if (data?.rates) {
          setCurrencies(Object.keys(data.rates));
        }
      } catch (error) {
        toast.error("Failed to load currencies");
      }
    };

    fetchCurrencies();
  }, []);

  // Fetch Binance P2P rate
  useEffect(() => {
  const fetchRate = async () => {
    try {
      const res = await fetch(`${url}/api/p2p-price/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fiat: currency }),
      });

      const data = await res.json();

      if (!data?.price) {
        setP2pRate(0);
        toast.error("No P2P sellers available");
        return;
      }

      setP2pRate(Number(data.price));

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch Binance P2P rate");
    }
  };

  if (currency) {
    fetchRate();
  }

}, [currency]);

  const usdtAmount = Number(amount) || 0;

  const convertedAmount =
    p2pRate > 0 ? (usdtAmount * p2pRate).toFixed(2) : "...";

  const credits = usdtAmount * USDT_TO_CREDITS;

  const handleDeposit = async () => {

    showLoader();

    try {

      const token = localStorage.getItem("access");

      if (!amount) {
        toast.info("Enter deposit amount");
        hideLoader();
        return;
      }

      if (!token) {
        toast.error("Session expired");
        hideLoader();
        return;
      }

      // Manual payment
      if (method === "manual") {

        if (!file) {
          toast.info("Upload payment screenshot");
          hideLoader();
          return;
        }

        const formData = new FormData();

        formData.append("amount", `${credits}`);
        formData.append("currency", currency);
        formData.append("type", "manual");
        formData.append("proof", file);

        const res = await fetch(`${url}/api/wallet/manual_deposit/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Deposit submission failed");
        }

        toast.success("Deposit submitted for approval");

      }

      // Crypto deposit
      if (method === "crypto") {

        const res = await fetch(`${url}/api/wallet/crypto_deposit/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: usdtAmount,
          }),
        });

        const data = await res.json();

        if (data.payment_url) {
          window.location.href = data.payment_url;
        } else {
          throw new Error("Payment URL not returned");
        }
      }

    } catch (error: any) {

      console.error(error);
      toast.error(error.message);

    }

    hideLoader();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">

      {/* LEFT PANEL */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

        <h2 className="text-2xl font-bold text-white mb-6">
          Buy Credits
        </h2>

        <label className="text-sm text-slate-400">
          Amount (USDT)
        </label>

        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg mt-2 mb-5">

          <FiDollarSign className="ml-3 text-slate-400" />

          <input
            type="number"
            placeholder="Enter amount"
            className="w-full p-3 bg-transparent outline-none text-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

        </div>

        <label className="text-sm text-slate-400">
          Select Your Currency
        </label>

        <select
          className="w-full mt-2 mb-5 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {currencies.map((cur) => (
            <option key={cur}>{cur}</option>
          ))}
        </select>

        <label className="text-sm text-slate-400">
          Payment Method
        </label>

        <select
          className="w-full mt-2 mb-5 p-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="crypto">Crypto Payment</option>
          <option value="manual">Lumicash / Manual</option>
        </select>

        {method === "manual" && (

          <div className="bg-slate-800 p-5 rounded-xl mt-4">

            <h4 className="text-white font-semibold mb-3">
              Mobile Money Payment
            </h4>

            <div className="border border-amber-500 bg-amber-500 p-3 rounded-md mb-3">

              <p className="text-black font-bold">
                Send {convertedAmount} {currency}
              </p>

            </div>

            <p className="text-white font-bold">
              Lumicash : 65356635
            </p>

            <p className="text-white font-bold">
              Name : Gerard Ndayizigiye
            </p>

            <p className="text-slate-400 text-sm mt-2">
              After sending money upload screenshot below
            </p>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-6 mt-4 cursor-pointer">

              <FiUpload className="text-xl text-slate-400 mb-2" />

              <span className="text-slate-400">
                {file ? file.name : "Upload Payment Screenshot"}
              </span>

              <input
                type="file"
                hidden
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
              />

            </label>

          </div>

        )}

        <button
          onClick={handleDeposit}
          className="w-full mt-6 bg-blue-600 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
        >

          <FiCreditCard />

          Continue Payment

        </button>

      </div>

      {/* RIGHT PANEL */}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

        <h3 className="text-xl font-semibold mb-6 text-white">
          Payment Summary
        </h3>

        <div className="bg-slate-800 rounded-xl p-6">

          <div className="flex justify-between mb-3 text-slate-400">

            <span>Amount To Pay</span>

            <span>
              {convertedAmount} {currency}
            </span>

          </div>

          <div className="flex flex-col mb-3 text-slate-400">

            <span>Conversion Rate</span>

            <span>1 USDT = 1 Credit</span>

            <span>
              1 USDT ≈{" "}
              {p2pRate ? p2pRate.toFixed(2) : "..."} {currency}
            </span>

          </div>

          <div className="border-t border-slate-700 my-4"></div>

          <div className="flex justify-between text-lg font-bold text-white">

            <span>Credits You Get</span>

            <span className="text-blue-400">
              {credits}
            </span>

          </div>

        </div>

        <div className="flex items-center justify-center gap-3 mt-8 text-slate-400">

          <span>{currency}</span>

          <FiArrowRight />

          <span>Credits</span>

        </div>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Credits will be added after payment confirmation.
        </p>

      </div>

    </div>
  );
}