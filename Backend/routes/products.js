import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { validateObjectIdParam, validateProductPayload } from '../middleware/validate.js';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '..', 'uploads');

const ensureUploadDir = () => {
  fs.mkdirSync(uploadDir, { recursive: true });
};

const sanitizeFilename = (name) => {
  const base = path.basename(name || 'file');
  return base.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
};

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${sanitizeFilename(file.originalname)}`);
  }
});
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error('Only jpeg, png, and webp images are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Product routes
router.get('/', getProducts);
router.get('/:id', validateObjectIdParam('id'), getProduct);
router.post('/', auth, authorizeRoles('admin', 'superadmin', 'editor'), upload.array('images', 5), validateProductPayload, createProduct);
router.put('/:id', auth, authorizeRoles('admin', 'superadmin', 'editor'), validateObjectIdParam('id'), upload.array('images', 5), validateProductPayload, updateProduct);
router.delete('/:id', auth, authorizeRoles('admin', 'superadmin'), validateObjectIdParam('id'), deleteProduct);

export default router;
