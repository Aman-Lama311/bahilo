import { baseApi } from '../../lib/api/baseApi';
import type {
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from './types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body })
    }),
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (body) => ({ url: '/auth/change-password', method: 'POST', body })
    }),
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body })
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body })
    })
  })
});

export const {
  useLoginMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;