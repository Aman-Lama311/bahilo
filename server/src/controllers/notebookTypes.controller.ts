import { Request, Response } from 'express';
import NotebookType from '../models/NotebookType';

export const createNotebookType = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body as { name: string };
  try {
    const type = await NotebookType.create({ schoolId: req.schoolId, name });
    res.status(201).json(type);
  } catch (err) {
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      res.status(409).json({ message: 'A notebook type with this name already exists' });
      return;
    }
    res.status(400).json({ message: (err as Error).message });
  }
};

export const bulkCreateNotebookTypes = async (req: Request, res: Response): Promise<void> => {
  const { notebookTypes } = req.body as { notebookTypes: { name: string }[] };
  try {
    const docs = notebookTypes.map((t) => ({ ...t, schoolId: req.schoolId }));
    const created = await NotebookType.insertMany(docs);
    res.status(201).json(created);
  } catch (err) {
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      res.status(409).json({ message: 'One or more notebook types already exist' });
      return;
    }
    res.status(400).json({ message: (err as Error).message });
  }
};

export const listNotebookTypes = async (req: Request, res: Response): Promise<void> => {
  const types = await NotebookType.find({ schoolId: req.schoolId }).sort({ name: 1 });
  res.json(types);
};

export const bulkUpdateNotebookTypes = async (req: Request, res: Response): Promise<void> => {
  const { updates } = req.body as { updates: { id: string; name?: string }[] };
  try {
    const results = await Promise.all(
      updates.map(({ id, ...fields }) =>
        NotebookType.findOneAndUpdate({ _id: id, schoolId: req.schoolId }, fields, { new: true })
      )
    );
    res.json(results);
  } catch (err) {
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      res.status(409).json({ message: 'One or more updates would create a duplicate notebook type name' });
      return;
    }
    res.status(400).json({ message: (err as Error).message });
  }
};

export const updateNotebookType = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await NotebookType.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.schoolId },
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ message: 'Notebook type not found in your school' });
      return;
    }
    res.json(updated);
  } catch (err) {
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      res.status(409).json({ message: 'A notebook type with this name already exists' });
      return;
    }
    res.status(400).json({ message: (err as Error).message });
  }
};

export const deleteNotebookType = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await NotebookType.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
    if (!deleted) {
      res.status(404).json({ message: 'Notebook type not found in your school' });
      return;
    }
    res.json({ message: 'Notebook type deleted' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};