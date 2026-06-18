// lib/validation/schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['customer', 'provider']),
  agreeToTerms: z.boolean().refine((v) => v, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  displayName: z.string().min(2).max(50),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500).optional(),
  businessName: z.string().optional(),
  businessDescription: z.string().max(1000).optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  shortDescription: z.string().max(200),
  categoryId: z.string().min(1, 'Please select a category'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  priceType: z.enum(['fixed', 'hourly', 'quote']),
  currency: z.string().default('ZAR'),
  duration: z.number().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const bookingSchema = z.object({
  scheduledDate: z.date({ required_error: 'Please select a date' }),
  scheduledTime: z.string().min(1, 'Please select a time'),
  notes: z.string().max(500).optional(),
  address: z.string().optional(),
  paymentMethod: z.enum(['payfast', 'yoco', 'peach']),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type BookingFormData = z.infer<typeof bookingSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
