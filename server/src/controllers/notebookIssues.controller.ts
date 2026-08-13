import { Request, Response } from 'express';
import mongoose from 'mongoose';
import NotebookIssue from '../models/NotebookIssue';
import Student from '../models/Student';

export const createNotebookIssue = async (req: Request, res: Response): Promise<void> => {
  const { studentId, notebookTypeId, quantity, reason, date } = req.body as {
    studentId: string;
    notebookTypeId: string;
    quantity: number;
    reason: string;
    date?: string;
  };

  if (!req.schoolId || !studentId || !notebookTypeId || !req.user?.userId) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  if (
    !mongoose.Types.ObjectId.isValid(req.schoolId) ||
    !mongoose.Types.ObjectId.isValid(studentId) ||
    !mongoose.Types.ObjectId.isValid(notebookTypeId) ||
    !mongoose.Types.ObjectId.isValid(req.user.userId)
  ) {
    res.status(400).json({ message: 'Invalid ID format' });
    return;
  }

  const schoolObjectId = new mongoose.Types.ObjectId(req.schoolId);
  const studentObjectId = new mongoose.Types.ObjectId(studentId);
  const notebookTypeObjectId = new mongoose.Types.ObjectId(notebookTypeId);
  const issuedByObjectId = new mongoose.Types.ObjectId(req.user.userId);

  try {
    const student = await Student.findOne({ _id: studentObjectId, schoolId: schoolObjectId });
    if (!student) {
      res.status(404).json({ message: 'Student not found in your school' });
      return;
    }

    const issue = await NotebookIssue.create({
      schoolId: schoolObjectId,
      studentId: studentObjectId,
      notebookTypeId: notebookTypeObjectId,
      classId: student.classId,
      sectionId: student.sectionId,
      quantity,
      reason,
      issuedBy: issuedByObjectId,
      date: date ? new Date(date) : new Date()
    });

    res.status(201).json(issue);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const listNotebookIssues = async (req: Request, res: Response): Promise<void> => {
  if (!req.schoolId || !mongoose.Types.ObjectId.isValid(req.schoolId)) {
    res.status(400).json({ message: 'Invalid or missing school context' });
    return;
  }

  const idParams: Array<[string, unknown]> = [
    ['studentId', req.query.studentId],
    ['classId', req.query.classId],
    ['sectionId', req.query.sectionId],
    ['notebookTypeId', req.query.notebookTypeId]
  ];

  for (const [field, value] of idParams) {
    if (value !== undefined && (typeof value !== 'string' || !mongoose.Types.ObjectId.isValid(value))) {
      res.status(400).json({ message: `Invalid ${field} format` });
      return;
    }
  }

  try {
    const filter: Record<string, unknown> = {
      schoolId: new mongoose.Types.ObjectId(req.schoolId)
    };

    for (const [field, value] of idParams) {
      if (typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)) {
        filter[field] = new mongoose.Types.ObjectId(value);
      }
    }

    if (req.query.from || req.query.to) {
      const dateFilter: Record<string, Date> = {};
      if (req.query.from) dateFilter.$gte = new Date(req.query.from as string);
      if (req.query.to) dateFilter.$lte = new Date(req.query.to as string);
      filter.date = dateFilter;
    }

    const issues = await NotebookIssue.find(filter)
      .populate('studentId notebookTypeId classId sectionId')
      .sort({ date: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getStudentSummary = async (req: Request, res: Response): Promise<void> => {
  const studentIdParam = req.params.studentId;

  if (!req.schoolId || !studentIdParam || typeof studentIdParam !== 'string') {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  if (
    !mongoose.Types.ObjectId.isValid(req.schoolId) ||
    !mongoose.Types.ObjectId.isValid(studentIdParam)
  ) {
    res.status(400).json({ message: 'Invalid ID format' });
    return;
  }

  try {
    const schoolObjectId = new mongoose.Types.ObjectId(req.schoolId);
    const studentObjectId = new mongoose.Types.ObjectId(studentIdParam);

    const results = await NotebookIssue.aggregate([
      { $match: { schoolId: schoolObjectId, studentId: studentObjectId } },
      { $group: { _id: '$notebookTypeId', totalIssued: { $sum: '$quantity' } } },
      {
        $lookup: {
          from: 'notebooktypes',
          localField: '_id',
          foreignField: '_id',
          as: 'typeInfo'
        }
      },
      { $unwind: '$typeInfo' },
      {
        $project: {
          _id: 0,
          notebookTypeId: '$_id',
          notebookType: '$typeInfo.name',
          totalIssued: 1
        }
      },
      { $sort: { totalIssued: -1 } }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};