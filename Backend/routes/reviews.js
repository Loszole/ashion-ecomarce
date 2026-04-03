import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { getReviews, updateReview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), getReviews);
router.put('/:id', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), updateReview);
router.delete('/:id', auth, authorizeRoles('admin', 'superadmin', 'editor'), deleteReview);

export default router;
