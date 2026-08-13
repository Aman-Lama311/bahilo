import { Request, Response } from 'express';
import mongoose from 'mongoose';
import NotebookStock from '../models/NotebookStock';
import NotebookIssue from '../models/NotebookIssue';

export const addNotebookStock = async (req: Request, res: Response): Promise<void> => {
  const { notebookTypeId, quantity, date, note } = req.body as {
    notebookTypeId: string;
    quantity: number;
    date?: string;
    note?: string;
  };

  try {
    const entry = await NotebookStock.create({
      schoolId: req.schoolId,
      notebookTypeId,
      quantity,
      date: date ? new Date(date) : new Date(),
      addedBy: req.user?.userId,
      note
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getCurrentNotebookStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const schoolObjectId = new mongoose.Types.ObjectId(req.schoolId);

    const received = await NotebookStock.aggregate([
      { $match: { schoolId: schoolObjectId } },
      { $group: { _id: '$notebookTypeId', totalReceived: { $sum: '$quantity' } } }
    ]);

    const issued = await NotebookIssue.aggregate([
      { $match: { schoolId: schoolObjectId } },
      { $group: { _id: '$notebookTypeId', totalIssued: { $sum: '$quantity' } } }
    ]);

    const issuedMap = new Map(issued.map((i) => [String(i._id), i.totalIssued]));

    const typeIds = received.map((r) => r._id);
    const types = await mongoose.model('NotebookType').find({ _id: { $in: typeIds } });
    const nameMap = new Map(types.map((t: any) => [String(t._id), t.name]));

    const result = received.map((r) => {
      const totalReceived = r.totalReceived;
      const totalIssued = issuedMap.get(String(r._id)) ?? 0;
      return {
        notebookTypeId: r._id,
        notebookType: nameMap.get(String(r._id)) ?? 'Unknown',
        totalReceived,
        totalIssued,
        currentStock: totalReceived - totalIssued
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const listNotebookStockEntries = async (req: Request, res: Response): Promise<void> => {
  const entries = await NotebookStock.find({ schoolId: req.schoolId })
    .populate('notebookTypeId')
    .sort({ date: -1 });
  res.json(entries);
};