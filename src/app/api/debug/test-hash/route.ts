// ============================================
// DEBUG HASH API
// POST /api/debug/test-hash
// ============================================

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/debug/test-hash
 * Debug password hashing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User tidak ditemukan",
        email: email,
      });
    }

    // Generate new hash untuk comparison
    const newHash = await bcrypt.hash(password, 10);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    return NextResponse.json({
      success: true,
      debug: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        password_check: {
          input_password: password,
          stored_hash: user.password,
          stored_hash_length: user.password.length,
          stored_hash_prefix: user.password.substring(0, 7),
          new_hash_for_same_password: newHash,
          new_hash_prefix: newHash.substring(0, 7),
          passwords_match: isMatch,
          bcrypt_version_stored: user.password.substring(0, 4),
          bcrypt_version_new: newHash.substring(0, 4),
        },
      },
    });
  } catch (error: any) {
    console.error("Debug hash error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error during debug",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/debug/test-hash
 * Generate new hash for testing
 */
export async function GET(request: NextRequest) {
  try {
    const password = "admin123";

    // Generate 3 different hashes for same password
    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(password, 10);
    const hash3 = await bcrypt.hash(password, 10);

    // Test compare
    const match1 = await bcrypt.compare(password, hash1);
    const match2 = await bcrypt.compare(password, hash2);
    const match3 = await bcrypt.compare(password, hash3);

    return NextResponse.json({
      success: true,
      message: "Hash generated successfully",
      data: {
        password: password,
        hashes: {
          hash1: {
            value: hash1,
            matches: match1,
          },
          hash2: {
            value: hash2,
            matches: match2,
          },
          hash3: {
            value: hash3,
            matches: match3,
          },
        },
        note: "Copy salah satu hash ini dan update ke database",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
