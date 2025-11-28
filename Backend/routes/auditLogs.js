import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { getAuditLogs } from '../controllers/auditLogController.js';

const router = express.Router();

// Audit log routes
router.get('/', auth, authorizeRoles('admin', 'superadmin'), getAuditLogs);

export default router;
