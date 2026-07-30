import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import {
  createClass,
  bulkCreateClasses,
  listClasses,
  updateClass,
  deleteClass
} from '../controllers/classes.controller';

const router = Router();

router.use(verifyToken, scopeToSchool);

router.post('/', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), createClass);
router.post('/bulk', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), bulkCreateClasses);
router.get('/', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), listClasses);
router.put('/:id', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), updateClass);
router.delete('/:id', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), deleteClass);

export default router;