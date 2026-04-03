import express from 'express';
import multer from 'multer';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { getAppearance, saveColors, uploadBanner } from '../controllers/appearanceController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, 'uploads/'),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', auth, authorizeRoles('admin', 'superadmin', 'editor', 'support'), getAppearance);
router.post('/banner', auth, authorizeRoles('admin', 'superadmin', 'editor'), upload.single('banner'), uploadBanner);
router.post('/colors', auth, authorizeRoles('admin', 'superadmin', 'editor'), saveColors);

export default router;
