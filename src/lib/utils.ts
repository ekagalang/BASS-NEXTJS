// ============================================
// UTILITY FUNCTIONS
// Helper functions untuk aplikasi
// ============================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

/**
 * Merge Tailwind CSS classes
 * Menggabungkan class dengan conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate slug from string
 * @param text Text to slugify
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
}

/**
 * Format currency (IDR)
 * @param amount Amount in number
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date
 * @param date Date object or string
 * @param format Format string
 * @returns Formatted date
 */
export function formatDate(
  date: Date | string,
  format: "full" | "short" | "time" = "full"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  switch (format) {
    case "full":
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
      }).format(dateObj);
    case "short":
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(dateObj);
    case "time":
      return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateObj);
    default:
      return dateObj.toLocaleDateString("id-ID");
  }
}

/**
 * Truncate text
 * @param text Text to truncate
 * @param length Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}

/**
 * Sleep/delay function
 * @param ms Milliseconds to sleep
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validate email format
 * @param email Email string
 * @returns true if valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Indonesia)
 * @param phone Phone number string
 * @returns true if valid Indonesian phone
 */
export function isValidPhone(phone: string): boolean {
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Check if starts with 08, +62, or 62
  const phoneRegex = /^(08|628|\+628)[0-9]{8,11}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Generate random string
 * @param length Length of string
 * @returns Random string
 */
export function generateRandomString(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Safe JSON parse
 * @param json JSON string
 * @param fallback Fallback value if parse fails
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Get file extension
 * @param filename Filename
 * @returns File extension (lowercase)
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

/**
 * Format file size
 * @param bytes Size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Sanitize HTML (basic)
 * @param html HTML string
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - remove script tags
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
}

/**
 * Get initials from name
 * @param name Full name
 * @returns Initials (max 2 chars)
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Capitalize first letter
 * @param str String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Create query string from object
 * @param params Object of query parameters
 * @returns Query string
 */
export function createQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}
