import { Request, Response } from 'express';
import Student from '../models/Student';

export const createStudent = async (req: Request, res: Response): Promise<void> => {
  const { name, classId, sectionId, veidaId } = req.body as {
    name: string;
    classId: string;
    sectionId: string;
    veidaId?: string;
  };
  try {
    const student = await Student.create({ schoolId: req.schoolId, name, classId, sectionId, veidaId });
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const bulkCreateStudents = async (req: Request, res: Response): Promise<void> => {
  const { students } = req.body as {
    students: { name: string; classId: string; sectionId: string; veidaId?: string }[];
  };
  try {
    const docs = students.map((s) => ({ ...s, schoolId: req.schoolId }));
    const created = await Student.insertMany(docs);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const bulkUpdateStudents = async (req: Request, res: Response): Promise<void> => {
  const { updates } = req.body as { updates: { id: string; name?: string; classId?: string; sectionId?: string }[] };

  try {
    const results = await Promise.all(
      updates.map(({ id, ...fields }) =>
        Student.findOneAndUpdate({ _id: id, schoolId: req.schoolId }, fields, { new: true })
      )
    );
    res.json(results);
  } catch (err) {
    const mongoErr = err as { code?: number };
    if (mongoErr.code === 11000) {
      res.status(409).json({ message: 'One or more updates would create a duplicate name in a class/section' });
      return;
    }
    res.status(400).json({ message: (err as Error).message });
  }
};

export const listStudents = async (req: Request, res: Response): Promise<void> => {
  const filter: Record<string, unknown> = { schoolId: req.schoolId };
  if (req.query.classId) filter.classId = req.query.classId;
  if (req.query.sectionId) filter.sectionId = req.query.sectionId;

  const students = await Student.find(filter).sort({ name: 1 });
  res.json(students);
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Student.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.schoolId },
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ message: 'Student not found in your school' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Student.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
    if (!deleted) {
      res.status(404).json({ message: 'Student not found in your school' });
      return;
    }
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};