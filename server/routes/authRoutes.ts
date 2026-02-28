import express from 'express';
import { register, login, refreshToken, logout, changePassword } from '../controllers/authController.js';
import { isAuthenticated } from '../replit_integrations/auth/index.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/change-password', isAuthenticated, changePassword);

export default router;
