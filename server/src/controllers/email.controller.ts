import { Request, Response } from 'express';
import mongoose from 'mongoose';
import School from '../models/School';
import PrintLog from '../models/PrintLog';
import { sendMonthlyReportEmail } from '../services/email.service';

export const resendMonthlyReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const schoolObjectId = new mongoose.Types.ObjectId(req.schoolId);
    const school = await School.findById(schoolObjectId);
    if (!school) {
      res.status(404).json({ message: 'School not found' });
      return;
    }

    const totalResult = await PrintLog.aggregate([
      { $match: { schoolId: schoolObjectId } },
      { $group: { _id: null, totalSheets: { $sum: '$sheetsUsed' } } }
    ]);
    const byPurposeResult = await PrintLog.aggregate([
      { $match: { schoolId: schoolObjectId } },
      { $group: { _id: '$purpose', totalSheets: { $sum: '$sheetsUsed' } } },
      { $project: { _id: 0, purpose: '$_id', totalSheets: 1 } }
    ]);

    await sendMonthlyReportEmail(school.principalEmail, school.name, {
      totalSheets: totalResult[0]?.totalSheets ?? 0,
      byPurpose: byPurposeResult
    });

    res.json({ message: `Report sent to ${school.principalEmail}` });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};