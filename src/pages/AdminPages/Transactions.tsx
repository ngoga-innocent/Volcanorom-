"use client";

import { useEffect } from "react";
import { useLoader } from "../../app/LoaderContext";
import {
  useApproveTransactionMutation,
  useGetTransactionsQuery,
  useRejectTransactionMutation,
} from "../../features/adminApi";

import { Check, X, Download, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminTransactions() {
  const { showLoader, hideLoader } = useLoader();

  const { data: transactions = [], isLoading } = useGetTransactionsQuery();

  const [approveTransaction, { isLoading: approving }] =
    useApproveTransactionMutation();

  const [rejectTransaction, { isLoading: rejecting }] =
    useRejectTransactionMutation();

  /* GLOBAL LOADER */

  useEffect(() => {
    if (approving || rejecting) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [approving, rejecting, showLoader, hideLoader]);

  /* ACTIONS */

  const approve = async (id: number) => {
    try {
      await approveTransaction(id).unwrap();

      toast.success("Transaction approved successfully");
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to approve transaction");
    }
  };

  const reject = async (id: number) => {
    try {
      await rejectTransaction(id).unwrap();

      toast.success("Transaction rejected");
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to reject transaction");
    }
  };

  /* STATS */

  const pending = transactions.filter((t) => t.status === "pending").length;

  const approved = transactions.filter(
    (t) => t.status === "completed"
  ).length;

  const deposited = transactions
    .filter((t) => t.type === "manual" && t.status === "completed")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const used = transactions
    .filter((t) => t.type === "usage")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const formatCurrency = (value: number) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  /* CSV DOWNLOAD */

  const downloadCSV = () => {
    if (!transactions.length) {
      toast.info("No transactions to export");
      return;
    }

    const header = "User,Amount,Type,Status,Reference,Date\n";

    const rows = transactions
      .map(
        (t) =>
          `${t.user?.username},${t.amount},${t.type},${t.status},${t.reference},${t.created_at}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "transactions.csv";
    a.click();

    toast.success("CSV exported");
  };

  return (
    <div className="w-full text-black space-y-6">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>

        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Download size={16} />
          Download CSV
        </button>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending" value={pending} color="text-yellow-600" />
        <StatCard label="Approved" value={approved} color="text-green-600" />

        <StatCard
          label="Deposited"
          value={`$${formatCurrency(deposited)}`}
          color="text-blue-600"
        />

        <StatCard
          label="Used"
          value={`$${formatCurrency(used)}`}
          color="text-red-600"
        />
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-10 text-gray-500 gap-2">
            <Loader2 className="animate-spin" size={18} />
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <p className="p-10 text-center text-gray-500">
            No transactions found
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-600">
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Reference</th>
                <th className="p-4 text-left">Proof</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{tx.user?.username}</td>

                  <td className="p-4 text-green-600 font-semibold">
                    ${tx.amount}
                  </td>

                  <td className="p-4 capitalize">{tx.type}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : tx.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-500">{tx.reference}</td>

                  <td className="p-4">
                    {tx.type?.startsWith("manual") && tx.proof ? (
                      <a
                        href={tx.proof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-4 flex gap-2">
                    {tx.status === "pending" && tx.type === "manual" && (
                      <>
                        <button
                          disabled={approving || rejecting}
                          onClick={() => approve(tx.id)}
                          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded disabled:opacity-50"
                        >
                          <Check size={14} />
                        </button>

                        <button
                          disabled={approving || rejecting}
                          onClick={() => reject(tx.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
                        >
                          <X size={14} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: any;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}