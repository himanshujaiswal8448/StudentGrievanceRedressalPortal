import { useEffect, useState } from "react";
import socket from "../socket";
import client from "../api/client";

export default function ChatBox({ complaintId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", complaintId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
    client.get(`/chat/${complaintId}`).then((res) => {
      setMessages(res.data);
    });
  }, []);

  const sendMessage = () => {
    const msg = { complaintId, message: input };
    socket.emit("sendMessage", msg);
    setInput("");
  };

  return (
    <div>
      <div className="h-60 overflow-y-auto border p-2">
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.sender}:</b> {m.message}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2"
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
