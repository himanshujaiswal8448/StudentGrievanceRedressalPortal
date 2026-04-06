import express from "express";
import ChatMessage from "../models/ChatMessage.js";

const router = express.Router();

// GET messages of a complaint
router.get("/:complaintId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      complaintId: req.params.complaintId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

export default router;