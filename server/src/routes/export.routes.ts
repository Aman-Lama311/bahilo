import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import { exportPrintLogsCsv, exportStockCsv } from '../controllers/export.controller';

const router = Router();

router.use(verifyToken, scopeToSchool, requirePermission(PERMISSIONS.EXPORT_CSV));

router.get('/printlogs', exportPrintLogsCsv);
router.get('/stock', exportStockCsv);

export default router;