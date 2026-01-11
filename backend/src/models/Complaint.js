import mongoose from 'mongoose';

const AttachmentSchema = new mongoose.Schema(
  { filename: String, path: String, mimetype: String, size: Number },
  { _id: false }
);

const ComplaintSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['hostel', 'exam', 'academics', 'administration', 'library', 'others'], required: true },
    status: { type: String, enum: ['pending', 'in_progress', 'resolved'], default: 'pending' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    department: { type: String },
    attachments: [AttachmentSchema],
    history: [
      {
        status: { type: String, enum: ['pending', 'in_progress', 'resolved'] },
        remark: String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', ComplaintSchema);
