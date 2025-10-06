// ============================================
// AUTH MIDDLEWARE
// Protect routes dengan authentication
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { extractToken, getAuthUser, type AuthUser } from "@/lib/auth";

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthUser;
}

/**
 * Middleware untuk check authentication
 * @param request Next request
 * @returns AuthUser or error response
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("Authorization");
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Token tidak ditemukan.",
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
          message: "Unauthorized. Session tidak valid atau expired.",
        },
        { status: 401 }
      );
    }

    return { user };
  } catch (error) {
    console.error("Auth middleware error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
      },
      { status: 401 }
    );
  }
}

/**
 * Middleware untuk check admin role
 * @param request Next request
 * @returns AuthUser or error response
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  const authResult = await requireAuth(request);

  // If auth failed, return error
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  // Check if user is admin
  if (user.role !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Forbidden. Admin access required.",
      },
      { status: 403 }
    );
  }

  return { user };
}

/**
 * Check if user has required roles
 * @param user Auth user
 * @param allowedRoles Allowed roles
 * @returns true if user has role
 */
export function hasRequiredRole(
  user: AuthUser,
  allowedRoles: string[]
): boolean {
  return allowedRoles.includes(user.role);
}

/**
 * Middleware untuk check specific roles
 * @param request Next request
 * @param allowedRoles Allowed roles
 * @returns AuthUser or error response
 */
export async function requireRoles(
  request: NextRequest,
  allowedRoles: string[]
): Promise<{ user: AuthUser } | NextResponse> {
  const authResult = await requireAuth(request);

  // If auth failed, return error
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  // Check if user has required role
  if (!hasRequiredRole(user, allowedRoles)) {
    return NextResponse.json(
      {
        success: false,
        message: `Forbidden. Required roles: ${allowedRoles.join(", ")}`,
      },
      { status: 403 }
    );
  }

  return { user };
}
