import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const category_id = searchParams.get("category_id");
    const search = searchParams.get("search");

    const offset = (page - 1) * limit;

    // Build WHERE clause
    const whereClauses: string[] = ["p.status = ?", "p.published_at <= NOW()"];
    const params: any[] = ["published"];

    if (category_id) {
      whereClauses.push("p.category_id = ?");
      params.push(parseInt(category_id));
    }

    if (search) {
      whereClauses.push(
        "(p.title LIKE ? OR p.content LIKE ? OR p.excerpt LIKE ?)"
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = whereClauses.join(" AND ");

    // Count total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM posts p 
      WHERE ${whereClause}
    `;
    const countResult = await db.query<any[]>(countQuery, params);
    const total = countResult[0]?.total || 0;

    // Fetch posts with category and author
    const query = `
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.featured_image,
        p.category_id,
        p.author_id,
        p.views,
        p.published_at,
        p.created_at,
        pc.name as category_name,
        pc.slug as category_slug,
        u.name as author_name
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE ${whereClause}
      ORDER BY p.published_at DESC
      LIMIT ? OFFSET ?
    `;

    const posts = await db.query<any[]>(query, [...params, limit, offset]);

    // Transform data
    const transformedData = posts.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      featured_image: row.featured_image,
      category_id: row.category_id,
      author_id: row.author_id,
      views: row.views,
      published_at: row.published_at,
      created_at: row.created_at,
      category: row.category_id
        ? {
            name: row.category_name,
            slug: row.category_slug,
          }
        : null,
      author: {
        name: row.author_name,
      },
    }));

    return NextResponse.json(
      {
        data: transformedData,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("❌ Error fetching posts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch posts",
        message: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
