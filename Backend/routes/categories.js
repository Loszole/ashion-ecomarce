import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { validateCategoryPayload, validateObjectIdParam } from '../middleware/validate.js';
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
router.get('/:id', validateObjectIdParam('id'), getCategory);
router.post('/', auth, authorizeRoles('admin', 'superadmin', 'editor'), validateCategoryPayload, createCategory);
router.put('/:id', auth, authorizeRoles('admin', 'superadmin', 'editor'), validateObjectIdParam('id'), validateCategoryPayload, updateCategory);
router.delete('/:id', auth, authorizeRoles('admin', 'superadmin'), validateObjectIdParam('id'), deleteCategory);

export default router;
