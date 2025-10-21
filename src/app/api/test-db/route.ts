// ============================================
// TEST DATABASE CONNECTION API
// Endpoint untuk test koneksi database
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/test-db
 * Test database connection dan query
 */
export async function GET(request: NextRequest) {
  try {
    // Test 1: Basic connection
    console.log("🔍 Testing database connection...");
    await prisma.$queryRaw`SELECT 1`;

    // Test 2: Get users count
    const totalUsers = await prisma.user.count();

    // Test 3: Get programs count
    const totalPrograms = await prisma.program.count();

    // Test 4: Get sample users
    const sampleUsers = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Test 5: Get database info
    const dbInfo = await prisma.$queryRaw<
      Array<{ db_name: string }>
    >`SELECT DATABASE() as db_name`;
    const databaseName = dbInfo[0]?.db_name;

    // Test 6: Get table names
    const tables = await prisma.$queryRaw<
      Array<{ TABLE_NAME: string }>
    >`SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()`;

    return NextResponse.json({
      success: true,
      message: "Database connection successful!",
      data: {
        connected: true,
        database: databaseName,
        totalTables: tables.length,
        tables: tables.map((t) => t.TABLE_NAME),
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
