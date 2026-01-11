import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createComplaint, myComplaints, getStats } from '../controllers/complaint.controller.js';

const router = Router();
router.post('/', verifyToken, upload.array('attachments', 5), createComplaint);
router.get('/mine', verifyToken, myComplaints);
router.get('/stats', verifyToken, getStats);
export default router;
