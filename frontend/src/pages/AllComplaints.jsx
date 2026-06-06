import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import client from "../api/client.js";
import toast from "react-hot-toast";
import { Search, Users } from "lucide-react";

export default function AllComplaints() {
  const { darkMode } = useOutletContext();

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");

  const [showVoters, setShowVoters] = useState(false);
  const [selectedVoters, setSelectedVoters] = useState([]);

  const getImageUrl = (path) => {
    const base = import.meta.env.VITE_API_URL?.replace("/api", "") || "";
    return `${base}/${path}`;
  };

  const fetchComplaints = async () => {
    try {
      const { data } = await client.get("/complaints/all");
      setComplaints(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const voteComplaint = async (id) => {
    try {
      const { data } = await client.patch(`/complaints/${id}/vote`);
      toast.success(data.message || "Vote updated");
      fetchComplaints();
    } catch (err) {
      console.error(err);
      toast.error("Vote failed");
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const keyword = search.toLowerCase();

    return (
      c.title?.toLowerCase().includes(keyword) ||
      c.description?.toLowerCase().includes(keyword) ||
      c.category?.toLowerCase().includes(keyword) ||
      c.priority?.toLowerCase().includes(keyword) ||
      c.status?.toLowerCase().includes(keyword) ||
      c.student?.name?.toLowerCase().includes(keyword) ||
      c.student?.email?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div
      className={`min-h-screen p-6 ${
        darkMode
          ? "bg-gray-950 text-gray-100"
          : "bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Complaints</h1>
        <p className={darkMode ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
          Search existing complaints before creating a new one.
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />

        <input
          type="text"
          placeholder="Search by title, issue, category, status, student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-white border-gray-200 text-gray-900 shadow-sm"
          }`}
        />
      </div>

      {/* COUNT */}
      <div className="mb-4 text-sm">
        Showing{" "}
        <span className="font-semibold text-blue-500">
          {filteredComplaints.length}
        </span>{" "}
        complaints
      </div>

      {/* COMPLAINT LIST */}
      {filteredComplaints.length === 0 ? (
        <div
          className={`p-8 text-center rounded-2xl border ${
            darkMode
              ? "bg-gray-900 border-gray-800 text-gray-400"
              : "bg-white border-gray-200 text-gray-500"
          }`}
        >
          No matching complaint found. You can create a new complaint.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((c) => (
            <div
              key={c._id}
              className={`group p-5 rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1 ${
                darkMode
                  ? "bg-gray-900/80 border-gray-800 hover:border-purple-500/50"
                  : "bg-white border-gray-200 hover:border-purple-400 hover:shadow-purple-100"
              }`}
            >
              <div className="flex justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-bold text-lg group-hover:text-purple-500 transition">
                    {c.title}
                  </h2>

                  <p
                    className={
                      darkMode
                        ? "text-gray-400 text-sm mt-1"
                        : "text-gray-600 text-sm mt-1"
                    }
                  >
                    Raised by {c.student?.name || "Student"}
                  </p>
                </div>

                <span
                  className={`h-fit px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    c.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : c.status === "in_progress"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-green-500/20 text-green-500"
                  }`}
                >
                  {c.status?.replace("_", " ")}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 capitalize">
                  {c.category || "others"}
                </span>

                {c.priority && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs capitalize ${
                      c.priority === "high"
                        ? "bg-red-500/20 text-red-400"
                        : c.priority === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {c.priority} priority
                  </span>
                )}
              </div>

              <p
                className={`text-sm line-clamp-3 mb-5 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {c.description || "No description provided"}
              </p>

              {c.attachments?.length > 0 && (
                <div className="mt-4">
                  <p
                    className={
                      darkMode
                        ? "text-gray-400 text-xs mb-2"
                        : "text-gray-500 text-xs mb-2"
                    }
                  >
                    Attachments
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    {c.attachments.slice(0, 3).map((file, i) => (
                      <a
                        key={i}
                        href={getImageUrl(file.path)}
                        target="_blank"
                        rel="noopener noreferrer"
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
                <small className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  {new Date(c.createdAt).toLocaleDateString("en-IN")}
                </small>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => voteComplaint(c._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    👍 {c.votes || 0}
                  </button>

                  {c.votedBy?.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedVoters(c.votedBy);
                        setShowVoters(true);
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition ${
                        darkMode
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <Users size={14} />
                      Voters
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VOTERS MODAL */}
      {showVoters && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
          <div
            className={`w-full max-w-md rounded-2xl p-5 shadow-xl ${
              darkMode
                ? "bg-gray-900 text-gray-100 border border-gray-800"
                : "bg-white text-gray-900"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Voted Students</h2>

              <button
                onClick={() => setShowVoters(false)}
                className="text-red-400 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {selectedVoters.length === 0 ? (
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                No voters yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {selectedVoters.map((u) => (
                  <div
                    key={u._id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      darkMode ? "bg-gray-800" : "bg-gray-100"
                    }`}
                  >
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${
                        u.name || "User"
                      }`}
                      alt={u.name || "User"}
                      className="h-9 w-9 rounded-full border"
                    />

                    <div>
                      <p className="font-medium">{u.name || "User"}</p>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {u.email || "No email"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
