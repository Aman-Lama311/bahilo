import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import School from '../models/School';
import User from '../models/User';

export const createSchool = async (req: Request, res: Response): Promise<void> => {
  const { name, code, address, principalEmail, adminName, adminEmail, adminPassword } = req.body as {
    name: string;
    code: string;
    address?: string;
    principalEmail: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
  };

  try {
    const school = await School.create({ name, code, address, principalEmail });

    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const admin = await User.create({
      schoolId: school._id,
      name: adminName,
      email: adminEmail,
      passwordHash,
      isSuperAdmin: true,
      permissions: []
    });

    res.status(201).json({
      school,
      admin: { id: admin._id, email: admin.email }
    });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const listSchools = async (_req: Request, res: Response): Promise<void> => {
  const schools = await School.find();
  res.json(schools);
};

export const updateSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const school = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!school) {
      res.status(404).json({ message: 'School not found' });
      return;
    }
    res.json(school);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};