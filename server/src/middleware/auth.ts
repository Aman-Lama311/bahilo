import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/jwt.types';

const COOKIE_NAME = 'token';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requirePlatformOwner = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user?.isPlatformOwner) {
    res.status(403).json({ message: 'Platform owner access required' });
    return;
  }
  next();
};

export const requireSchoolAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user?.isSuperAdmin && !req.user?.isPlatformOwner) {
    res.status(403).json({ message: 'School admin access required' });
    return;
  }
  next();
};