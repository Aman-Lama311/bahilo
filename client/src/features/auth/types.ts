export interface AuthUser {
  id: string;
  schoolId: string | null;
  email: string;
  permissions: string[];
  isSuperAdmin: boolean;
  isPlatformOwner: boolean;
}

export interface LoginRequest {
  email: string;
  schoolCode?: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
  schoolCode?: string;
}

export interface ResetPasswordRequest {
  email: string;
  schoolCode?: string;
  code: string;
  newPassword: string;
}