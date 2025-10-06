// ============================================
// TEST DATABASE CONNECTION API
// Endpoint untuk test koneksi database
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/test-db
 * Test database connection dan query
 */
export async function GET(request: NextRequest) {
  try {
    // Test 1: Basic connection
    console.log("🔍 Testing database connection...");
    const isConnected = await db.testConnection();

    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to database",
          error: "Connection test failed",
        },
        { status: 500 }
      );
    }

    // Test 2: Query test - Get tables
    console.log("🔍 Testing database query...");
    const tables = await db.query<any[]>("SHOW TABLES");

    // Test 3: Query test - Get users count
    const usersResult = await db.query<any[]>(
      "SELECT COUNT(*) as total FROM users"
    );
    const totalUsers = usersResult[0]?.total || 0;

    // Test 4: Query test - Get programs count
    const programsResult = await db.query<any[]>(
      "SELECT COUNT(*) as total FROM programs"
    );
    const totalPrograms = programsResult[0]?.total || 0;

    // Test 5: Query test - Get sample user
    const sampleUsers = await db.query<any[]>(
      "SELECT id, name, email, role FROM users LIMIT 3"
    );

    // Test 6: Get database info
    const dbInfo = await db.query<any[]>("SELECT DATABASE() as db_name");
    const databaseName = dbInfo[0]?.db_name;

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      data: {
        connected: true,
        database: databaseName,
        totalTables: tables.length,
        tables: tables.map((t: any) => Object.values(t)[0]),
        statistics: {
          users: totalUsers,
          programs: totalPrograms,
        },
        sampleUsers: sampleUsers,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("❌ Database test error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database test failed",
        error: error.message,
        details: {
          code: error.code,
          errno: error.errno,
          sqlState: error.sqlState,
        },
      },
      { status: 500 }
    );
  }
}
