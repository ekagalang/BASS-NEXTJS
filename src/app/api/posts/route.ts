// ============================================
// POSTS LIST API
// GET /api/posts
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { postRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

/**
 * GET /api/posts
 * Get list of posts/blog with filters and pagination
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - category_id: number
 * - search: string
 * - sort_by: string (default: 'published_at')
 * - sort_order: 'asc' | 'desc' (default: 'desc')
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse pagination params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sort_by") || "published_at";
    const sortOrder = (searchParams.get("sort_order") || "desc") as
      | "asc"
      | "desc";

    // Parse filter params
    const filters: any = {
      status: "published", // Only published posts for public
    };

    if (searchParams.get("category_id")) {
      filters.category_id = parseInt(searchParams.get("category_id")!);
    }

    if (searchParams.get("search")) {
      filters.search = searchParams.get("search")!;
    }

    // Get posts from repository
    const result = await postRepository.findAllWithFilters(filters, {
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
    console.error("Get posts error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch posts",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
