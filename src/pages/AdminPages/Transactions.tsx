"use client";

import {
  useApproveTransactionMutation,
  useGetTransactionsQuery,
  useRejectTransactionMutation,
} from "../../features/adminApi";

import { Check, X, Download } from "lucide-react";




export default function AdminTransactions() {

  const { data: transactions = [], isLoading } =
    useGetTransactionsQuery();

  const [approveTransaction] =
    useApproveTransactionMutation();

  const [rejectTransaction] =
    useRejectTransactionMutation();

  const approve = async (id: number) => {
    await approveTransaction(id).unwrap();
  };

  const reject = async (id: number) => {
    await rejectTransaction(id).unwrap();
  };

  /* STATS */

  const pending = transactions.filter(
    (t) => t.status === "pending"
  ).length;

  const approved = transactions.filter(
    (t) => t.status === "completed"
  ).length;

  const deposited = transactions
    .filter(
      (t) =>
        t.type === "manual" &&
        t.status === "completed"
    )
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

    const header =
      "User,Amount,Type,Status,Reference,Date\n";

    const rows = transactions
      .map(
        (t) =>
          `${t.user?.username},${t.amount},${t.type},${t.status},${t.reference},${t.created_at}`
      )
      .join("\n");

    const blob = new Blob([header + rows], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <div className="w-full text-black space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <h1 className="text-2xl md:text-3xl font-bold">
          Transactions
        </h1>

        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
        >
          <Download size={16} />
          Download CSV
        </button>

      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          label="Pending"
          value={pending}
          color="text-yellow-600"
        />

        <StatCard
          label="Approved"
          value={approved}
          color="text-green-600"
        />

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

          <p className="p-6">Loading transactions...</p>

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

                <tr
                  key={tx.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {tx.user?.username}
                  </td>

                  <td className="p-4 text-green-600 font-semibold">
                    ${tx.amount}
                  </td>

                  <td className="p-4 capitalize">
                    {tx.type}
                  </td>

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

                  <td className="p-4 text-gray-500">
                    {tx.reference}
                  </td>

                  <td className="p-4">

                    {tx.type === "manual" &&
                    tx.proof ? (

                      <a
                        href={tx.proof}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>

                    ) : (
                      "—"
                    )}

                  </td>

                  <td className="p-4 flex gap-2">

                    {tx.status === "pending" &&
                      tx.type === "manual" && (
                        <>
                          <button
                            onClick={() =>
                              approve(tx.id)
                            }
                            className="p-2 bg-green-500 text-white rounded"
                          >
                            <Check size={14} />
                          </button>

                          <button
                            onClick={() =>
                              reject(tx.id)
                            }
                            className="p-2 bg-red-500 text-white rounded"
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
      <p className="text-gray-500 text-sm">
        {label}
      </p>
      <p className={`text-2xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}