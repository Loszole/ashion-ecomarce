import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { closeMessage, createMessage, getMessages, replyMessage } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createMessage);
router.get('/', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), getMessages);
router.post('/:id/reply', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), replyMessage);
router.post('/:id/close', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), closeMessage);

export default router;
