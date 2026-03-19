import { useEffect, useState } from "react";
import {
  FiUpload,
  FiDollarSign,
  FiCreditCard,
  FiArrowRight,
} from "react-icons/fi";
import { SiTether } from "react-icons/si";
import { toast } from "react-toastify";
import url from "../../url";
import { useLoader } from "../../app/LoaderContext";
import mpesa from "../../assets/mpesa.jpg";
import lumicash from "../../assets/lumicash.jpg";
import safaricom from "../../assets/safaricom.jpeg";

import { useGetMyTransactionsQuery } from "../../features/auth/authApi";
// Local currency multipliers for demo (replace with API if needed)
const USDT_TO_CREDITS = 1;

const paymentMethods: any = {
  crypto: {
    label: "Crypto Payment (USDT)",
    currency: "USDT",
    icon: <SiTether className="text-green-400 text-2xl" />,
  },
  manual_lumicash: {
    label: "Lumicash (BIF)",
    currency: "BIF",
    number: "65356635",
    name: "Gerard Ndayizigiye",
    icon: lumicash, // Replace with actual image path
  },
  manual_mpesa: {
    label: "M-Pesa Tanzania (TZS)",
    currency: "TZS",
    number: "255766458059",
    name: "VERONIKA JOSEPH MARO",
    icon: safaricom,
  },
  manual_safaricom: {
    label: "M-Pesa Kenya (KES)",
    currency: "KES",
    number: "254797429859",
    name: "EMMANUEL HONDEKA",
    icon: mpesa,
  },
};

export default function Deposit() {
  const { showLoader, hideLoader } = useLoader();

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("crypto");
  const [p2pRate, setP2pRate] = useState<number>(0);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const selectedMethod = paymentMethods[method];
  const currency = selectedMethod.currency;
  const { data: transactions = [], isLoading: txLoading } =
    useGetMyTransactionsQuery();
  // Fetch P2P conversion rate based on method
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(`${url}/api/p2p-price/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fiat: currency }),
        });
        const data = await res.json();
        setP2pRate(Number(data.price) || 0);
      } catch (err) {
        // console.log(err);
        setP2pRate(1);
        toast.error("Failed to fetch conversion rate");
      }
    };
    fetchRate();
  }, [method, currency]);

  const usdtAmount = Number(amount) || 0;
  const credits = usdtAmount * USDT_TO_CREDITS;
  const convertedAmount =
    p2pRate > 0 ? (usdtAmount * p2pRate).toFixed(2) : usdtAmount;

  const handleFileChange = (e: any) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleDeposit = async () => {
    showLoader();
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        toast.error("Session expired");
        hideLoader();
        return;
      }

      if (!amount || Number(amount) <= 0) {
        toast.info("Enter a valid amount");
        hideLoader();
        return;
      }

      // Crypto Payment
      if (method === "crypto") {
        const res = await fetch(`${url}/api/wallet/crypto_deposit/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: usdtAmount }),
        });

        const data = await res.json();
        if (!data.payment_url) throw new Error("Payment URL not returned");
        window.location.href = data.payment_url;
      }

      // Manual Payment
      if (method.startsWith("manual")) {
        if (!file) {
          toast.info("Upload payment screenshot");
          hideLoader();
          return;
        }

        const formData = new FormData();
        formData.append("amount", `${credits}`);
        formData.append("currency", currency);
        formData.append("type", method);
        formData.append("proof", file);

        const res = await fetch(`${url}/api/wallet/manual_deposit/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) throw new Error("Deposit submission failed");
        toast.success("Deposit submitted for approval");
        setAmount("");
        setFile(null);
        setPreview(null);
      }
    } catch (err: any) {
      // console.log(err);
      toast.error(err.message);
    }
    hideLoader();
  };
  const getStatusColor = (status: string) => {
    if (status === "pending") return "bg-yellow-500/20 text-yellow-400";
    if (status === "approved" || status === "completed")
      return "bg-green-500/20 text-green-400";
    return "bg-red-500/20 text-red-400";
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      {/* LEFT PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Buy Credits</h2>

          <button
            onClick={() => setShowTransactions(true)}
            className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-white"
          >
            View Transactions
          </button>
        </div>

        {/* Amount Input */}
        <label className="text-sm text-slate-400">Amount (USDT)</label>
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg mt-2 mb-6">
          <FiDollarSign className="ml-3 text-slate-400" />
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full p-3 bg-transparent outline-none text-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Payment Methods */}
        <label className="text-sm text-slate-400">Payment Method</label>
        <div className="grid grid-cols-2 gap-4 mt-3">
          {Object.entries(paymentMethods).map(([key, value]: any) => (
            <button
              key={key}
              onClick={() => setMethod(key)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                method === key
                  ? "border-blue-500 bg-blue-600/20"
                  : "border-slate-700 hover:border-blue-500"
              }`}
            >
              {typeof value.icon === "string" ? (
                <img src={value.icon} alt={value.label} className="w-6 h-6" />
              ) : (
                value.icon
              )}
              <span className="text-sm text-white">{value.label}</span>
            </button>
          ))}
        </div>

        {/* Manual Payment */}
        {method.startsWith("manual") && (
          <div className="bg-slate-800 p-5 rounded-xl mt-6">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              {typeof selectedMethod.icon === "string" ? (
                <img
                  src={selectedMethod.icon}
                  alt={selectedMethod.label}
                  className="w-6 h-6"
                />
              ) : (
                selectedMethod.icon
              )}
              {selectedMethod.label}
            </h4>

            <div className="border border-amber-500 bg-amber-500 p-3 rounded-md mb-3">
              <p className="text-black font-bold">
                Send {convertedAmount} {currency}
              </p>
            </div>

            <p className="text-white font-bold">
              Number: {selectedMethod.number}
            </p>
            <p className="text-white font-bold">Name: {selectedMethod.name}</p>
            <p className="text-slate-400 text-sm mt-2">
              After sending money upload screenshot
            </p>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-6 mt-4 cursor-pointer hover:border-blue-500">
              {preview ? (
                <img src={preview} className="max-h-48 rounded-lg mb-3" />
              ) : (
                <FiUpload className="text-xl text-slate-400 mb-2" />
              )}
              <span className="text-slate-400 text-sm">
                {file ? file.name : "Upload Payment Screenshot"}
              </span>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}

        {/* Deposit Button */}
        <button
          onClick={handleDeposit}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
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
            <span>Amount</span>
            <span>{usdtAmount} USDT</span>
          </div>
          <div className="flex justify-between mb-3 text-slate-400">
            <span>Conversion Rate</span>
            <span>
              1 USDT ≈ {p2pRate ? p2pRate.toFixed(2) : "1"} {currency}
            </span>
          </div>
          <div className="flex justify-between mb-3 text-slate-400">
            <span>Total To Pay</span>
            <span>
              {convertedAmount || usdtAmount} {currency}
            </span>
          </div>

          <div className="border-t border-slate-700 my-4"></div>

          <div className="flex justify-between text-lg font-bold text-white">
            <span>Credits You Get</span>
            <span className="text-blue-400">{credits}</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-8 text-slate-400">
          <span>{currency}</span>
          <FiArrowRight />
          <span>Credits</span>
        </div>

        <p className="text-sm text-slate-500 mt-6 text-center">
          Credits will be added after payment confirmation
        </p>
      </div>
      {showTransactions && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setShowTransactions(false)}
          />

          {/* Drawer */}
          <div className="w-[90%] md:w-[70%] bg-slate-900 h-full p-6 overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Transaction History
              </h2>

              <button
                onClick={() => setShowTransactions(false)}
                className="text-red-400 hover:text-red-500"
              >
                Close
              </button>
            </div>

            {/* Loading */}
            {txLoading ? (
              <p className="text-slate-400">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-slate-400">No transactions found</p>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx: any) => (
                  <div
                    key={tx.id}
                    className="bg-slate-800 p-4 rounded-xl border border-slate-700"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-semibold">
                          {tx.amount} {tx.currency || "USDT"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {tx.type.replace("_", " ")}
                        </p>
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          tx.status,
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">
                      {new Date(tx.created_at).toLocaleString()}
                    </div>

                    {/* Proof Image */}
                    {tx.proof && (
                      <img
                        src={tx.proof}
                        className="mt-3 w-10 h-10 rounded-lg max-h-40 object-cover border"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
