import { Router } from 'express';
import { getDashboardStats } from '../controllers/stats.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireAgentOrAdmin } from '../middlewares/role.middleware';

const router = Router();

router.get('/', verifyToken, requireAgentOrAdmin, getDashboardStats);

export default router;