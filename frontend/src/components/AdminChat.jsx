import { useEffect, useState, useRef } from "react";
import client from "../api/client";
import socket from "../socket";

export default function AdminChat({ complaintId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // ✅ JOIN / LEAVE ROOM (FIXED)
  useEffect(() => {
    if (!complaintId) return;

    socket.emit("joinRoom", complaintId);

    return () => {
      socket.emit("leaveRoom", complaintId);
    };
  }, [complaintId]);

  // ✅ FETCH OLD MESSAGES
  useEffect(() => {
    if (!complaintId) return;

    client.get(`/chat/${complaintId}`).then((res) => {
      setMessages(Array.isArray(res.data) ? res.data : []);
    });
  }, [complaintId]);

  // ✅ REALTIME RECEIVE (FILTERED)
  useEffect(() => {
    const handler = (msg) => {
      if (msg.complaintId === complaintId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handler);

    return () => {
      socket.off("receiveMessage", handler);
    };
  }, [complaintId]);

  // ✅ AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ SEND MESSAGE
  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      complaintId,
      message: text,
      sender: "admin",
    });

    setText("");
  };

  return (
    <div className="fixed bottom-5 right-5 w-[380px] h-[520px] bg-gray-950 text-white rounded-2xl shadow-2xl border border-gray-800 flex flex-col overflow-hidden z-50">
      {/* HEADER */}
      <div className="px-4 py-3 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-sm">Admin Support 🛠️</h2>
          <p className="text-xs text-gray-400">
            Complaint #{complaintId?.slice(-5)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-400 text-lg"
        >
          ✕
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => {
          const isAdmin = m.sender === "admin";

          return (
            <div
              key={i}
              className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col max-w-[75%]">
                {/* sender */}
                <span className="text-[10px] text-gray-400 mb-1">
                  {isAdmin ? "You (Admin)" : "User"}
                </span>

                {/* message bubble */}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm shadow ${
                    isAdmin
                      ? "bg-green-600 rounded-br-none"
                      : "bg-gray-800 rounded-bl-none"
                  }`}
                >
                  {m.message}
                </div>

                {/* time */}
                <span className="text-[10px] text-gray-500 mt-1 text-right">
                  {new Date(m.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-gray-800 flex gap-2 bg-gray-900">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Reply to user..."
          className="flex-1 px-3 py-2 bg-gray-800 rounded-lg outline-none text-sm"
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 px-4 rounded-lg text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
