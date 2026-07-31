import { Request, Response } from 'express';
import mongoose from 'mongoose';
import PaperStock from '../models/PaperStock';
import PrintLog from '../models/PrintLog';

export const addStock = async (req: Request, res: Response): Promise<void> => {
  const { type, reams, sheetsPerReam, date, note } = req.body as {
    type: string;
    reams: number;
    sheetsPerReam: number;
    date?: string;
    note?: string;
  };

  try {
    const entry = await PaperStock.create({
      schoolId: req.schoolId,
      type,
      reams,
      sheetsPerReam,
      date: date ? new Date(date) : new Date(),
      addedBy: req.user?.userId,
      note
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getCurrentStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const schoolObjectId = new mongoose.Types.ObjectId(req.schoolId);

    const stockInResult = await PaperStock.aggregate([
      { $match: { schoolId: schoolObjectId } },
      { $group: { _id: null, totalSheetsIn: { $sum: { $multiply: ['$reams', '$sheetsPerReam'] } } } }
    ]);

    const usedResult = await PrintLog.aggregate([
      { $match: { schoolId: schoolObjectId } },
      { $group: { _id: null, totalUsed: { $sum: '$sheetsUsed' } } }
    ]);

    const totalSheetsIn = stockInResult[0]?.totalSheetsIn ?? 0;
    const totalUsed = usedResult[0]?.totalUsed ?? 0;
    const currentStock = totalSheetsIn - totalUsed;

    res.json({ totalSheetsIn, totalUsed, currentStock });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const listStockEntries = async (req: Request, res: Response): Promise<void> => {
  const entries = await PaperStock.find({ schoolId: req.schoolId }).sort({ date: -1 });
  res.json(entries);
};