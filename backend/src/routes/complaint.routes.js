import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import Complaint from "../models/Complaint.js";
import {
  createComplaint,
  myComplaints,
  getStats,
} from "../controllers/complaint.controller.js";

const router = Router();
router.post("/", verifyToken, upload.array("attachments", 5), createComplaint);
router.get("/mine", verifyToken, myComplaints);
router.get("/stats", verifyToken, getStats);

router.patch("/:id/vote", verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Not found" });
    }

    complaint.votes += 1;
    await complaint.save();

    res.json({ votes: complaint.votes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

export default router;
