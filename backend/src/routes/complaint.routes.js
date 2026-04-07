import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  createComplaint,
  myComplaints,
  getStats,
} from "../controllers/complaint.controller.js";

const router = Router();
router.post("/", verifyToken, upload.array("attachments", 5), createComplaint);
router.get("/mine", verifyToken, myComplaints);
router.get("/stats", verifyToken, getStats);

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
