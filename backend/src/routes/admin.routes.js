import { Router } from 'express';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { listComplaints, updateStatus } from '../controllers/admin.controller.js';

const router = Router();
router.use(verifyToken, requireRole('admin', 'superAdmin'));
router.get('/complaints', listComplaints);
router.patch('/complaints/:id/status', updateStatus);
export default router;
