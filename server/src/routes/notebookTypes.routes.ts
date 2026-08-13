import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import {
  createNotebookType,
  bulkCreateNotebookTypes,
  listNotebookTypes,
  bulkUpdateNotebookTypes,
  updateNotebookType,
  deleteNotebookType
} from '../controllers/notebookTypes.controller';

const router = Router();

router.use(verifyToken, scopeToSchool);

router.post('/', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_TYPES), createNotebookType);
router.post('/bulk', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_TYPES), bulkCreateNotebookTypes);
router.get('/', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_TYPES), listNotebookTypes);
router.put('/bulk', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_TYPES), bulkUpdateNotebookTypes);
router.put('/:id', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_TYPES), updateNotebookType);
router.delete('/:id', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_TYPES), deleteNotebookType);

export default router;