// ============================================
// VALIDATION SCHEMAS
// Zod schemas untuk validasi input
// ============================================

import { z } from "zod";

// ============================================
// AUTHENTICATION SCHEMAS
// ============================================

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password lama wajib diisi"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password baru tidak cocok",
    path: ["confirmPassword"],
  });

// ============================================
// CONTACT FORM SCHEMA
// ============================================

export const contactSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject minimal 3 karakter").optional(),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

// ============================================
// NEWSLETTER SCHEMA
// ============================================

export const newsletterSchema = z.object({
  email: z.string().email("Email tidak valid"),
  name: z.string().optional(),
});

// ============================================
// PROGRAM SCHEMAS
// ============================================

export const programSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  category_id: z.number().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  duration: z.string().optional(),
  price: z.number().min(0, "Harga tidak boleh negatif"),
  instructor_id: z.number().optional(),
  requirements: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  certificate: z.enum(["yes", "no"]).default("yes"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

// ============================================
// SCHEDULE SCHEMAS
// ============================================

export const scheduleSchema = z.object({
  program_id: z.number(),
  start_date: z.string().or(z.date()),
  end_date: z.string().or(z.date()),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  max_seats: z.number().min(1, "Minimal 1 seat"),
  price: z.number().min(0).optional(),
  early_bird_price: z.number().min(0).optional(),
  early_bird_deadline: z.string().or(z.date()).optional(),
  status: z
    .enum(["upcoming", "ongoing", "completed", "cancelled"])
    .default("upcoming"),
  notes: z.string().optional(),
});

// ============================================
// REGISTRATION SCHEMAS
// ============================================

export const registrationSchema = z.object({
  program_id: z.number(),
  schedule_id: z.number(),
  participant_name: z.string().min(2, "Nama minimal 2 karakter"),
  participant_email: z.string().email("Email tidak valid"),
  participant_phone: z.string().min(10, "Nomor telepon tidak valid"),
  company: z.string().optional(),
  position: z.string().optional(),
});

// ============================================
// POST SCHEMAS
// ============================================

export const postSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  featured_image: z.string().optional(),
  category_id: z.number().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  published_at: z.string().or(z.date()).optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

// ============================================
// PAGE SCHEMAS
// ============================================

export const pageSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  content: z.string().optional(),
  template: z.string().default("default"),
  parent_id: z.number().optional(),
  display_order: z.number().default(0),
  show_in_menu: z.enum(["yes", "no"]).default("yes"),
  status: z.enum(["draft", "published"]).default("draft"),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

// ============================================
// MEDIA SCHEMAS
// ============================================

export const mediaUploadSchema = z.object({
  file: z.instanceof(File),
  alt_text: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});

// ============================================
// CHAT SCHEMAS
// ============================================

export const chatMessageSchema = z.object({
  session_id: z.number(),
  message: z.string().min(1, "Pesan tidak boleh kosong"),
});

export const chatSessionSchema = z.object({
  visitor_name: z.string().optional(),
  visitor_email: z.string().email().optional(),
  visitor_phone: z.string().optional(),
});

// ============================================
// SETTINGS SCHEMA
// ============================================

export const settingSchema = z.object({
  key: z.string().min(1, "Key wajib diisi"),
  value: z.string().optional(),
  type: z.enum(["text", "number", "boolean", "json"]).default("text"),
  group: z.string().default("general"),
  description: z.string().optional(),
});

// ============================================
// QUERY PARAMS SCHEMAS
// ============================================

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ProgramInput = z.infer<typeof programSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type PageInput = z.infer<typeof pageSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type SettingInput = z.infer<typeof settingSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
