import { Request, Response, NextFunction } from 'express';

export const scopeToSchool = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.isPlatformOwner) {
    // platform routes operate across schools, not scoped to one
    next();
    return;
  }

  if (!req.user?.schoolId) {
    res.status(403).json({ message: 'No school associated with this account' });
    return;
  }

  req.schoolId = req.user.schoolId;
  next();
};