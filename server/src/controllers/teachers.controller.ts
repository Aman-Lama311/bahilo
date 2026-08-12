import { Request, Response } from 'express';
import Teacher from '../models/Teacher';

export const createTeacher = async (req: Request, res: Response): Promise<void> => {
  const { name, assignedSections, veidaId } = req.body as {
    name: string;
    assignedSections?: string[];
    veidaId?: string;
  };
  try {
    const teacher = await Teacher.create({
      schoolId: req.schoolId,
      name,
      assignedSections: assignedSections ?? [],
      veidaId
    });
    res.status(201).json(teacher);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const bulkCreateTeachers = async (req: Request, res: Response): Promise<void> => {
  const { teachers } = req.body as {
    teachers: { name: string; assignedSections?: string[]; veidaId?: string }[];
  };
  try {
    const docs = teachers.map((t) => ({
      ...t,
      assignedSections: t.assignedSections ?? [],
      schoolId: req.schoolId
    }));
    const created = await Teacher.insertMany(docs);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const bulkUpdateTeachers = async (req: Request, res: Response): Promise<void> => {
  const { updates } = req.body as {
    updates: { id: string; name?: string; assignedSections?: string[]; veidaId?: string }[];
  };
  try {
    const results = await Promise.all(
      updates.map(({ id, ...fields }) =>
        Teacher.findOneAndUpdate({ _id: id, schoolId: req.schoolId }, fields, { new: true })
      )
    );
    res.json(results);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const listTeachers = async (req: Request, res: Response): Promise<void> => {
  const teachers = await Teacher.find({ schoolId: req.schoolId }).populate('assignedSections');
  res.json(teachers);
};

export const updateTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Teacher.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.schoolId },
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ message: 'Teacher not found in your school' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const deleteTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Teacher.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
    if (!deleted) {
      res.status(404).json({ message: 'Teacher not found in your school' });
      return;
    }
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};