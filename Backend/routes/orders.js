import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { validateObjectIdParam, validateOrderPayload, validateOrderStatusPayload } from '../middleware/validate.js';
import {
  createOrder,
  checkoutFromCart,
  getOrders,
  getOrder,
  trackOrder,
  updateOrder,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Order routes
router.get('/', auth, authorizeRoles('admin', 'superadmin', 'support'), getOrders);
router.post('/track', trackOrder);
router.post('/checkout', auth, checkoutFromCart);
router.get('/:id', auth, authorizeRoles('admin', 'superadmin', 'support'), validateObjectIdParam('id'), getOrder);
router.post('/', auth, validateOrderPayload, createOrder);
router.put('/:id', auth, authorizeRoles('admin', 'superadmin', 'support'), validateObjectIdParam('id'), validateOrderStatusPayload, updateOrder);
router.delete('/:id', auth, authorizeRoles('admin', 'superadmin'), validateObjectIdParam('id'), deleteOrder);

export default router;
