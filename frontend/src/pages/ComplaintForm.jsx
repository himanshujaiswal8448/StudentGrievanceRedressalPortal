import React, { useState } from "react";
import client from "../api/client.js";
import toast from "react-hot-toast";

export default function ComplaintForm({ onSuccess, darkMode = false }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "academics",
    priority: "medium",
    department: "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      Array.from(files).forEach((f) => fd.append("attachments", f));

      await client.post("/complaints", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Complaint submitted successfully!");
      setForm({
        title: "",
        description: "",
        category: "academics",
        priority: "medium",
        department: "",
      });
      setFiles([]);
      if (onSuccess) onSuccess(); // ✅ Notify parent
    } catch (err) {
      console.error("Error submitting complaint:", err);
      toast.error("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className={`grid gap-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
    >
      {/* ===== Title ===== */}
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input
          type="text"
          name="title"
          className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-100"
              : "bg-white border-gray-300"
          }`}
          placeholder="Enter complaint title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* ===== Description ===== */}
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          name="description"
          rows="4"
          className={`w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-100"
              : "bg-white border-gray-300"
          }`}
          placeholder="Describe your issue in detail"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* ===== Category & Priority ===== */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full border rounded-lg p-2.5 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-100"
                : "bg-white border-gray-300"
            }`}
          >
            {[
              "academics",
              "exam",
              "hostel",
              "administration",
              "library",
              "others",
            ].map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={`w-full border rounded-lg p-2.5 ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-100"
                : "bg-white border-gray-300"
            }`}
          >
            {["low", "medium", "high"].map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== Department ===== */}
      <div>
        <label className="block text-sm mb-1">Department (optional)</label>
        <input
          type="text"
          name="department"
          placeholder="Enter department name"
          className={`w-full border rounded-lg p-2.5 ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-100"
              : "bg-white border-gray-300"
          }`}
          value={form.department}
          onChange={handleChange}
        />
      </div>

      {/* ===== File Upload ===== */}
      <div>
        <label className="block text-sm mb-1">
          Upload Attachments (optional)
        </label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className={`w-full border rounded-lg p-2.5 ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-100"
              : "bg-white border-gray-300"
          }`}
        />
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.from(files).map((file, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-1 rounded-full ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                📎 {file.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ===== Submit Button ===== */}
      <button
        disabled={loading}
        className={`py-2.5 rounded-lg text-white font-medium ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } transition`}
      >
        {loading ? "Submitting..." : "Submit Complaint"}
      </button>
    </form>
  );
}
