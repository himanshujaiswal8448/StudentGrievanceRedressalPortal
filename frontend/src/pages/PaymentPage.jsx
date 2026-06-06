import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import client from "../api/client";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("Semester Fee");
  const [description, setDescription] = useState("");

  const handlePayment = async () => {
    try {
      if (!amount) {
        return toast.error("Enter amount");
      }

      const { data: order } = await client.post("/payments/create-order", {
        amount,
        paymentType,
        description,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,
        currency: order.currency,
        order_id: order.id,

        name: "Student Grievance Portal",
        description: paymentType,

        handler: async function (response) {
          await client.post("/payments/verify", {
            ...response,
            amount,
            paymentType,
            description,
          });

          toast.success("Payment Successful");

          navigate("/student/my-payments");
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      toast.error("Payment failed");
    }
  };

  return (
    <div
      className={` flex justify-center items-center p-6 ${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-xl rounded-3xl shadow-2xl p-8 ${
          darkMode ? "bg-gray-900 border border-gray-800" : "bg-white"
        }`}
      >
        <h1 className="text-3xl font-bold mb-2">Fee Payment</h1>

        <p className="text-gray-500 mb-8">
          Pay college fees securely using Razorpay
        </p>

        <div className="space-y-5">
          <div>
            <label className="font-medium">Amount (₹)</label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount"
              className="w-full mt-2 p-3 rounded-xl border bg-transparent"
            />
          </div>

          <div>
            <label className="font-medium">Payment Type</label>

            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl border bg-transparent"
            >
              <option>Semester Fee</option>
              <option>Hostel Fee</option>
              <option>Library Fine</option>
              <option>Exam Fee</option>
              <option>Registration Fee</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Description</label>

            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-2 p-3 rounded-xl border bg-transparent"
            />
          </div>

          <button
            onClick={handlePayment}
            title="Secure Razorpay Payment"
            className="
              w-full
              py-4
              rounded-xl
              text-white
              font-semibold
              bg-gradient-to-r
              from-green-600
              to-emerald-600
              hover:scale-105
              transition-all
              duration-300
              shadow-lg
            "
          >
            💳 Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
