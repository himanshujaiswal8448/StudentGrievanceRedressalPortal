import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import Complaint from "../models/Complaint.js";

import {
  createComplaint,
  myComplaints,
  getStats,
  allComplaints,
} from "../controllers/complaint.controller.js";

const router = Router();

router.post("/", verifyToken, upload.array("attachments", 5), createComplaint);

router.get("/mine", verifyToken, myComplaints);

router.get("/all", verifyToken, allComplaints);

router.get("/stats", verifyToken, getStats);

router.patch("/:id/vote", verifyToken, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const userId = req.user.id;

    const alreadyVoted = complaint.votedBy.some(
      (id) => id.toString() === userId,
    );

    if (alreadyVoted) {
      complaint.votedBy = complaint.votedBy.filter(
        (id) => id.toString() !== userId,
      );
      complaint.votes = Math.max(0, complaint.votes - 1);
    } else {
      complaint.votedBy.push(userId);
      complaint.votes += 1;
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(req.params.id).populate(
      "votedBy",
      "name email",
    );

    res.json({
      votes: updatedComplaint.votes,
      votedBy: updatedComplaint.votedBy,
      voted: !alreadyVoted,
      message: alreadyVoted ? "Vote removed" : "Vote added",
    });
  } catch (err) {
    console.error("❌ VOTE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
