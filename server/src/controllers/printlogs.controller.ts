import { Request, Response } from 'express';
import PrintLog from '../models/PrintLog';

export const createPrintLog = async (req: Request, res: Response): Promise<void> => {
  const {
    date,
    teacherId,
    classId,
    sectionId,
    departmentId,
    purpose,
    sheetsUsed,
    printerId
  } = req.body as {
    date?: string;
    teacherId?: string;
    classId?: string;
    sectionId?: string;
    departmentId?: string;
    purpose: string;
    sheetsUsed: number;
    printerId?: string;
  };

  const hasClassSection = Boolean(classId || sectionId);
  const hasDepartment = Boolean(departmentId);

  if (hasClassSection && hasDepartment) {
    res.status(400).json({ message: 'A print log must be either class/section OR department, not both' });
    return;
  }
  if (!hasClassSection && !hasDepartment) {
    res.status(400).json({ message: 'A print log must specify either a class/section or a department' });
    return;
  }

  try {
    const log = await PrintLog.create({
      schoolId: req.schoolId,
      date: date ? new Date(date) : new Date(),
      teacherId,
      classId,
      sectionId,
      departmentId,
      purpose,
      sheetsUsed,
      printerId,
      loggedBy: req.user?.userId
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const listPrintLogs = async (req: Request, res: Response): Promise<void> => {
  const filter: Record<string, unknown> = { schoolId: req.schoolId };

  if (req.query.classId) filter.classId = req.query.classId;
  if (req.query.departmentId) filter.departmentId = req.query.departmentId;
  if (req.query.teacherId) filter.teacherId = req.query.teacherId;

  if (req.query.from || req.query.to) {
    const dateFilter: Record<string, Date> = {};
    if (req.query.from) dateFilter.$gte = new Date(req.query.from as string);
    if (req.query.to) dateFilter.$lte = new Date(req.query.to as string);
    filter.date = dateFilter;
  }

  const logs = await PrintLog.find(filter)
    .populate('teacherId classId sectionId departmentId')
    .sort({ date: -1 });

  res.json(logs);
};