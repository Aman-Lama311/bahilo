import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { scopeToSchool } from '../middleware/scopeToSchool';
import { requirePermission } from '../middleware/permission';
import { PERMISSIONS } from '../constants/permissions';
import {
  reportByClass,
  reportByTeacher,
  reportMonthlyTrend,
  reportByPurpose
} from '../controllers/reports.controller';

const router = Router();

router.use(verifyToken, scopeToSchool, requirePermission(PERMISSIONS.VIEW_REPORTS));

router.get('/by-class', reportByClass);
router.get('/by-teacher', reportByTeacher);
router.get('/monthly-trend', reportMonthlyTrend);
router.get('/by-purpose', reportByPurpose);

export default router;