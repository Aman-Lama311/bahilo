import { Router } from 'express';
import { verifyToken, requirePlatformOwner } from '../middleware/auth';
import { createSchool, listSchools, updateSchool } from '../controllers/platform.controller';

const router = Router();

router.use(verifyToken, requirePlatformOwner);

router.post('/schools', createSchool);
router.get('/schools', listSchools);
router.put('/schools/:id', updateSchool);

export default router;