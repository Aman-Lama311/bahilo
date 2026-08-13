import { Request, Response } from 'express';
import NotebookReason from '../models/NotebookReason';

export const createNotebookReason = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body as { name: string };
  try {
    const reason = await NotebookReason.create({ schoolId: req.schoolId, name });
    res.status(201).json(reason);
  } catch (err) {
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      res.status(409).json({ message: 'A reason with this name already exists' });
      return;
    }
    res.status(400).json({ message: (err as Error).message });
  }
};

export const bulkCreateNotebookReasons = async (req: Request, res: Response): Promise<void> => {
  const { reasons } = req.body as { reasons: { name: string }[] };
  try {
    const docs = reasons.map((r) => ({ ...r, schoolId: req.schoolId }));
    const created = await NotebookReason.insertMany(docs);
    res.status(201).json(created);
  } catch (err) {
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      res.status(409).json({ message: 'One or more reasons already exist' });
      return;
    }
    res.status(400).json({ message: (err as Error).message });
  }
};

export const listNotebookReasons = async (req: Request, res: Response): Promise<void> => {
  const reasons = await NotebookReason.find({ schoolId: req.schoolId }).sort({ name: 1 });
  res.json(reasons);
};

export const bulkUpdateNotebookReasons = async (req: Request, res: Response): Promise<void> => {
  const { updates } = req.body as { updates: { id: string; name?: string }[] };
  try {
    const results = await Promise.all(
      updates.map(({ id, ...fields }) =>
        NotebookReason.findOneAndUpdate({ _id: id, schoolId: req.schoolId }, fields, { new: true })
      )
    );
    res.json(results);
  } catch (err) {
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      res.status(409).json({ message: 'One or more updates would create a duplicate reason name' });
      return;
    }
    res.status(400).json({ message: (err as Error).message });
  }
};

export const updateNotebookReason = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await NotebookReason.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.schoolId },
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ message: 'Reason not found in your school' });
      return;
    }
    res.json(updated);
  } catch (err) {
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      res.status(409).json({ message: 'A reason with this name already exists' });
      return;
    }
    res.status(400).json({ message: (err as Error).message });
  }
};

export const deleteNotebookReason = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await NotebookReason.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
    if (!deleted) {
      res.status(404).json({ message: 'Reason not found in your school' });
      return;
    }
    res.json({ message: 'Reason deleted' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};