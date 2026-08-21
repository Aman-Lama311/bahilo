import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import School from '../models/School';
import { JwtPayload } from '../types/jwt.types';
import { sendPasswordResetEmail } from '../services/email.service';

const COOKIE_NAME = 'token';
const COOKIE_MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8h, matches JWT expiresIn below — keep these two in sync

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // must be true in prod (requires HTTPS); false so it still works on local http dev
  sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
  maxAge: COOKIE_MAX_AGE_MS,
  path: '/',
};

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

    // Token now lives only in an httpOnly cookie — JS on the frontend can never read it,
    // which is the whole point (mitigates XSS token theft vs localStorage).
    res.cookie(COOKIE_NAME, token, cookieOptions);

    // No token in the body anymore. Send back non-sensitive user info instead —
    // the frontend needs this to populate authSlice (permissions, role flags, etc.)
    // since it can no longer decode the token itself.
    res.json({
      user: {
        id: String(user._id),
        email: user.email,
        schoolId: user.schoolId ? String(user.schoolId) : null,
        permissions: user.permissions,
        isSuperAdmin: user.isSuperAdmin,
        isPlatformOwner: user.isPlatformOwner
      }
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  // clearCookie must be called with the SAME options (path/sameSite/secure) used to set it,
  // otherwise the browser won't match and remove it.
  res.clearCookie(COOKIE_NAME, {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
  });
  res.json({ message: 'Logged out successfully' });
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };

  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(401).json({ message: 'Current password is incorrect' });
      return;
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, schoolCode } = req.body as { email: string; schoolCode?: string };

  try {
    let user;
    if (schoolCode) {
      const school = await School.findOne({ code: schoolCode });
      user = school ? await User.findOne({ email, schoolId: school._id }) : null;
    } else {
      user = await User.findOne({ email, isPlatformOwner: true });
    }

    if (!user) {
      res.json({ message: 'If that account exists, a reset code has been sent' });
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = code;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendPasswordResetEmail(user.email, code);

    res.json({ message: 'If that account exists, a reset code has been sent' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, schoolCode, code, newPassword } = req.body as {
    email: string;
    schoolCode?: string;
    code: string;
    newPassword: string;
  };

  try {
    let user;
    if (schoolCode) {
      const school = await School.findOne({ code: schoolCode });
      user = school ? await User.findOne({ email, schoolId: school._id }) : null;
    } else {
      user = await User.findOne({ email, isPlatformOwner: true });
    }

    if (
      !user ||
      user.resetPasswordToken !== code ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      res.status(400).json({ message: 'Reset code is invalid or has expired' });
      return;
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};