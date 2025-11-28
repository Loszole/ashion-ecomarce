import express from 'express';
import multer from 'multer';
import { auth, authorizeRoles } from '../middleware/auth.js';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Product routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', auth, authorizeRoles('admin', 'superadmin', 'editor'), upload.array('images', 5), createProduct);
router.put('/:id', auth, authorizeRoles('admin', 'superadmin', 'editor'), upload.array('images', 5), updateProduct);
router.delete('/:id', auth, authorizeRoles('admin', 'superadmin'), deleteProduct);

export default router;
