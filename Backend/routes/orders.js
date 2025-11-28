import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Order routes
router.get('/', auth, authorizeRoles('admin', 'superadmin', 'support'), getOrders);
router.get('/:id', auth, authorizeRoles('admin', 'superadmin', 'support'), getOrder);
router.post('/', auth, createOrder);
router.put('/:id', auth, authorizeRoles('admin', 'superadmin', 'support'), updateOrder);
router.delete('/:id', auth, authorizeRoles('admin', 'superadmin'), deleteOrder);

export default router;
