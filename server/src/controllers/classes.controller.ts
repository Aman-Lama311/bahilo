import { Request, Response } from 'express';
import Class from '../models/Class';

export const createClass = async (req: Request, res: Response): Promise<void> => {
  const { name, order } = req.body as { name: string; order: number };
  try {
    const newClass = await Class.create({ schoolId: req.schoolId, name, order });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const bulkCreateClasses = async (req: Request, res: Response): Promise<void> => {
  const { classes } = req.body as { classes: { name: string; order: number }[] };
  try {
    const docs = classes.map((c) => ({ ...c, schoolId: req.schoolId }));
    const created = await Class.insertMany(docs);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const listClasses = async (req: Request, res: Response): Promise<void> => {
  const classes = await Class.find({ schoolId: req.schoolId }).sort({ order: 1 });
  res.json(classes);
};

export const updateClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Class.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.schoolId },
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ message: 'Class not found in your school' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const deleteClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Class.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
    if (!deleted) {
      res.status(404).json({ message: 'Class not found in your school' });
      return;
    }
    res.json({ message: 'Class deleted' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};