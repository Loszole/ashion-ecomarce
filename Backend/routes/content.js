import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { createContent, deleteContent, getContent, updateContent } from '../controllers/contentController.js';

const router = express.Router();

router.get('/', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), getContent);
router.post('/', auth, authorizeRoles('admin', 'superadmin', 'editor'), createContent);
router.put('/:id', auth, authorizeRoles('admin', 'superadmin', 'editor'), updateContent);
router.delete('/:id', auth, authorizeRoles('admin', 'superadmin'), deleteContent);

export default router;
