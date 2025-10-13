// ============================================
// ADMIN POSTS API
// GET /api/admin/posts - List all posts with pagination
// POST /api/admin/posts - Create new post
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
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

    // Build WHERE clause
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`p.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (search) {
      conditions.push(`(p.title ILIKE $${paramIndex} OR p.excerpt ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countResult = await query(
      `SELECT COUNT(*) as total FROM posts p ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total);

    // Get posts
    const postsQuery = `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.featured_image,
        p.status,
        p.published_at,
        p.created_at,
        p.updated_at,
        pc.id as category_id,
        pc.name as category_name,
        pc.slug as category_slug
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const postsResult = await query(postsQuery, [...params, limit, offset]);

    return NextResponse.json({
      success: true,
      data: {
        data: postsResult.rows,
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
      tags,
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

    // Insert post
    const result = await query(
      `INSERT INTO posts (
        title, slug, excerpt, content, featured_image,
        category_id, tags, status, published_at,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *`,
      [
        title,
        slug,
        excerpt || null,
        content,
        featured_image || null,
        category_id || null,
        tags || [],
        status || "draft",
        published_at || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      data: result.rows[0],
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
