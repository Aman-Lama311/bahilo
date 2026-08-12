import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import {
  createDepartment,
  bulkCreateDepartments,
  listDepartments,
  updateDepartment,
  bulkUpdateDepartments,
  deleteDepartment
} from '../controllers/departments.controller';

const router = Router();

router.use(verifyToken, scopeToSchool);

router.post('/', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), createDepartment);
router.post('/bulk', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), bulkCreateDepartments);
router.get('/', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), listDepartments);
router.put('/bulk', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), bulkUpdateDepartments);
router.put('/:id', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), updateDepartment);
router.delete('/:id', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), deleteDepartment);

export default router;