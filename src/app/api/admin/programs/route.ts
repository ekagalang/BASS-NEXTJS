// ============================================
// ADMIN PROGRAMS API
// GET/POST /api/admin/programs
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware/auth.middleware";
import { programRepository } from "@/lib/repositories";
import { programSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/programs
 * Get all programs (admin can see all status)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);

    // Parse pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sort_by") || "created_at";
    const sortOrder = (searchParams.get("sort_order") || "desc") as
      | "asc"
      | "desc";

    // Parse filter params (admin can filter by any status)
    const filters: any = {};

    if (searchParams.get("category_id")) {
      filters.category_id = parseInt(searchParams.get("category_id")!);
    }

    if (searchParams.get("instructor_id")) {
      filters.instructor_id = parseInt(searchParams.get("instructor_id")!);
    }

    if (searchParams.get("status")) {
      filters.status = searchParams.get("status")!;
    }

    if (searchParams.get("search")) {
      filters.search = searchParams.get("search")!;
    }

    // Get programs from repository
    const result = await programRepository.findAllWithFilters(filters, {
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return NextResponse.json({
      success: true,
      data: {
        data: result.data,
        pagination: result.pagination,
      },
    });
  } catch (error: any) {
    console.error("Admin get programs error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch programs",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/programs
 * Create new program
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();

    // Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title);
    }

    // Convert benefits array to JSON string if provided
    if (body.benefits && Array.isArray(body.benefits)) {
      body.benefits = JSON.stringify(body.benefits);
    }

    // Validate input
    const validation = programSchema.safeParse(body);

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

    const data = validation.data;

    // Check if slug already exists
    const existingProgram = await programRepository.findOneBy(
      "slug",
      data.slug
    );
    if (existingProgram) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists",
        },
        { status: 400 }
      );
    }

    // Create program
    const programId = await programRepository.create({
      ...data,
      benefits: data.benefits ? JSON.stringify(data.benefits) : null,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Get created program
    const program = await programRepository.findById(programId);

    return NextResponse.json(
      {
        success: true,
        message: "Program berhasil dibuat",
        data: program,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin create program error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create program",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
