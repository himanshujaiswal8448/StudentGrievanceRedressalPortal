import Complaint from "../models/Complaint.js";

// 🔥 AI CLASSIFICATION FUNCTION
function classifyComplaint(text) {
  const msg = text.toLowerCase();

  let category = "other";
  let priority = "low";

  // category detection
  if (msg.includes("wifi") || msg.includes("internet")) {
    category = "technical";
  } else if (msg.includes("fee") || msg.includes("payment")) {
    category = "financial";
  } else if (msg.includes("teacher") || msg.includes("faculty")) {
    category = "academic";
  } else if (msg.includes("hostel") || msg.includes("room")) {
    category = "hostel";
  }

  // priority detection
  if (
    msg.includes("urgent") ||
    msg.includes("immediately") ||
    msg.includes("asap")
  ) {
    priority = "high";
  } else if (msg.includes("delay") || msg.includes("slow")) {
    priority = "medium";
  }

  return { category, priority };
}

// ✅ CREATE COMPLAINT (UPDATED WITH AI)
export const createComplaint = async (req, res) => {
  try {
    const attachments = (req.files || []).map((f) => ({
      filename: f.filename,
      path: f.path,
      mimetype: f.mimetype,
      size: f.size,
    }));

    // 🔥 AI APPLY
    const ai = classifyComplaint(req.body.description || "");

    const complaint = await Complaint.create({
      student: req.user.id,
      title: req.body.title,
      description: req.body.description,

      // 🔥 AI override
      category: ai.category,
      priority: ai.priority,

      department: req.body.department,
      attachments,
      history: [
        { status: "pending", remark: "Submitted", changedBy: req.user.id },
      ],
    });

    res.status(201).json(complaint);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// =========================

export const myComplaints = async (req, res) => {
  try {
    const list = await Complaint.find({ student: req.user.id }).sort(
      "-createdAt",
    );
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// =========================

export const getStats = async (req, res) => {
  try {
    const byStatus = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const byCategory = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const perMonth = await Complaint.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json({ byStatus, byCategory, perMonth });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
