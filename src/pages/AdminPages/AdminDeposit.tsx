import { useMemo, useState } from "react";
import { FaSearch, FaWallet, FaUser, FaMoneyBillWave } from "react-icons/fa";
import {
  useAdminAddCreditMutation,
  useGetUsersQuery,
} from "../../features/adminApi";
import { toast } from "react-toastify";

const AdminDepositPage = () => {
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [amount, setAmount] = useState("");

  const [reference, setReference] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // USERS
  const { data: users = [], isLoading: loadingUsers } = useGetUsersQuery();

  // MUTATION
  const [adminAddCredit, { isLoading: depositing }] =
    useAdminAddCreditMutation();

  // FILTER USERS
  const filteredUsers = useMemo(() => {
    if (!search) return users;

    return users.filter((user: any) =>
      `${user.username} ${user.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [users, search]);

  // SUBMIT
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      await adminAddCredit({
        user_id: selectedUser.id,
        amount,
        reference,
      }).unwrap();

      toast.success("Wallet funded successfully");

      setAmount("");
      setReference("");
    } catch (err) {
      console.log(err);
      toast.error("Failed to fund wallet");
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center">
              <FaWallet className="text-blue-400 text-2xl" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">Deposit Wallet</h1>

              <p className="text-slate-400 mt-1">
                Fund client balances instantly
              </p>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* FORM CARD */}
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8">
            <form onSubmit={handleDeposit} className="space-y-6">
              {/* SEARCH USER */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Search Client
                </label>

                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                  <input
                    type="text"
                    value={selectedUser ? selectedUser.username : search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedUser(null);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    placeholder="Search username or email..."
                    className="
                      w-full bg-slate-800
                      border border-white/10
                      rounded-2xl
                      pl-12 pr-4 py-4
                      outline-none
                      focus:border-blue-500
                      transition
                    "
                  />
                </div>

                {/* DROPDOWN */}
                {dropdownOpen && !selectedUser && (
                  <div
                    className="
                        absolute z-50 mt-2
                        w-full max-h-72 overflow-y-auto
                        bg-slate-900
                        border border-white/10
                        rounded-2xl
                        shadow-2xl
                      "
                  >
                    {loadingUsers ? (
                      <div className="p-4 text-slate-400">Loading users...</div>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user: any) => (
                        <button
                          type="button"
                          key={user.id}
                          onClick={() => {
                            setSelectedUser(user);

                            setDropdownOpen(false);
                          }}
                          className="
                                w-full text-left
                                px-4 py-4
                                hover:bg-slate-800
                                border-b border-white/5
                                transition
                              "
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {user.username}
                              </p>

                              <p className="text-sm text-slate-400 truncate">
                                {user.email}
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-xs text-slate-500">Balance</p>

                              <p className="text-green-400 font-semibold">
                                ${user.balance}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-slate-400">No users found</div>
                    )}
                  </div>
                )}
              </div>

              {/* AMOUNT */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Deposit Amount
                </label>

                <div className="relative">
                  <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="
                      w-full bg-slate-800
                      border border-white/10
                      rounded-2xl
                      pl-12 pr-4 py-4
                      outline-none
                      focus:border-blue-500
                      transition
                    "
                    required
                  />
                </div>
              </div>

              {/* REFERENCE */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Reference / Note
                </label>

                <textarea
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  rows={4}
                  placeholder="Optional note..."
                  className="
                    w-full bg-slate-800
                    border border-white/10
                    rounded-2xl
                    px-4 py-4
                    outline-none
                    resize-none
                    focus:border-blue-500
                    transition
                  "
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={depositing || !selectedUser}
                className="
                  w-full py-4 rounded-2xl
                  bg-blue-600 hover:bg-blue-700
                  disabled:opacity-50
                  transition
                  font-semibold text-lg
                "
              >
                {depositing ? "Processing..." : "Deposit Funds"}
              </button>
            </form>
          </div>

          {/* SIDE PANEL */}
          <div className="space-y-6">
            {/* USER CARD */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
              <h2 className="text-lg font-semibold mb-5">Selected Client</h2>

              {selectedUser ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                      <FaUser className="text-blue-400 text-xl" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {selectedUser.username}
                      </h3>

                      <p className="text-slate-400 text-sm truncate">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-2xl p-5">
                    <p className="text-slate-400 text-sm">Current Balance</p>

                    <h1 className="text-3xl font-bold text-green-400 mt-2">
                      ${selectedUser.balance}
                    </h1>
                  </div>
                </div>
              ) : (
                <div className="text-slate-400 text-sm">No client selected</div>
              )}
            </div>

            {/* INFO */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
              <h2 className="text-lg font-semibold mb-4">
                Deposit Information
              </h2>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="text-green-400">Instant</span>
                </div>

                <div className="flex justify-between">
                  <span>Transaction Type</span>
                  <span>Admin Credit</span>
                </div>

                <div className="flex justify-between">
                  <span>Visibility</span>
                  <span>User Wallet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDepositPage;
