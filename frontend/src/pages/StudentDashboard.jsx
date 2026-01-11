import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import client from "../api/client.js";
import ComplaintForm from "./ComplaintForm.jsx";

export default function StudentDashboard() {
  const { darkMode } = useOutletContext(); // ✅ Get from layout
  const [mine, setMine] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchComplaints = async () => {
    try {
      const { data } = await client.get("/complaints/mine");
      setMine(data);
    } catch (err) {
      console.error("❌ Failed to fetch complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const resolvedCount = mine.filter((m) => m.status === "resolved").length;
  const pendingCount = mine.filter((m) => m.status === "pending").length;
  const inProgressCount = mine.filter((m) => m.status === "in_progress").length;

  const summary = [
    {
      title: "Total Complaints",
      value: mine.length,
      color: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
    },
    {
      title: "Pending",
      value: pendingCount,
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    },
    {
      title: "In Progress",
      value: inProgressCount,
      color: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    },
    {
      title: "Resolved",
      value: resolvedCount,
      color:
        "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    },
  ];

  return (
    <div
      className={`min-h-screen p-6 transition-colors ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
        >
          + New Complaint
        </button>
      </div>

      {/* ===== Summary Cards ===== */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summary.map((c) => (
          <div
            key={c.title}
            className={`p-5 rounded-2xl shadow hover:shadow-lg transition ${c.color}`}
          >
            <h3 className="text-lg font-medium">{c.title}</h3>
            <p className="text-3xl font-bold mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      {/* ===== Complaints Table ===== */}
      <div
        className={`rounded-2xl shadow p-5 ${
          darkMode ? "bg-gray-900/70 border border-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-lg font-semibold mb-3">My Complaints</h2>

        {mine.length === 0 ? (
          <p className="text-gray-500 italic">No complaints found.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm border-collapse">
              <thead>
                <tr
                  className={`text-left ${
                    darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100"
                  }`}
                >
                  {[
                    "Title",
                    "Category",
                    "Priority",
                    "Status",
                    "Created At",
                  ].map((h) => (
                    <th key={h} className="px-4 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mine.map((r) => (
                  <tr
                    key={r._id}
                    className={`border-b ${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-800"
                        : "border-gray-200 hover:bg-gray-50"
                    } transition`}
                  >
                    <td className="px-4 py-2">{r.title}</td>
                    <td className="px-4 py-2 capitalize">{r.category}</td>
                    <td className="px-4 py-2 capitalize">{r.priority}</td>
                    <td className="px-4 py-2 capitalize">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : r.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {r.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== Complaint Form Modal ===== */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl relative ${
              darkMode ? "bg-gray-900 text-gray-100" : "bg-white"
            }`}
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4">Submit Complaint</h2>

            <ComplaintForm
              onSuccess={() => {
                setShowForm(false);
                fetchComplaints();
              }}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}
    </div>
  );
}
