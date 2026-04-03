import express from 'express';
import { auth, authOptional, authorizeRoles } from '../middleware/auth.js';
import { validateObjectIdParam, validateOrderPayload, validateOrderStatusPayload } from '../middleware/validate.js';
import {
  createOrder,
  checkoutFromCart,
  getMyOrders,
  getOrders,
  getOrder,
  trackOrder,
  updateOrder,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Order routes
router.get('/my', auth, getMyOrders);
router.post('/track', trackOrder);
router.post('/checkout', auth, checkoutFromCart);
router.get('/list', auth, authorizeRoles('admin', 'superadmin', 'support', 'editor'), getOrders);
router.get('/:id', auth, authorizeRoles('admin', 'superadmin', 'support', 'editor'), validateObjectIdParam('id'), getOrder);
router.post('/', authOptional, validateOrderPayload, createOrder);
router.put('/:id', auth, authorizeRoles('admin', 'superadmin', 'support', 'editor'), validateObjectIdParam('id'), validateOrderStatusPayload, updateOrder);
router.delete('/:id', auth, authorizeRoles('admin', 'superadmin'), validateObjectIdParam('id'), deleteOrder);

export default router;
