import { z } from 'zod';

export const loginSchema = z.object({
  schoolCode: z.string().optional(),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export type LoginFormValues = z.infer<typeof loginSchema>;