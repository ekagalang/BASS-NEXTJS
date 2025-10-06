// ============================================
// PROGRAMS LIST API
// GET /api/programs
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { programRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

/**
 * GET /api/programs
 * Get list of programs with filters and pagination
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - category_id: number
 * - instructor_id: number
 * - status: string (default: 'published' for public)
 * - search: string
 * - min_price: number
 * - max_price: number
 * - sort_by: string (default: 'created_at')
 * - sort_order: 'asc' | 'desc' (default: 'desc')
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sort_by") || "created_at";
    const sortOrder = (searchParams.get("sort_order") || "desc") as
      | "asc"
      | "desc";

    // Parse filter params
    const filters: any = {
      status: "published", // Default only show published programs for public
    };

    if (searchParams.get("category_id")) {
      filters.category_id = parseInt(searchParams.get("category_id")!);
    }

    if (searchParams.get("instructor_id")) {
      filters.instructor_id = parseInt(searchParams.get("instructor_id")!);
    }

    if (searchParams.get("search")) {
      filters.search = searchParams.get("search")!;
    }

    if (searchParams.get("min_price")) {
      filters.min_price = parseFloat(searchParams.get("min_price")!);
    }

    if (searchParams.get("max_price")) {
      filters.max_price = parseFloat(searchParams.get("max_price")!);
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
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Get programs error:", error);

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
