import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import { resendMonthlyReport } from '../controllers/email.controller';

const router = Router();

router.use(verifyToken, scopeToSchool, requirePermission(PERMISSIONS.MANAGE_EMAIL_SETTINGS));

router.post('/resend', resendMonthlyReport);

export default router;