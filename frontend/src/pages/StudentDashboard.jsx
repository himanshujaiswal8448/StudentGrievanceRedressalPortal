import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import client from "../api/client.js";
import ComplaintForm from "./ComplaintForm.jsx";
import ChatBox from "../components/ChatBox.jsx";
import socket from "../socket";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const { darkMode } = useOutletContext();

  const [mine, setMine] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ fetch complaints
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

  // ✅ JOIN ROOMS
  useEffect(() => {
    if (!mine.length) return;

    mine.forEach((c) => socket.emit("joinRoom", c._id));

    return () => {
      mine.forEach((c) => socket.emit("leaveRoom", c._id));
    };
  }, [mine]);

  // ✅ SOCKET LISTENER
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

      // avoid duplicate
      setNotifications((prev) => {
        const exists = prev.find((n) => n.complaintId === msg.complaintId);
        if (exists) return prev;
        return [newNotification, ...prev];
      });

      // toast
      toast.custom((t) => (
        <div
          onClick={() => {
            setSelectedId(msg.complaintId);
            setNotifications((prev) =>
              prev.filter((n) => n.complaintId !== msg.complaintId),
            );
            toast.dismiss(t.id);
          }}
          className="cursor-pointer bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg border border-gray-700"
        >
          <p className="font-semibold">💬 {newNotification.title}</p>
          <p className="text-xs text-gray-400 truncate">
            {newNotification.message}
          </p>
        </div>
      ));
    };

    socket.off("receiveMessage");
    socket.on("receiveMessage", handler);

    return () => socket.off("receiveMessage", handler);
  }, [mine]);

  // stats
  const resolved = mine.filter((m) => m.status === "resolved").length;
  const pending = mine.filter((m) => m.status === "pending").length;
  const inProgress = mine.filter((m) => m.status === "in_progress").length;

  const summary = [
    { title: "Total", value: mine.length, color: "bg-gray-800 text-white" },
    {
      title: "Pending",
      value: pending,
      color: "bg-yellow-500/20 text-yellow-400",
    },
    {
      title: "In Progress",
      value: inProgress,
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      title: "Resolved",
      value: resolved,
      color: "bg-green-500/20 text-green-400",
    },
  ];

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>

        <div className="flex items-center gap-4">
          {/* 🔔 BELL */}
          <div className="relative">
            <div
              onClick={() => setShowDropdown((p) => !p)}
              className="cursor-pointer"
            >
              🔔
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                  {notifications.length}
                </span>
              )}
            </div>

            {/* 🔽 DROPDOWN */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50">
                <div className="p-3 border-b border-gray-700 text-sm font-semibold">
                  Notifications
                </div>

                {notifications.length === 0 ? (
                  <p className="p-3 text-gray-400 text-sm">No new messages</p>
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
                      className="p-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer"
                    >
                      <p className="text-sm font-medium">💬 {n.title}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            + Complaint
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summary.map((c) => (
          <div key={c.title} className={`p-4 rounded-xl ${c.color}`}>
            <h3>{c.title}</h3>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
        <h2 className="mb-3 font-semibold">My Complaints</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
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
                className="cursor-pointer border-b hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="py-2">{r.title}</td>
                <td>{r.category}</td>
                <td>{r.status}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CHAT */}
      {selectedId && (
        <ChatBox
          key={selectedId}
          complaintId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-900 p-5 rounded-xl w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-xl"
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
