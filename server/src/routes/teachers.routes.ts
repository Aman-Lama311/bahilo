import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import {
  createTeacher,
  bulkCreateTeachers,
  listTeachers,
  updateTeacher,
  bulkUpdateTeachers,
  deleteTeacher
} from '../controllers/teachers.controller';

const router = Router();

router.use(verifyToken, scopeToSchool);

router.post('/', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), createTeacher);
router.post('/bulk', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), bulkCreateTeachers);
router.get('/', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), listTeachers);
router.put('/bulk', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), bulkUpdateTeachers);
router.put('/:id', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), updateTeacher);
router.delete('/:id', requirePermission(PERMISSIONS.MANAGE_MASTER_DATA), deleteTeacher);

export default router;