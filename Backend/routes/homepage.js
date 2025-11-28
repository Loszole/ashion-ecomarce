import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { getHomepageLayout, updateHomepageLayout } from '../controllers/homepageController.js';

const router = express.Router();

// Homepage layout routes
router.get('/', getHomepageLayout);
router.put('/', auth, authorizeRoles('admin', 'superadmin', 'editor'), updateHomepageLayout);

export default router;
