import cron from 'node-cron';
import mongoose from 'mongoose';
import School from '../models/School';
import PrintLog from '../models/PrintLog';
import { sendMonthlyReportEmail } from '../services/email.service';

const buildSchoolSummary = async (schoolId: mongoose.Types.ObjectId) => {
  const totalResult = await PrintLog.aggregate([
    { $match: { schoolId } },
    { $group: { _id: null, totalSheets: { $sum: '$sheetsUsed' } } }
  ]);

  const byPurposeResult = await PrintLog.aggregate([
    { $match: { schoolId } },
    { $group: { _id: '$purpose', totalSheets: { $sum: '$sheetsUsed' } } },
    { $project: { _id: 0, purpose: '$_id', totalSheets: 1 } }
  ]);

  return {
    totalSheets: totalResult[0]?.totalSheets ?? 0,
    byPurpose: byPurposeResult
  };
};

export const runMonthlyReportJob = async (): Promise<void> => {
  const activeSchools = await School.find({ active: true });

  for (const school of activeSchools) {
    try {
      const summary = await buildSchoolSummary(school._id as mongoose.Types.ObjectId);
      await sendMonthlyReportEmail(school.principalEmail, school.name, summary);
      console.log(`Monthly report sent for ${school.name}`);
    } catch (err) {
      console.error(`Failed to send report for ${school.name}:`, (err as Error).message);
    }
  }
};

export const scheduleMonthlyReportJob = (): void => {
  cron.schedule('0 8 1 * *', () => {
    runMonthlyReportJob().catch((err) => console.error('Monthly report job failed:', err));
  });
};