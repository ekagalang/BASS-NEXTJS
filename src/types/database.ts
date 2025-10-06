// ============================================
// DATABASE TYPES: BASS Training Academy
// Version: 1.0
// Description: TypeScript types untuk semua database tables
// ============================================

// ============================================
// USERS & AUTHENTICATION
// ============================================

export type UserRole = "admin" | "instructor" | "user";
export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  status: UserStatus;
  email_verified_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: number;
  user_id: number;
  token: string;
  ip_address?: string;
  user_agent?: string;
  expires_at: Date;
  created_at: Date;
}

// ============================================
// PROGRAMS
// ============================================

export interface ProgramCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export type InstructorLevel = "junior" | "regular" | "senior" | "master";

export interface Instructor {
  id: number;
  name: string;
  slug: string;
  level: InstructorLevel;
  bio?: string;
  photo?: string;
  expertise?: string[]; // JSON array
  email?: string;
  phone?: string;
  linkedin?: string;
  status: "active" | "inactive";
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export type ProgramStatus = "draft" | "published" | "archived";

export interface Program {
  id: number;
  title: string;
  slug: string;
  category_id?: number;
  description?: string;
  content?: string;
  image?: string;
  duration?: string;
  price: number;
  instructor_id?: number;
  requirements?: string;
  benefits?: string[]; // JSON array
  certificate: "yes" | "no";
  status: ProgramStatus;
  views: number;
  meta_title?: string;
  meta_description?: string;
  created_at: Date;
  updated_at: Date;
}

export type ScheduleStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface Schedule {
  id: number;
  program_id: number;
  start_date: Date;
  end_date: Date;
  start_time?: string;
  end_time?: string;
  location?: string;
  address?: string;
  max_seats: number;
  available_seats: number;
  price?: number;
  early_bird_price?: number;
  early_bird_deadline?: Date;
  status: ScheduleStatus;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export type RegistrationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";
export type PaymentStatus = "unpaid" | "pending" | "paid" | "refunded";

export interface Registration {
  id: number;
  user_id: number;
  program_id: number;
  schedule_id: number;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  company?: string;
  position?: string;
  status: RegistrationStatus;
  payment_status: PaymentStatus;
  payment_method?: string;
  payment_proof?: string;
  total_amount: number;
  notes?: string;
  registered_at: Date;
  confirmed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// CONTENT - PAGES & POSTS
// ============================================

export type PageStatus = "draft" | "published";

export interface Page {
  id: number;
  title: string;
  slug: string;
  content?: string;
  template: string;
  parent_id?: number;
  display_order: number;
  show_in_menu: "yes" | "no";
  status: PageStatus;
  meta_title?: string;
  meta_description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PostCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export type PostStatus = "draft" | "published" | "archived";

export interface Post {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  category_id?: number;
  author_id: number;
  status: PostStatus;
  views: number;
  published_at?: Date;
  meta_title?: string;
  meta_description?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// MEDIA
// ============================================

export interface Media {
  id: number;
  filename: string;
  original_name: string;
  path: string;
  url: string;
  mime_type: string;
  size: number;
  width?: number;
  height?: number;
  alt_text?: string;
  title?: string;
  description?: string;
  uploaded_by: number;
  created_at: Date;
}

export interface Gallery {
  id: number;
  title: string;
  slug: string;
  description?: string;
  images?: number[]; // Array of media IDs (JSON)
  cover_image?: string;
  status: PageStatus;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// CONTACT & COMMUNICATION
// ============================================

export type ContactStatus = "unread" | "read" | "replied" | "archived";

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: ContactStatus;
  ip_address?: string;
  user_agent?: string;
  read_at?: Date;
  replied_at?: Date;
  created_at: Date;
}

export type SubscriberStatus = "active" | "unsubscribed" | "bounced";

export interface NewsletterSubscriber {
  id: number;
  email: string;
  name?: string;
  status: SubscriberStatus;
  token?: string;
  subscribed_at: Date;
  unsubscribed_at?: Date;
}

// ============================================
// CHAT SYSTEM
// ============================================

export type ChatSessionStatus = "waiting" | "active" | "ended" | "abandoned";

export interface ChatSession {
  id: number;
  visitor_id: string;
  visitor_name?: string;
  visitor_email?: string;
  visitor_phone?: string;
  admin_id?: number;
  status: ChatSessionStatus;
  started_at: Date;
  ended_at?: Date;
}

export type ChatSenderType = "visitor" | "admin" | "bot";

export interface ChatMessage {
  id: number;
  session_id: number;
  sender_type: ChatSenderType;
  sender_id?: number;
  message: string;
  is_read: boolean;
  created_at: Date;
}

export interface ChatBotRule {
  id: number;
  trigger_keyword: string;
  response_text: string;
  priority: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// SETTINGS
// ============================================

export type SettingType = "text" | "number" | "boolean" | "json";

export interface Setting {
  id: number;
  key: string;
  value?: string;
  type: SettingType;
  group: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================
// ANALYTICS
// ============================================

export type PageType = "program" | "post" | "page" | "other";

export interface PageView {
  id: number;
  page_type: PageType;
  page_id?: number;
  ip_address?: string;
  user_agent?: string;
  referer?: string;
  viewed_at: Date;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// EXTENDED TYPES (with relations)
// ============================================

export interface ProgramWithRelations extends Program {
  category?: ProgramCategory;
  instructor?: Instructor;
  schedules?: Schedule[];
}

export interface ScheduleWithRelations extends Schedule {
  program?: Program;
}

export interface PostWithRelations extends Post {
  category?: PostCategory;
  author?: User;
}

export interface ChatSessionWithRelations extends ChatSession {
  messages?: ChatMessage[];
  admin?: User;
}

export interface RegistrationWithRelations extends Registration {
  user?: User;
  program?: Program;
  schedule?: Schedule;
}

// ============================================
// FORM INPUT TYPES
// ============================================

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ContactInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface NewsletterInput {
  email: string;
  name?: string;
}

export interface ProgramInput {
  title: string;
  slug: string;
  category_id?: number;
  description?: string;
  content?: string;
  image?: string;
  duration?: string;
  price: number;
  instructor_id?: number;
  requirements?: string;
  benefits?: string[];
  certificate?: "yes" | "no";
  status: ProgramStatus;
  meta_title?: string;
  meta_description?: string;
}

export interface ScheduleInput {
  program_id: number;
  start_date: Date | string;
  end_date: Date | string;
  start_time?: string;
  end_time?: string;
  location?: string;
  address?: string;
  max_seats: number;
  price?: number;
  early_bird_price?: number;
  early_bird_deadline?: Date | string;
  status: ScheduleStatus;
  notes?: string;
}

export interface RegistrationInput {
  program_id: number;
  schedule_id: number;
  participant_name: string;
  participant_email: string;
  participant_phone: string;
  company?: string;
  position?: string;
}

export interface ChatMessageInput {
  session_id: number;
  sender_type: ChatSenderType;
  message: string;
}

// ============================================
// QUERY FILTER TYPES
// ============================================

export interface ProgramFilters {
  category_id?: number;
  instructor_id?: number;
  status?: ProgramStatus;
  search?: string;
  min_price?: number;
  max_price?: number;
}

export interface ScheduleFilters {
  program_id?: number;
  status?: ScheduleStatus;
  start_date?: Date | string;
  end_date?: Date | string;
}

export interface PostFilters {
  category_id?: number;
  author_id?: number;
  status?: PostStatus;
  search?: string;
}

export interface ContactFilters {
  status?: ContactStatus;
  email?: string;
  date_from?: Date | string;
  date_to?: Date | string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// ============================================
// DATABASE QUERY RESULT TYPES
// ============================================

export interface QueryResult {
  affectedRows: number;
  insertId: number;
  warningCount: number;
}

export interface CountResult {
  total: number;
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export type CreateInput<T> = Omit<T, "id" | "created_at" | "updated_at">;
export type UpdateInput<T> = Partial<CreateInput<T>>;

// ============================================
// EXPORT ALL
// ============================================

export type {
  User,
  Session,
  ProgramCategory,
  Instructor,
  Program,
  Schedule,
  Registration,
  Page,
  PostCategory,
  Post,
  Media,
  Gallery,
  Contact,
  NewsletterSubscriber,
  ChatSession,
  ChatMessage,
  ChatBotRule,
  Setting,
  PageView,
};
