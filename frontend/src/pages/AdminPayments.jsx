import { useEffect, useState } from "react";
import client from "../api/client";
import toast from "react-hot-toast";
import { Search, IndianRupee, Receipt, CheckCircle } from "lucide-react";
import { useOutletContext } from "react-router-dom";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const { darkMode } = useOutletContext();

  const fetchPayments = async () => {
    try {
      const { data } = await client.get("/payments/all");
      setPayments(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch payments");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) =>
    ((p.student?.name || "") + (p.student?.email || "") + (p.paymentType || ""))
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalRevenue = filtered.reduce((sum, p) => sum + Number(p.amount), 0);

  const successfulPayments = filtered.filter(
    (p) => p.status === "success",
  ).length;

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          💳 Payment Management
        </h1>

        <p className="text-gray-400 mt-1">
          Monitor all student fee transactions
        </p>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <div
          className={`p-5 rounded-2xl shadow-lg ${
            darkMode
              ? "bg-green-900/30 border border-green-700"
              : "bg-green-600 text-white"
          }`}
        >
          <p>Total Revenue</p>
          <h2 className="text-3xl font-bold mt-2">₹{totalRevenue}</h2>
        </div>

        <div
          className={`p-5 rounded-2xl shadow-lg ${
            darkMode
              ? "bg-blue-900/30 border border-blue-700"
              : "bg-blue-600 text-white"
          }`}
        >
          <p>Transactions</p>

          <h2 className="text-3xl font-bold mt-2">{filtered.length}</h2>
        </div>

        <div
          className={`p-5 rounded-2xl shadow-lg ${
            darkMode
              ? "bg-purple-900/30 border border-purple-700"
              : "bg-purple-600 text-white"
          }`}
        >
          <p>Successful</p>

          <h2 className="text-3xl font-bold mt-2">{successfulPayments}</h2>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />

        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />

          <input
            type="text"
            placeholder="Search student, email or fee type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
              darkMode ? "bg-gray-900 border-gray-700" : "bg-white"
            }`}
          />
        </div>
      </div>

      {/* TABLE */}
      <div
        className={`overflow-x-auto rounded-2xl shadow-lg border ${
          darkMode ? "bg-gray-900 border-gray-800" : "bg-white"
        }`}
      >
        <table className="w-full">
          <thead
            className={
              darkMode ? "bg-gray-800 text-white" : "bg-slate-800 text-white"
            }
          >
            <tr>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Fee Type</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Payment ID</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p._id}
                  className={`border-t transition ${
                    darkMode
                      ? "border-gray-800 hover:bg-gray-800"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <td className="p-4 font-medium">{p.student?.name}</td>

                  <td className="p-4">{p.student?.email}</td>

                  <td className="p-4">{p.paymentType}</td>

                  <td className="p-4 font-bold text-green-500">₹{p.amount}</td>

                  <td className="p-4">{p.description || "-"}</td>

                  <td className="p-4 text-xs">{p.razorpayPaymentId || "-"}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        p.status === "success"
                          ? "bg-green-500/20 text-green-400"
                          : p.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
