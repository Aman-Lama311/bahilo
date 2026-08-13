import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import {
  createNotebookReason,
  bulkCreateNotebookReasons,
  listNotebookReasons,
  bulkUpdateNotebookReasons,
  updateNotebookReason,
  deleteNotebookReason
} from '../controllers/notebookReasons.controller';

const router = Router();

router.use(verifyToken, scopeToSchool);

router.post('/', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_REASONS), createNotebookReason);
router.post('/bulk', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_REASONS), bulkCreateNotebookReasons);
router.get('/', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_REASONS), listNotebookReasons);
router.put('/bulk', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_REASONS), bulkUpdateNotebookReasons);
router.put('/:id', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_REASONS), updateNotebookReason);
router.delete('/:id', requirePermission(PERMISSIONS.MANAGE_NOTEBOOK_REASONS), deleteNotebookReason);

export default router;