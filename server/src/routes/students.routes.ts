import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import {
  createStudent,
  bulkCreateStudents,
  listStudents,
  updateStudent,
  deleteStudent
} from '../controllers/students.controller';

const router = Router();

router.use(verifyToken, scopeToSchool);

router.post('/', requirePermission(PERMISSIONS.MANAGE_STUDENTS), createStudent);
router.post('/bulk', requirePermission(PERMISSIONS.MANAGE_STUDENTS), bulkCreateStudents);
router.get('/', requirePermission(PERMISSIONS.MANAGE_STUDENTS), listStudents);
router.put('/:id', requirePermission(PERMISSIONS.MANAGE_STUDENTS), updateStudent);
router.delete('/:id', requirePermission(PERMISSIONS.MANAGE_STUDENTS), deleteStudent);

export default router;