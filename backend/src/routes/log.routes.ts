import { Router } from 'express';
import { getSystemLogs } from '../controllers/log.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

router.get('/', verifyToken, requireAdmin, getSystemLogs);

export default router;