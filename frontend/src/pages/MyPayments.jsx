import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import client from "../api/client";
import toast from "react-hot-toast";

export default function MyPayments() {
  const { darkMode } = useOutletContext();

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data } = await client.get("/payments/my");

      setPayments(data);
    } catch {
      toast.error("Failed to load payments");
    }
  };

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">My Payments</h1>

      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className="bg-green-600 text-white rounded-2xl p-6 shadow-lg">
          <h3>Total Paid</h3>
          <p className="text-4xl font-bold">₹{totalPaid}</p>
        </div>

        <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <h3>Transactions</h3>
          <p className="text-4xl font-bold">{payments.length}</p>
        </div>
      </div>

      <div
        className={`rounded-2xl overflow-hidden shadow-lg ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left">Payment Type</th>

              <th className="p-4 text-left">Amount</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-500/10">
                <td className="p-4">{p.paymentType}</td>

                <td className="p-4 font-semibold">₹{p.amount}</td>

                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {p.status}
                  </span>
                </td>

                <td className="p-4">
                  {new Date(p.createdAt).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
