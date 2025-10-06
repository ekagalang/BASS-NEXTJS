// src/app/api/programs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const category_id = searchParams.get("category_id");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Build WHERE clause
    const whereClauses: string[] = ["p.status = ?"];
    const params: any[] = ["active"];

    if (category_id) {
      whereClauses.push("p.category_id = ?");
      params.push(parseInt(category_id));
    }

    if (search) {
      whereClauses.push("(p.title LIKE ? OR p.description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereClauses.join(" AND ");

    // Whitelist allowed sort columns
    const allowedSortColumns = ["id", "title", "price", "created_at", "views"];
    const safeOrderBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const safeOrderDirection = sortOrder === "asc" ? "ASC" : "DESC";

    // Count total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM programs p 
      WHERE ${whereClause}
    `;
    const countResult = await db.query<any[]>(countQuery, params);
    const total = countResult[0]?.total || 0;

    // Fetch programs with category
    const query = `
      SELECT 
        p.*,
        pc.name as category_name,
        pc.slug as category_slug
      FROM programs p
      LEFT JOIN program_categories pc ON p.category_id = pc.id
      WHERE ${whereClause}
      ORDER BY p.${safeOrderBy} ${safeOrderDirection}
      LIMIT ? OFFSET ?
    `;

    const programs = await db.query<any[]>(query, [...params, limit, offset]);

    // Transform data
    const transformedData = programs.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      excerpt: row.excerpt,
      featured_image: row.featured_image,
      price: row.price,
      duration: row.duration,
      max_participants: row.max_participants,
      certification_type: row.certification_type,
      category_id: row.category_id,
      status: row.status,
      views: row.views,
      created_at: row.created_at,
      category: row.category_id
        ? {
            name: row.category_name,
            slug: row.category_slug,
          }
        : null,
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
    console.error("❌ Error fetching programs:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch programs",
        message: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
