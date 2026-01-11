import Complaint from "../models/Complaint.js";
import { sendEmail } from "../services/mailService.js";

/* =========================
   LIST COMPLAINTS (ADMIN)
========================= */
export const listComplaints = async (req, res) => {
  try {
    const { status, category, from, to } = req.query;

    const q = {};

    if (status) q.status = status;
    if (category) q.category = category;

    if (from || to) {
      q.createdAt = {
        ...(from && { $gte: new Date(from) }),
        ...(to && { $lte: new Date(to) }),
      };
    }

    const complaints = await Complaint.find(q)
      .populate("student", "name email")
      .sort("-createdAt");

    res.status(200).json(complaints);
  } catch (error) {
    console.error("❌ LIST COMPLAINT ERROR:", error);
    res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

/* =========================
   UPDATE COMPLAINT STATUS
   + SEND EMAIL TO STUDENT
========================= */
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    // Validate status
    if (!["pending", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await Complaint.findById(id).populate(
      "student",
      "name email"
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    /* ===== Update complaint ===== */
    complaint.status = status;

    complaint.history.push({
      status,
      remark,
      changedBy: req.user.id, // admin id from auth middleware
      changedAt: new Date(),
    });

    await complaint.save();

    /* =========================
       EMAIL NOTIFICATION
    ========================= */
    if (complaint.student?.email) {
      await sendEmail({
        to: complaint.student.email,
        subject: "Complaint Status Updated",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2 style="color:#2563eb">Student Grievance Redressal Portal</h2>

            <p>Hello <b>${complaint.student.name}</b>,</p>

            <p>Your complaint titled:</p>
            <p style="font-weight:bold;">"${complaint.title}"</p>

            <p>Status has been updated to:</p>

            <h3 style="color:${
              status === "resolved"
                ? "#16a34a"
                : status === "in_progress"
                ? "#2563eb"
                : "#f59e0b"
            }">
              ${status.replace("_", " ").toUpperCase()}
            </h3>

            ${remark ? `<p><b>Admin Remark:</b><br/>${remark}</p>` : ""}

            <br/>
            <p>
              Thank you for using the Student Grievance Redressal Portal.
            </p>

            <p style="margin-top:20px;">
              — <b>Admin Team</b>
            </p>
          </div>
        `,
      });
    }

    res.status(200).json({
      message: "Complaint status updated and email sent",
      complaint,
    });
  } catch (error) {
    console.error("❌ UPDATE STATUS ERROR:", error);
    res.status(500).json({ message: "Failed to update complaint status" });
  }
};
