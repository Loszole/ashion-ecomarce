import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { getAdminSummary, getAdminTraffic } from '../controllers/adminController.js';

const router = express.Router();

router.get('/summary', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), getAdminSummary);
router.get('/traffic', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), getAdminTraffic);

export default router;