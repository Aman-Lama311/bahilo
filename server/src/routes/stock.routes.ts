import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import { addStock, getCurrentStock, listStockEntries } from '../controllers/stock.controller';

const router = Router();

router.use(verifyToken, scopeToSchool);

router.post('/add', requirePermission(PERMISSIONS.MANAGE_STOCK), addStock);
router.get('/current', requirePermission(PERMISSIONS.MANAGE_STOCK), getCurrentStock);
router.get('/entries', requirePermission(PERMISSIONS.MANAGE_STOCK), listStockEntries);

export default router;