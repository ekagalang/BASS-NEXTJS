// ============================================
// AUTHENTICATION UTILITIES
// JWT, Password hashing, Session management
// ============================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import type { User } from "@/types/database";

// JWT Configuration
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Types
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// ============================================
// PASSWORD HASHING
// ============================================

/**
 * Hash password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 * @param password Plain text password
 * @param hash Hashed password
 * @returns true if passwords match
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// ============================================
// JWT TOKEN MANAGEMENT
// ============================================

/**
 * Generate JWT token
 * @param payload Token payload
 * @returns JWT token string
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify JWT token
 * @param token JWT token string
 * @returns Decoded payload or null
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

/**
 * Decode JWT token without verification
 * @param token JWT token string
 * @returns Decoded payload or null
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * Create session in database
 * @param userId User ID
 * @param token JWT token
 * @param expiresIn Expiration time (e.g., '7d')
 */
export async function createSession(
  userId: number,
  token: string,
  expiresIn: string = JWT_EXPIRES_IN
): Promise<void> {
  // Calculate expiration date
  const expiresAt = new Date();
  const days = parseInt(expiresIn.replace("d", ""));
  expiresAt.setDate(expiresAt.getDate() + days);

  await db.query(
    `INSERT INTO sessions (user_id, token, expires_at) 
     VALUES (?, ?, ?)`,
    [userId, token, expiresAt]
  );
}

/**
 * Get session from database
 * @param token JWT token
 * @returns Session data or null
 */
export async function getSession(token: string): Promise<any | null> {
  const sessions = await db.query<any[]>(
    `SELECT * FROM sessions 
     WHERE token = ? AND expires_at > NOW()
     LIMIT 1`,
    [token]
  );

  return sessions.length > 0 ? sessions[0] : null;
}

/**
 * Delete session from database
 * @param token JWT token
 */
export async function deleteSession(token: string): Promise<void> {
  await db.query("DELETE FROM sessions WHERE token = ?", [token]);
}

/**
 * Delete all user sessions
 * @param userId User ID
 */
export async function deleteUserSessions(userId: number): Promise<void> {
  await db.query("DELETE FROM sessions WHERE user_id = ?", [userId]);
}

/**
 * Clean expired sessions
 */
export async function cleanExpiredSessions(): Promise<void> {
  await db.query("DELETE FROM sessions WHERE expires_at < NOW()");
}

// ============================================
// USER AUTHENTICATION
// ============================================

/**
 * Get user by email
 * @param email User email
 * @returns User data or null
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await db.query<User[]>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return users.length > 0 ? users[0] : null;
}

/**
 * Get user by ID
 * @param userId User ID
 * @returns User data or null
 */
export async function getUserById(userId: number): Promise<User | null> {
  const users = await db.query<User[]>(
    "SELECT * FROM users WHERE id = ? LIMIT 1",
    [userId]
  );

  return users.length > 0 ? users[0] : null;
}

/**
 * Authenticate user
 * @param email User email
 * @param password User password
 * @returns Auth user data or null
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthUser | null> {
  // Get user from database
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  // Check if user is active
  if (user.status !== "active") {
    return null;
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  // Return user data (without password)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };
}

/**
 * Get auth user from token
 * @param token JWT token
 * @returns Auth user data or null
 */
export async function getAuthUser(token: string): Promise<AuthUser | null> {
  // Verify token
  const payload = verifyToken(token);

  if (!payload) {
    return null;
  }

  // Check session
  const session = await getSession(token);

  if (!session) {
    return null;
  }

  // Get user data
  const user = await getUserById(payload.userId);

  if (!user || user.status !== "active") {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Extract token from Authorization header
 * @param authHeader Authorization header value
 * @returns Token string or null
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;

  // Bearer token format
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return authHeader;
}

/**
 * Check if user has role
 * @param user Auth user
 * @param roles Allowed roles
 * @returns true if user has role
 */
export function hasRole(user: AuthUser, roles: string[]): boolean {
  return roles.includes(user.role);
}

/**
 * Check if user is admin
 * @param user Auth user
 * @returns true if user is admin
 */
export function isAdmin(user: AuthUser): boolean {
  return user.role === "admin";
}

/**
 * Generate random token
 * @param length Token length
 * @returns Random token string
 */
export function generateRandomToken(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
