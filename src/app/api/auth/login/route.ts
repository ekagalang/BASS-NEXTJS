// ============================================
// LOGIN API
// POST /api/auth/login
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { authenticateUser, generateToken, createSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/login
 * Login user dengan email & password
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Authenticate user
    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau password salah",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create session in database
    await createSession(user.id, token);

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat login",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
