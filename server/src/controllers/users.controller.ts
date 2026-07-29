import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, permissions } = req.body as {
    name: string;
    email: string;
    password: string;
    permissions?: string[];
  };

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      schoolId: req.schoolId,
      name,
      email,
      passwordHash,
      isSuperAdmin: false,
      isPlatformOwner: false,
      permissions: permissions ?? []
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      permissions: user.permissions
    });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await User.find({ schoolId: req.schoolId }).select('-passwordHash');
  res.json(users);
};

export const updateUserPermissions = async (req: Request, res: Response): Promise<void> => {
  const { permissions } = req.body as { permissions: string[] };

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, schoolId: req.schoolId },
      { permissions },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      res.status(404).json({ message: 'User not found in your school' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, schoolId: req.schoolId });
    if (!user) {
      res.status(404).json({ message: 'User not found in your school' });
      return;
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};