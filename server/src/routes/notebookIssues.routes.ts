import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import {
  createNotebookIssue,
  listNotebookIssues,
  getStudentSummary
} from '../controllers/notebookIssues.controller';

const router = Router();

router.use(verifyToken, scopeToSchool);

router.post('/', requirePermission(PERMISSIONS.CREATE_NOTEBOOK_ISSUE), createNotebookIssue);
router.get('/', requirePermission(PERMISSIONS.VIEW_NOTEBOOK_ISSUES), listNotebookIssues);
router.get('/student/:studentId/summary', requirePermission(PERMISSIONS.VIEW_NOTEBOOK_ISSUES), getStudentSummary);

export default router;