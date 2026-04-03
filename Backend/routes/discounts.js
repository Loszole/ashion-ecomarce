import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { createDiscount, deleteDiscount, getDiscounts, updateDiscount } from '../controllers/discountController.js';

const router = express.Router();

router.get('/', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), getDiscounts);
router.post('/', auth, authorizeRoles('admin', 'superadmin', 'editor'), createDiscount);
router.put('/:id', auth, authorizeRoles('admin', 'superadmin', 'editor'), updateDiscount);
router.delete('/:id', auth, authorizeRoles('admin', 'superadmin'), deleteDiscount);

export default router;
