import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name").max(80),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Add at least one uppercase letter")
    .regex(/[0-9]/, "Add at least one number"),
  userType: z.enum(["freelancer", "client"]),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Please enter your password"),
});

export const contactSchema = z.object({
  fullName: z.string().min(2, "Please enter your name").max(80),
  email: z.string().email("Please enter a valid email"),
  company: z.string().max(120).optional().or(z.literal("")),
  interest: z.string().min(1, "Please select an interest"),
  message: z.string().min(10, "Tell us a bit more (min 10 characters)").max(2000),
});

export const serviceSchema = z.object({
  title: z.string().min(5, "Title is too short").max(120),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000),
  category: z.string().min(1),
  price: z.number().int().min(5, "Price must be at least $5").max(100000),
  deliveryDays: z.number().int().min(1).max(365).default(3),
  tags: z.array(z.string()).max(6).default([]),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const projectSchema = z.object({
  title: z.string().min(5, "Title is too short").max(120),
  description: z.string().min(20, "Description must be at least 20 characters").max(4000),
  category: z.string().min(1),
  budgetMin: z.number().int().min(50),
  budgetMax: z.number().int().min(50),
  experienceLevel: z.enum(["beginner", "intermediate", "expert"]).default("intermediate"),
  duration: z.string().max(60).optional().or(z.literal("")),
  skillsRequired: z.array(z.string()).max(15).default([]),
  deadline: z.string().optional().or(z.literal("")),
});

export const proposalSchema = z.object({
  projectId: z.string().uuid(),
  bidAmount: z.number().int().min(1),
  coverLetter: z.string().min(20, "Tell the client why you're a great fit").max(2000),
  estimatedDays: z.number().int().min(1).max(365).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
