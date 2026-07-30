import { Request, Response } from 'express';
import Section from '../models/Section';

export const createSection = async (req: Request, res: Response): Promise<void> => {
  const { name, classId } = req.body as { name: string; classId: string };
  try {
    const section = await Section.create({ schoolId: req.schoolId, classId, name });
    res.status(201).json(section);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const bulkCreateSections = async (req: Request, res: Response): Promise<void> => {
  const { sections } = req.body as { sections: { name: string; classId: string }[] };
  try {
    const docs = sections.map((s) => ({ ...s, schoolId: req.schoolId }));
    const created = await Section.insertMany(docs);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const listSections = async (req: Request, res: Response): Promise<void> => {
  const filter: Record<string, unknown> = { schoolId: req.schoolId };
  if (req.query.classId) {
    filter.classId = req.query.classId;
  }
  const sections = await Section.find(filter);
  res.json(sections);
};

export const updateSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Section.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.schoolId },
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ message: 'Section not found in your school' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const deleteSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Section.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
    if (!deleted) {
      res.status(404).json({ message: 'Section not found in your school' });
      return;
    }
    res.json({ message: 'Section deleted' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};