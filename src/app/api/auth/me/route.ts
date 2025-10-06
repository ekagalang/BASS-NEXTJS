// ============================================
// GET CURRENT USER API
// GET /api/auth/me
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { extractToken, getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization");
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token tidak ditemukan",
        },
        { status: 401 }
      );
    }

    // Get user from token
    const user = await getAuthUser(token);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User tidak ditemukan atau session expired",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error: any) {
    console.error("Get user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
