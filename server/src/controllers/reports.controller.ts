import { Request, Response } from 'express';
import mongoose from 'mongoose';
import PrintLog from '../models/PrintLog';

const buildDateFilter = (req: Request): Record<string, Date> => {
  const dateFilter: Record<string, Date> = {};
  if (req.query.from) dateFilter.$gte = new Date(req.query.from as string);
  if (req.query.to) dateFilter.$lte = new Date(req.query.to as string);
  return dateFilter;
};

export const reportByClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const schoolObjectId = new mongoose.Types.ObjectId(req.schoolId);
    const dateFilter = buildDateFilter(req);

    const match: Record<string, unknown> = { schoolId: schoolObjectId, classId: { $ne: null } };
    if (Object.keys(dateFilter).length) match.date = dateFilter;

    const results = await PrintLog.aggregate([
      { $match: match },
      { $group: { _id: '$classId', totalSheets: { $sum: '$sheetsUsed' } } },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: '_id',
          as: 'classInfo'
        }
      },
      { $unwind: '$classInfo' },
      {
        $project: {
          _id: 0,
          classId: '$_id',
          className: '$classInfo.name',
          totalSheets: 1
        }
      },
      { $sort: { totalSheets: -1 } }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const reportByTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const schoolObjectId = new mongoose.Types.ObjectId(req.schoolId);
    const dateFilter = buildDateFilter(req);

    const match: Record<string, unknown> = { schoolId: schoolObjectId, teacherId: { $ne: null } };
    if (Object.keys(dateFilter).length) match.date = dateFilter;

    const results = await PrintLog.aggregate([
      { $match: match },
      { $group: { _id: '$teacherId', totalSheets: { $sum: '$sheetsUsed' } } },
      {
        $lookup: {
          from: 'teachers',
          localField: '_id',
          foreignField: '_id',
          as: 'teacherInfo'
        }
      },
      { $unwind: '$teacherInfo' },
      {
        $project: {
          _id: 0,
          teacherId: '$_id',
          teacherName: '$teacherInfo.name',
          totalSheets: 1
        }
      },
      { $sort: { totalSheets: -1 } }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const reportMonthlyTrend = async (req: Request, res: Response): Promise<void> => {
  try {
    const schoolObjectId = new mongoose.Types.ObjectId(req.schoolId);

    const results = await PrintLog.aggregate([
      { $match: { schoolId: schoolObjectId } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          totalSheets: { $sum: '$sheetsUsed' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalSheets: 1
        }
      }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const reportByPurpose = async (req: Request, res: Response): Promise<void> => {
  try {
    const schoolObjectId = new mongoose.Types.ObjectId(req.schoolId);
    const dateFilter = buildDateFilter(req);

    const match: Record<string, unknown> = { schoolId: schoolObjectId };
    if (Object.keys(dateFilter).length) match.date = dateFilter;

    const results = await PrintLog.aggregate([
      { $match: match },
      { $group: { _id: '$purpose', totalSheets: { $sum: '$sheetsUsed' } } },
      { $project: { _id: 0, purpose: '$_id', totalSheets: 1 } },
      { $sort: { totalSheets: -1 } }
    ]);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};