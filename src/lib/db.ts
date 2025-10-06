// ============================================
// DATABASE CONNECTION
// MySQL connection using mysql2/promise
// ============================================

import mysql from "mysql2/promise";

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bass_training",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create connection pool
let pool: mysql.Pool | null = null;

/**
 * Get database connection pool
 * Singleton pattern - reuse same pool
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    console.log("✅ Database pool created");
  }
  return pool;
}

/**
 * Execute query with connection from pool
 * @param query SQL query string
 * @param params Query parameters
 * @returns Query result
 */
export async function query<T = any>(
  query: string,
  params?: any[]
): Promise<T> {
  try {
    const pool = getPool();
    const [results] = await pool.execute(query, params);
    return results as T;
  } catch (error) {
    console.error("❌ Database query error:", error);
    throw error;
  }
}

/**
 * Get single connection from pool
 * Use for transactions
 */
export async function getConnection() {
  const pool = getPool();
  return await pool.getConnection();
}

/**
 * Test database connection
 * @returns true if connected, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    const pool = getPool();
    await pool.query("SELECT 1");
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

/**
 * Close database pool
 * Call this when shutting down server
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log("✅ Database pool closed");
  }
}

// Export pool for direct access if needed
export const db = {
  query,
  getConnection,
  testConnection,
  closePool,
  getPool,
};

export default db;
