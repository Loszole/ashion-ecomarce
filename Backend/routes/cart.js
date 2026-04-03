import express from 'express';
import { auth } from '../middleware/auth.js';
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';
import { validateObjectIdParam } from '../middleware/validate.js';

const router = express.Router();

router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.put('/:itemId', auth, validateObjectIdParam('itemId'), updateCartItem);
router.delete('/:itemId', auth, validateObjectIdParam('itemId'), removeCartItem);
router.delete('/', auth, clearCart);

export default router;
