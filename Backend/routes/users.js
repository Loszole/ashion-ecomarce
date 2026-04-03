import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { getUsers } from '../controllers/usersController.js';

const router = express.Router();

router.get('/', auth, authorizeRoles('admin', 'superadmin', 'editor'), getUsers);

export default router;
