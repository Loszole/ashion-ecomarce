import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// Category routes
router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', auth, authorizeRoles('admin', 'superadmin', 'editor'), createCategory);
router.put('/:id', auth, authorizeRoles('admin', 'superadmin', 'editor'), updateCategory);
router.delete('/:id', auth, authorizeRoles('admin', 'superadmin'), deleteCategory);

export default router;
