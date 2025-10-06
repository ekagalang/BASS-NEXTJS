// ============================================
// LOGOUT API
// POST /api/auth/logout
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { extractToken, deleteSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/logout
 * Logout user dan hapus session
 */
export async function POST(request: NextRequest) {
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

    // Delete session from database
    await deleteSession(token);

    return NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });
  } catch (error: any) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat logout",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
