import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
    sender: String, // student/admin
    message: String,
  },
  { timestamps: true },
);

export default mongoose.model("ChatMessage", chatSchema);
