import { Router } from 'express';
import { register, login, logout, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Public access
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Require Authentication
router.post('/logout', verifyToken, logout);

// Cần Token (Được cấp trong URL khi user click vào link email reset password)
router.post('/reset-password', verifyToken, resetPassword);

export default router;