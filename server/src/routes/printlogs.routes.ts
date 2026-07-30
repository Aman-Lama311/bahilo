import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import { createPrintLog, listPrintLogs } from '../controllers/printlogs.controller';

const router = Router();

router.use(verifyToken, scopeToSchool);

router.post('/', requirePermission(PERMISSIONS.CREATE_PRINTLOG), createPrintLog);
router.get('/', requirePermission(PERMISSIONS.VIEW_PRINTLOGS), listPrintLogs);

export default router;