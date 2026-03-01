import express from 'express';
import { register, login, refreshToken, logout, changePassword, getMe } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/user', isAuthenticated, getMe);
router.post('/change-password', isAuthenticated, changePassword);

export default router;
