import { Router } from 'express';
import { getSitemap } from '../controllers/seo.controller';

const router = Router();

// Public access: Google Bot đọc sitemap
router.get('/sitemap.xml', getSitemap);

export default router;