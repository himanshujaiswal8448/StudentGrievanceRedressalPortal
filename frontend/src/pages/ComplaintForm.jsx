import React, { useState } from "react";
import client from "../api/client.js";
import toast from "react-hot-toast";
import {
  FileText,
  Upload,
  AlertCircle,
  Building2,
  Tag,
  Flag,
  X,
} from "lucide-react";

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

  const inputClass = `w-full border rounded-xl px-3 py-2 outline-none transition focus:ring-2 focus:ring-blue-500 ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
  }`;

  const labelClass = `flex items-center gap-2 text-sm font-medium mb-2 ${
    darkMode ? "text-gray-300" : "text-gray-700"
  }`;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      toast.error("You can upload maximum 5 files");
      return;
    }

    setFiles(selectedFiles);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      category: "academics",
      priority: "medium",
      department: "",
    });
    setFiles([]);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      return toast.error("Please enter complaint title");
    }

    if (!form.description.trim()) {
      return toast.error("Please describe your issue");
    }

    setLoading(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });

      files.forEach((file) => {
        fd.append("attachments", file);
      });

      await client.post("/complaints", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Complaint submitted successfully!");

      resetForm();

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error submitting complaint:", err);
      toast.error(err?.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className={`grid gap-3 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
    >
      {/* HEADER */}
      <div
        className={`rounded-xl p-3 border ${
          darkMode
            ? "bg-gray-800/60 border-gray-700"
            : "bg-blue-50 border-blue-100"
        }`}
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertCircle size={20} className="text-blue-500" />
          Complaint Details
        </h3>

        <p
          className={`text-sm mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Provide clear details so the admin can resolve your issue faster.
        </p>
      </div>

      {/* TITLE */}
      <div>
        <label className={labelClass}>
          <FileText size={16} />
          Title
        </label>

        <input
          type="text"
          name="title"
          className={inputClass}
          placeholder="Example: Delay in exam result"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className={labelClass}>
          <FileText size={16} />
          Description
        </label>

        <textarea
          name="description"
          rows="2"
          className={inputClass}
          placeholder="Explain your issue in detail..."
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* CATEGORY & PRIORITY */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            <Tag size={16} />
            Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            {[
              "academics",
              "exam",
              "hostel",
              "administration",
              "library",
              "technical",
              "financial",
              "others",
            ].map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>
            <Flag size={16} />
            Priority
          </label>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={inputClass}
          >
            {["low", "medium", "high"].map((priority) => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DEPARTMENT */}
      <div>
        <label className={labelClass}>
          <Building2 size={16} />
          Department
          <span className="text-xs opacity-60">(optional)</span>
        </label>

        <input
          type="text"
          name="department"
          placeholder="Example: Examination Department"
          className={inputClass}
          value={form.department}
          onChange={handleChange}
        />
      </div>

      {/* FILE UPLOAD */}
      <div>
        <label className={labelClass}>
          <Upload size={16} />
          Attachments
          <span className="text-xs opacity-60">(optional, max 5 files)</span>
        </label>

        <label
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-3 cursor-pointer transition ${
            darkMode
              ? "border-gray-700 bg-gray-800/50 hover:bg-gray-800"
              : "border-gray-300 bg-gray-50 hover:bg-blue-50"
          }`}
        >
          <Upload size={20} className="text-blue-500" />

          <span className="font-medium">Click to upload files</span>

          <span
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Images or documents can be attached
          </span>

          <input
            type="file"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </label>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {files.map((file, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full ${
                  darkMode
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <span className="max-w-[180px] truncate">📎 {file.name}</span>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-3 rounded-xl text-white font-semibold shadow-lg transition ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"
          }`}
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>

        <button
          type="button"
          onClick={resetForm}
          disabled={loading}
          className={`px-5 py-2 rounded-xl font-medium border transition ${
            darkMode
              ? "border-gray-700 hover:bg-gray-800 text-gray-200"
              : "border-gray-300 hover:bg-gray-100 text-gray-700"
          }`}
        >
          Clear
        </button>
      </div>
    </form>
  );
}
