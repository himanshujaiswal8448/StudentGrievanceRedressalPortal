import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import client from "../api/client.js";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ClipboardList, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { darkMode } = useOutletContext(); // ✅ Get theme from layout
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState({ status: "", category: "" });
  const [stats, setStats] = useState({
    pending: 0,
    in_progress: 0,
    resolved: 0,
  });

  const fetchList = async () => {
    try {
      const params = new URLSearchParams(filter);
      const { data } = await client.get(`/admin/complaints?${params}`);
      setList(data);
      const pending = data.filter((r) => r.status === "pending").length;
      const inProgress = data.filter((r) => r.status === "in_progress").length;
      const resolved = data.filter((r) => r.status === "resolved").length;
      setStats({ pending, in_progress: inProgress, resolved });
    } catch {
      toast.error("Failed to fetch complaints.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await client.patch(`/admin/complaints/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
      fetchList();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const getImageUrl = (path) => {
    const base = import.meta.env.VITE_API_URL?.replace("/api", "") || "";
    return `${base}/${path}`;
  };

  const COLORS = ["#FACC15", "#3B82F6", "#22C55E"];
  const chartData = [
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.in_progress },
    { name: "Resolved", value: stats.resolved },
  ];

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-semibold mb-8 flex items-center gap-2">
        <ClipboardList size={26} className="text-blue-400" />
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Pending",
            val: stats.pending,
            color: "text-yellow-400",
            icon: AlertTriangle,
          },
          {
            label: "In Progress",
            val: stats.in_progress,
            color: "text-blue-400",
            icon: Clock,
          },
          {
            label: "Resolved",
            val: stats.resolved,
            color: "text-green-400",
            icon: CheckCircle,
          },
        ].map(({ label, val, color, icon: Icon }) => (
          <motion.div
            whileHover={{ scale: 1.05 }}
            key={label}
            className={`p-5 rounded-2xl shadow-lg bg-gray-900/70 border border-gray-800 backdrop-blur-md flex justify-between items-center`}
          >
            <div>
              <h3 className="text-sm text-gray-400">{label}</h3>
              <p className="text-3xl font-bold mt-1">{val}</p>
            </div>
            <Icon size={28} className={color} />
          </motion.div>
        ))}
      </div>

      {/* Complaints */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 italic">
            No complaints found.
          </p>
        ) : (
          list.map((r) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              key={r._id}
              className={`p-6 rounded-2xl shadow-lg border backdrop-blur-md ${
                darkMode ? "bg-gray-900/70 border-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-semibold text-lg">{r.title}</h2>
                  <p className="text-sm text-gray-400">
                    {r.student?.name} • {r.student?.email}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    r.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : r.status === "in_progress"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {r.status.replace("_", " ")}
                </span>
              </div>

              <p className="text-sm mb-3">
                Category:{" "}
                <span className="text-blue-400 font-medium">{r.category}</span>
              </p>

              {r.attachments?.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {r.attachments.map((file, i) => (
                    <a
                      key={i}
                      href={getImageUrl(file.path)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={getImageUrl(file.path)}
                        alt="attachment"
                        className="h-20 w-20 object-cover rounded-xl border border-gray-700 hover:scale-105 transition"
                      />
                    </a>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                <small className="text-gray-500 text-xs">
                  {new Date(r.updatedAt).toLocaleDateString("en-IN")}
                </small>
                <div className="flex gap-2">
                  {["pending", "in_progress", "resolved"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(r._id, s)}
                      disabled={r.status === s}
                      className={`px-3 py-1.5 text-xs rounded-lg ${
                        r.status === s
                          ? "bg-gray-700 text-gray-400"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`mt-10 rounded-2xl shadow-lg p-6 backdrop-blur-md ${
          darkMode ? "bg-gray-900/70 border border-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-lg font-semibold mb-3">Complaint Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
