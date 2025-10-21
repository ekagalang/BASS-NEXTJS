// ============================================
// ADMIN POSTS API
// GET /api/admin/posts - List all posts with pagination
// POST /api/admin/posts - Create new post
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware/auth.middleware";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/posts
 * Get all posts with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const offset = (page - 1) * limit;

    // Build Prisma where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    // Get total count
    const total = await prisma.post.count({ where });

    // Get posts with category relation
    const posts = await prisma.post.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: limit,
    });

    // Transform data to match expected response format
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featured_image: post.featuredImage,
      status: post.status,
      published_at: post.publishedAt,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      category_id: post.category?.id || null,
      category_name: post.category?.name || null,
      category_slug: post.category?.slug || null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        data: transformedPosts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch posts",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/posts
 * Create a new post
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    // Parse request body
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      category_id,
      status,
      published_at,
    } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, message: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Convert published_at to Date object
    let publishedAtDate = null;
    if (published_at) {
      publishedAtDate = new Date(published_at);
    }

    // Create post with Prisma
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        featuredImage: featured_image || null,
        categoryId: category_id || null,
        status: status || "draft",
        publishedAt: publishedAtDate,
        authorId: authResult.user.id,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Transform response to match expected format
    const transformedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featuredImage,
      category_id: post.categoryId,
      status: post.status,
      published_at: post.publishedAt,
      author_id: post.authorId,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      category_name: post.category?.name || null,
      category_slug: post.category?.slug || null,
    };

    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      data: transformedPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create post",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
