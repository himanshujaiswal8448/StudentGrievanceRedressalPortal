import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import client from "../api/client.js";
import ComplaintForm from "./ComplaintForm.jsx";
import ChatBox from "../components/ChatBox.jsx";
import socket from "../socket";
import toast from "react-hot-toast";
import {
  Bell,
  Plus,
  CreditCard,
  ReceiptText,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";

export default function StudentDashboard() {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();

  const [mine, setMine] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const getImageUrl = (path) => {
    const base = import.meta.env.VITE_API_URL?.replace("/api", "") || "";
    return `${base}/${path}`;
  };

  const cardClass = darkMode
    ? "bg-gray-900/70 border-gray-800 text-gray-100"
    : "bg-white border-gray-200 text-gray-900 shadow-md";

  const mutedText = darkMode ? "text-gray-400" : "text-gray-600";

  const fetchComplaints = async () => {
    try {
      const { data } = await client.get("/complaints/mine");
      setMine(data);
    } catch (err) {
      console.error("❌ Failed to fetch complaints:", err);
      toast.error("Failed to fetch complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    if (!mine.length) return;

    const joinRooms = () => {
      mine.forEach((c) => socket.emit("joinRoom", c._id));
    };

    if (socket.connected) joinRooms();
    else socket.on("connect", joinRooms);

    return () => {
      mine.forEach((c) => socket.emit("leaveRoom", c._id));
      socket.off("connect", joinRooms);
    };
  }, [mine]);

  useEffect(() => {
    const handler = (msg) => {
      if (msg.sender !== "admin") return;

      const complaint = mine.find((c) => c._id === msg.complaintId);

      const newNotification = {
        id: Date.now(),
        complaintId: msg.complaintId,
        title: complaint?.title || "Complaint",
        message: msg.message,
      };

      setNotifications((prev) => {
        const exists = prev.find((n) => n.complaintId === msg.complaintId);
        if (exists) return prev;
        return [newNotification, ...prev];
      });

      toast.success("New reply from admin 💬");
    };

    socket.off("receiveMessage");
    socket.on("receiveMessage", handler);

    return () => socket.off("receiveMessage", handler);
  }, [mine]);

  const resolved = mine.filter((m) => m.status === "resolved").length;
  const pending = mine.filter((m) => m.status === "pending").length;
  const inProgress = mine.filter((m) => m.status === "in_progress").length;

  const summary = [
    {
      title: "Total Complaints",
      value: mine.length,
      icon: ClipboardList,
      color: darkMode
        ? "bg-gray-800 text-gray-100"
        : "bg-slate-100 text-slate-800",
    },
    {
      title: "Pending",
      value: pending,
      icon: AlertTriangle,
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    },
    {
      title: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      title: "Resolved",
      value: resolved,
      icon: CheckCircle,
      color: "bg-green-500/20 text-green-400 border-green-500/30",
    },
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
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className={`mt-1 ${mutedText}`}>
            Track your complaints, chat with admin, and manage fee payments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* NOTIFICATION */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown((p) => !p)}
              className={`relative p-3 rounded-xl border transition ${
                darkMode
                  ? "bg-gray-900 border-gray-800 hover:bg-gray-800"
                  : "bg-white border-gray-200 hover:bg-blue-50 shadow-sm"
              }`}
            >
              <Bell size={20} />

              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {showDropdown && (
              <div
                className={`absolute right-0 mt-2 w-80 rounded-2xl shadow-xl z-50 border overflow-hidden ${
                  darkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`p-3 border-b text-sm font-semibold ${
                    darkMode ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  Notifications
                </div>

                {notifications.length === 0 ? (
                  <p className={`p-4 text-sm ${mutedText}`}>No new messages</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setSelectedId(n.complaintId);
                        setNotifications((prev) =>
                          prev.filter((x) => x.id !== n.id),
                        );
                        setShowDropdown(false);
                      }}
                      className={`p-3 border-b cursor-pointer transition ${
                        darkMode
                          ? "border-gray-800 hover:bg-gray-800"
                          : "border-gray-100 hover:bg-blue-50"
                      }`}
                    >
                      <p className="text-sm font-medium">💬 {n.title}</p>
                      <p className={`text-xs truncate ${mutedText}`}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/student/payment")}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 transition-all duration-300 text-white px-5 py-3 rounded-xl shadow-lg font-semibold"
          >
            <CreditCard size={18} />
            Pay Fees
          </button>

          <button
            onClick={() => navigate("/student/my-payments")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition-all duration-300 text-white px-5 py-3 rounded-xl shadow-lg font-semibold"
          >
            <ReceiptText size={18} />
            My Payments
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:scale-105 transition-all duration-300 text-white px-5 py-3 rounded-xl shadow-lg font-semibold"
          >
            <Plus size={18} />
            Complaint
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {summary.map(({ title, value, icon: Icon, color }) => (
          <div
            key={title}
            className={`p-5 rounded-2xl border shadow-lg ${color}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="text-3xl font-bold mt-2">{value}</p>
              </div>
              <Icon size={28} />
            </div>
          </div>
        ))}
      </div>

      {/* COMPLAINTS TABLE */}
      <div className={`rounded-2xl border shadow-lg p-5 ${cardClass}`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">My Complaints</h2>
            <p className={`text-sm ${mutedText}`}>
              Click any complaint row to open chat.
            </p>
          </div>
        </div>

        {mine.length === 0 ? (
          <div
            className={`text-center py-10 rounded-xl border ${
              darkMode
                ? "border-gray-800 text-gray-400"
                : "border-gray-200 text-gray-500"
            }`}
          >
            No complaints submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead
                className={
                  darkMode
                    ? "text-gray-300 border-b border-gray-800"
                    : "text-gray-700 border-b border-gray-200"
                }
              >
                <tr className="text-left">
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Attachment</th>
                  <th className="py-3 px-2">Chat</th>
                </tr>
              </thead>

              <tbody>
                {mine.map((r) => (
                  <tr
                    key={r._id}
                    onClick={() => {
                      setSelectedId(r._id);
                      setNotifications([]);
                    }}
                    className={`cursor-pointer border-b transition ${
                      darkMode
                        ? "border-gray-800 hover:bg-gray-800/70"
                        : "border-gray-100 hover:bg-blue-50"
                    }`}
                  >
                    <td className="py-3 px-2 font-medium">{r.title}</td>

                    <td className="py-3 px-2 capitalize">
                      {r.category || "-"}
                    </td>

                    <td className="py-3 px-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs capitalize ${statusBadge(
                          r.status,
                        )}`}
                      >
                        {r.status?.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3 px-2">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </td>

                    <td className="py-3 px-2">
                      {r.attachments?.length > 0 ? (
                        <div className="flex gap-2">
                          {r.attachments.slice(0, 2).map((file, i) => (
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
                                className="h-10 w-10 object-cover rounded-lg border border-gray-700 hover:scale-105 transition"
                              />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className={mutedText}>No file</span>
                      )}
                    </td>

                    <td className="py-3 px-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(r._id);
                        }}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        <MessageCircle size={14} />
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CHAT */}
      {selectedId && (
        <ChatBox
          key={selectedId}
          complaintId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* COMPLAINT MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
          <div
            className={`w-full max-w-md relative rounded-2xl p-4 shadow-2xl max-h-[92vh] overflow-hidden ${
              darkMode
                ? "bg-gray-900 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center z-10"
            >
              ×
            </button>

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
