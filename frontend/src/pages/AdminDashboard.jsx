import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import client from "../api/client.js";
import toast from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  CreditCard,
  MessageCircle,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import AdminChat from "../components/AdminChat";

export default function AdminDashboard() {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [filter, setFilter] = useState({ status: "", category: "" });
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    pending: 0,
    in_progress: 0,
    resolved: 0,
  });
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  const cardClass = darkMode
    ? "bg-gray-900/70 border-gray-800 text-gray-100"
    : "bg-white border-gray-200 text-gray-900 shadow-md";

  const mutedText = darkMode ? "text-gray-400" : "text-gray-600";

  const inputClass = darkMode
    ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 shadow-sm";

  const fetchList = async () => {
    try {
      const params = new URLSearchParams({
        ...filter,
        search,
      });

      const { data } = await client.get(`/admin/complaints?${params}`);
      setList(data);

      const pending = data.filter((r) => r.status === "pending").length;
      const inProgress = data.filter((r) => r.status === "in_progress").length;
      const resolved = data.filter((r) => r.status === "resolved").length;

      setStats({ pending, in_progress: inProgress, resolved });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch complaints.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchList();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, filter]);

  const updateStatus = async (id, status) => {
    try {
      await client.patch(`/admin/complaints/${id}/status`, { status });
      toast.success(`Marked as ${status.replace("_", " ")}`);
      fetchList();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    }
  };

  const getImageUrl = (path) => {
    const base = import.meta.env.VITE_API_URL?.replace("/api", "") || "";
    return `${base}/${path}`;
  };

  const totalComplaints = list.length;

  const summary = [
    {
      label: "Total",
      val: totalComplaints,
      icon: ClipboardList,
      color: darkMode
        ? "bg-gray-800 text-gray-100"
        : "bg-slate-100 text-slate-800",
    },
    {
      label: "Pending",
      val: stats.pending,
      icon: AlertTriangle,
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    },
    {
      label: "In Progress",
      val: stats.in_progress,
      icon: Clock,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      label: "Resolved",
      val: stats.resolved,
      icon: CheckCircle,
      color: "bg-green-500/20 text-green-400 border-green-500/30",
    },
  ];

  const COLORS = ["#FACC15", "#3B82F6", "#22C55E"];

  const chartData = [
    { name: "Pending", value: stats.pending },
    { name: "In Progress", value: stats.in_progress },
    { name: "Resolved", value: stats.resolved },
  ];

  const statusBadge = (status) => {
    if (status === "pending") {
      return "bg-yellow-500/20 text-yellow-400";
    }

    if (status === "in_progress") {
      return "bg-blue-500/20 text-blue-400";
    }

    return "bg-green-500/20 text-green-400";
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode
          ? "bg-gray-950 text-gray-100"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ClipboardList size={30} className="text-blue-500" />
            Admin Dashboard
          </h1>

          <p className={`mt-1 ${mutedText}`}>
            Manage student complaints, update status, and monitor activity.
          </p>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className={`rounded-2xl border shadow-lg p-5 mb-8 ${cardClass}`}>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="relative lg:col-span-2">
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search complaints by title, category, student name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={filter.category}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, category: e.target.value }))
              }
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${inputClass}`}
            >
              <option value="">All Category</option>
              <option value="academics">Academics</option>
              <option value="exam">Exam</option>
              <option value="hostel">Hostel</option>
              <option value="administration">Administration</option>
              <option value="library">Library</option>
              <option value="technical">Technical</option>
              <option value="financial">Financial</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {summary.map(({ label, val, icon: Icon, color }) => (
          <motion.div
            whileHover={{ scale: 1.03 }}
            key={label}
            className={`p-5 rounded-2xl border shadow-lg ${color}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">{label}</h3>
                <p className="text-3xl font-bold mt-2">{val}</p>
              </div>

              <Icon size={30} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* COMPLAINTS */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold">Complaints</h2>
        <p className={`text-sm ${mutedText}`}>
          Showing {list.length} complaints
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.length === 0 ? (
          <div
            className={`col-span-full p-8 text-center rounded-2xl border ${cardClass}`}
          >
            <p className={mutedText}>No complaints found.</p>
          </div>
        ) : (
          list.map((r) => (
            <motion.div
              key={r._id}
              onClick={() => setSelectedComplaintId(r._id)}
              whileHover={{ y: -4 }}
              className={`group p-5 rounded-2xl border shadow-lg cursor-pointer transition-all duration-300 ${
                selectedComplaintId === r._id
                  ? "border-blue-500 bg-blue-500/10 shadow-blue-500/20"
                  : darkMode
                    ? "bg-gray-900/80 border-gray-800 hover:border-blue-500/50"
                    : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-blue-100"
              }`}
            >
              <div className="flex justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-bold text-lg group-hover:text-blue-500 transition">
                    {r.title}
                  </h2>

                  <p className={`text-sm mt-1 ${mutedText}`}>
                    {r.student?.name || "Student"}
                  </p>

                  <p className={`text-xs ${mutedText}`}>
                    {r.student?.email || "No email"}
                  </p>
                </div>

                <span
                  className={`h-fit px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(
                    r.status,
                  )}`}
                >
                  {r.status?.replace("_", " ")}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 capitalize">
                  {r.category || "others"}
                </span>

                {r.priority && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs capitalize ${
                      r.priority === "high"
                        ? "bg-red-500/20 text-red-400"
                        : r.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {r.priority} priority
                  </span>
                )}

                <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                  👍 {r.votes || 0} votes
                </span>
              </div>

              {r.description && (
                <p className={`text-sm line-clamp-3 mb-4 ${mutedText}`}>
                  {r.description}
                </p>
              )}

              {r.attachments?.length > 0 && (
                <div className="mb-4">
                  <p
                    className={`text-xs mb-2 flex items-center gap-1 ${mutedText}`}
                  >
                    <ImageIcon size={14} />
                    {r.attachments.length} Attachment(s)
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    {r.attachments.slice(0, 4).map((file, i) => (
                      <a
                        key={i}
                        href={getImageUrl(file.path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img
                          src={getImageUrl(file.path)}
                          alt="attachment"
                          className="h-14 w-14 object-cover rounded-xl border border-gray-700 hover:scale-105 transition"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={`flex justify-between items-center pt-4 border-t ${
                  darkMode ? "border-gray-800" : "border-gray-200"
                }`}
              >
                <small className={mutedText}>
                  Updated {new Date(r.updatedAt).toLocaleDateString("en-IN")}
                </small>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedComplaintId(r._id);
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1 transition"
                >
                  <MessageCircle size={13} />
                  Chat
                </button>
              </div>

              <div className="flex gap-2 flex-wrap mt-4">
                {["pending", "in_progress", "resolved"].map((status) => (
                  <button
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(r._id, status);
                    }}
                    disabled={r.status === status}
                    className={`px-3 py-1.5 text-xs rounded-lg transition capitalize ${
                      r.status === status
                        ? darkMode
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* CHART */}
      <motion.div
        className={`mt-10 rounded-2xl shadow-lg p-6 border ${cardClass}`}
      >
        <h2 className="text-lg font-semibold mb-1">Complaint Distribution</h2>
        <p className={`text-sm mb-4 ${mutedText}`}>
          Current complaint status overview.
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" outerRadius={100} label>
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* CHAT */}
      {selectedComplaintId && (
        <div
          className={`mt-6 p-5 rounded-2xl border shadow-lg ${
            darkMode
              ? "border-blue-500 bg-gray-900/70"
              : "border-blue-200 bg-white"
          }`}
        >
          <div className="flex justify-between mb-3">
            <h3 className="text-lg font-semibold">Complaint Chat</h3>

            <button
              onClick={() => setSelectedComplaintId(null)}
              className="text-red-400 text-sm"
            >
              Close ❌
            </button>
          </div>

          <AdminChat
            complaintId={selectedComplaintId}
            onClose={() => setSelectedComplaintId(null)}
          />
        </div>
      )}
    </div>
  );
}
