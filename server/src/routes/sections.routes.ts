import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import {
  createSection,
  bulkCreateSections,
  listSections,
  updateSection,
  deleteSection
} from '../controllers/sections.controller';

const router = Router();

router.use(verifyToken, scopeToSchool);

router.post('/', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), createSection);
router.post('/bulk', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), bulkCreateSections);
router.get('/', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), listSections);
router.put('/:id', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), updateSection);
router.delete('/:id', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), deleteSection);

export default router;