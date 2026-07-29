export interface JwtPayload {
  userId: string;
  schoolId: string | null;
  permissions: string[];
  isSuperAdmin: boolean;
  isPlatformOwner: boolean;
}