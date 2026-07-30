import { Request, Response } from 'express';
import Department from '../models/Department';

export const createDepartment = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body as { name: string };
  try {
    const department = await Department.create({ schoolId: req.schoolId, name });
    res.status(201).json(department);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const bulkCreateDepartments = async (req: Request, res: Response): Promise<void> => {
  const { departments } = req.body as { departments: { name: string }[] };
  try {
    const docs = departments.map((d) => ({ ...d, schoolId: req.schoolId }));
    const created = await Department.insertMany(docs);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const listDepartments = async (req: Request, res: Response): Promise<void> => {
  const departments = await Department.find({ schoolId: req.schoolId });
  res.json(departments);
};

export const updateDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Department.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.schoolId },
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ message: 'Department not found in your school' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Department.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
    if (!deleted) {
      res.status(404).json({ message: 'Department not found in your school' });
      return;
    }
    res.json({ message: 'Department deleted' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};