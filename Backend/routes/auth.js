import express from 'express';
import { register, login, refresh, logout } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { validateLogin, validateRefresh, validateRegister } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);
router.post('/refresh', validateRefresh, refresh);
router.post('/logout', logout);

export default router;
