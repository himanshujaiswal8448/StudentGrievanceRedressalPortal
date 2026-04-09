import Complaint from "../models/Complaint.js";
import { sendEmail } from "../services/mailService.js";

/* =========================
   LIST COMPLAINTS (ADMIN)
   + SEARCH + FILTER
========================= */
export const listComplaints = async (req, res) => {
  try {
    const { status, category, from, to, search } = req.query;

    let query = {};

    // filters
    if (status) query.status = status;
    if (category) query.category = category;

    // date filter
    if (from || to) {
      query.createdAt = {
        ...(from && { $gte: new Date(from) }),
        ...(to && { $lte: new Date(to) }),
      };
    }

    let complaints;

    // 🔥 SEARCH WITH STUDENT NAME + EMAIL
    if (search && search.trim() !== "") {
      complaints = await Complaint.find(query)
        .populate("student", "name email")
        .sort("-createdAt");

      // 👉 frontend type filtering (important trick)
      complaints = complaints.filter((c) => {
        const s = search.toLowerCase();

        return (
          c.title.toLowerCase().includes(s) ||
          c.category.toLowerCase().includes(s) ||
          c.student?.name?.toLowerCase().includes(s) ||
          c.student?.email?.toLowerCase().includes(s)
        );
      });
    } else {
      complaints = await Complaint.find(query)
        .populate("student", "name email")
        .sort({ votes: -1, createdAt: -1 });
    }

    res.status(200).json(complaints);
  } catch (error) {
    console.error("❌ LIST COMPLAINT ERROR:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

/* =========================
   UPDATE COMPLAINT STATUS
   + EMAIL NOTIFICATION
========================= */
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    // ✅ validate
    if (!["pending", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await Complaint.findById(id).populate(
      "student",
      "name email",
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // ✅ update
    complaint.status = status;

    complaint.history.push({
      status,
      remark,
      changedBy: req.user.id,
      changedAt: new Date(),
    });

    await complaint.save();

    // ✅ email
    if (complaint.student?.email) {
      await sendEmail({
        to: complaint.student.email,
        subject: "Complaint Status Updated",
        html: `
          <div style="font-family: Arial;">
            <h2 style="color:#2563eb">Grievance Portal</h2>

            <p>Hello <b>${complaint.student.name}</b>,</p>

            <p>Your complaint:</p>
            <b>${complaint.title}</b>

            <p>Status:</p>
            <h3>${status.replace("_", " ").toUpperCase()}</h3>

            ${remark ? `<p><b>Remark:</b> ${remark}</p>` : ""}

            <br/>
            <p>Thanks</p>
          </div>
        `,
      });
    }

    res.status(200).json({
      message: "Updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("❌ UPDATE ERROR:", error);
    res.status(500).json({ message: "Failed to update complaint status" });
  }
};
