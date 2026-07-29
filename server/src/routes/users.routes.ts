import { Router } from 'express';
import { verifyToken, requireSchoolAdmin } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { createUser, listUsers, updateUserPermissions, deleteUser } from '../controllers/users.controller';

const router = Router();

router.use(verifyToken, scopeToSchool, requireSchoolAdmin);

router.post('/', createUser);
router.get('/', listUsers);
router.put('/:id/permissions', updateUserPermissions);
router.delete('/:id', deleteUser);

export default router;