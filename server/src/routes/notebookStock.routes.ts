import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import {
  addNotebookStock,
  getCurrentNotebookStock,
  listNotebookStockEntries
} from '../controllers/notebookStock.controller';

const router = Router();

router.use(verifyToken, scopeToSchool);

router.post('/add', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_STOCK), addNotebookStock);
router.get('/current', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_STOCK), getCurrentNotebookStock);
router.get('/entries', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_STOCK), listNotebookStockEntries);

export default router;