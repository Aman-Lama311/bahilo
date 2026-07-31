import { Request, Response } from 'express';
import PrintLog from '../models/PrintLog';
import PaperStock from '../models/PaperStock';
import { toCSV } from '../utils/csv';

export const exportPrintLogsCsv = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await PrintLog.find({ schoolId: req.schoolId })
      .populate('teacherId classId sectionId departmentId')
      .sort({ date: -1 })
      .lean();

    const rows = logs.map((log) => ({
      date: new Date(log.date).toISOString().split('T')[0],
      teacher: (log.teacherId as unknown as { name?: string })?.name ?? '',
      class: (log.classId as unknown as { name?: string })?.name ?? '',
      section: (log.sectionId as unknown as { name?: string })?.name ?? '',
      department: (log.departmentId as unknown as { name?: string })?.name ?? '',
      purpose: log.purpose,
      sheetsUsed: log.sheetsUsed
    }));

    const csv = toCSV(rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="printlogs.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const exportStockCsv = async (req: Request, res: Response): Promise<void> => {
  try {
    const entries = await PaperStock.find({ schoolId: req.schoolId }).sort({ date: -1 }).lean();

    const rows = entries.map((entry) => ({
      date: new Date(entry.date).toISOString().split('T')[0],
      type: entry.type,
      reams: entry.reams,
      sheetsPerReam: entry.sheetsPerReam,
      totalSheets: entry.reams * entry.sheetsPerReam,
      note: entry.note ?? ''
    }));

    const csv = toCSV(rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="stock.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};