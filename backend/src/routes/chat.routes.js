import express from "express";
import ChatMessage from "../models/ChatMessage.js";

const router = express.Router();

router.get("/:complaintId", async (req, res) => {
  const messages = await ChatMessage.find({
    complaintId: req.params.complaintId,
  }).sort({ createdAt: 1 });

  res.json(messages); // ✅ array return hona chahiye
});

export default router;
