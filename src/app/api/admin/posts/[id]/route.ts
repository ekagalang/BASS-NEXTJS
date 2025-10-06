// ============================================
// ADMIN POSTS API
// GET/POST /api/admin/posts
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware/auth.middleware";
import { postRepository } from "@/lib/repositories";
import { postSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/posts
 * Get all posts (admin can see all status)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sort_by") || "created_at";
    const sortOrder = (searchParams.get("sort_order") || "desc") as
      | "asc"
      | "desc";

    const filters: any = {};

    if (searchParams.get("category_id")) {
      filters.category_id = parseInt(searchParams.get("category_id")!);
    }

    if (searchParams.get("status")) {
      filters.status = searchParams.get("status")!;
    }

    if (searchParams.get("search")) {
      filters.search = searchParams.get("search")!;
    }

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
    console.error("Admin get posts error:", error);

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

/**
 * POST /api/admin/posts
 * Create new post
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;
    const body = await request.json();

    // Auto-generate slug
    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title);
    }

    // Set author
    body.author_id = user.id;

    // Validate
    const validation = postSchema.safeParse(body);

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

    // Check slug exists
    const existingPost = await postRepository.findOneBy("slug", data.slug);
    if (existingPost) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug already exists",
        },
        { status: 400 }
      );
    }

    // Create post
    const postId = await postRepository.create({
      ...data,
      author_id: user.id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const post = await postRepository.findById(postId);

    return NextResponse.json(
      {
        success: true,
        message: "Post berhasil dibuat",
        data: post,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin create post error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create post",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
