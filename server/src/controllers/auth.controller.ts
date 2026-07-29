import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import School from '../models/School';
import { JwtPayload } from '../types/jwt.types';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, schoolCode, password } = req.body as {
    email: string;
    schoolCode?: string;
    password: string;
  };

  try {
    let user;

    if (schoolCode) {
      const school = await School.findOne({ code: schoolCode, active: true });
      if (!school) {
        res.status(401).json({ message: 'Invalid school code' });
        return;
      }
      user = await User.findOne({ email, schoolId: school._id });
    } else {
      // platform owner login has no schoolId
      user = await User.findOne({ email, isPlatformOwner: true });
    }

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
      return;
    }

    const payload: JwtPayload = {
      userId: String(user._id),
      schoolId: user.schoolId ? String(user.schoolId) : null,
      permissions: user.permissions,
      isSuperAdmin: user.isSuperAdmin,
      isPlatformOwner: user.isPlatformOwner
    };

    const token = jwt.sign(payload, secret, { expiresIn: '8h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};