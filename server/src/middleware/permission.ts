import { Request, Response, NextFunction } from 'express';

export const requirePermission = (key: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.isSuperAdmin || req.user?.isPlatformOwner) {
      next();
      return;
    }
    if (!req.user?.permissions?.includes(key)) {
      res.status(403).json({ message: `Missing permission: ${key}` });
      return;
    }
    next();
  };
};