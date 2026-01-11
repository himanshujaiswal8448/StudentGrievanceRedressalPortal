import Complaint from '../models/Complaint.js';

export const createComplaint = async (req, res) => {
  try {
    const attachments = (req.files || []).map(f => ({ filename: f.filename, path: f.path, mimetype: f.mimetype, size: f.size }));
    const complaint = await Complaint.create({
      student: req.user.id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority || 'medium',
      department: req.body.department,
      attachments,
      history: [{ status: 'pending', remark: 'Submitted', changedBy: req.user.id }]
    });
    res.status(201).json(complaint);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const myComplaints = async (req, res) => {
  try {
    const list = await Complaint.find({ student: req.user.id }).sort('-createdAt');
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const byStatus = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const perMonth = await Complaint.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);
    res.json({ byStatus, byCategory, perMonth });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
