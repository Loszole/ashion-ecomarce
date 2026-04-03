import express from 'express';
import { auth, authorizeRoles } from '../middleware/auth.js';
import { getPaymentOptions, getSettingsSection, saveSettingsSection } from '../controllers/settingsController.js';

const router = express.Router();

router.get('/payment-options', getPaymentOptions);
router.get('/:section', getSettingsSection);
router.post('/:section', auth, authorizeRoles('admin', 'superadmin'), saveSettingsSection);

export default router;
