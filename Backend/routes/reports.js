import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { getProductsReport, getSalesReport, getTrafficReport } from '../controllers/reportController.js';

const router = express.Router();

router.get('/sales', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), getSalesReport);
router.get('/traffic', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), getTrafficReport);
router.get('/products', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), getProductsReport);

export default router;
