// src/app/api/programs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const category_id = searchParams.get("category_id");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    // Build WHERE clause
    const where: Prisma.ProgramWhereInput = {
      status: "published",
    };

    if (category_id) {
      where.categoryId = parseInt(category_id);
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Whitelist allowed sort columns (camelCase)
    const allowedSortColumns = ["id", "title", "price", "createdAt", "views"];
    const safeOrderBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "createdAt";
    const safeOrderDirection = sortOrder === "asc" ? "asc" : "desc";

    // Count total
    const total = await prisma.program.count({
      where,
    });

    // Fetch programs with category
    const programs = await prisma.program.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        [safeOrderBy]: safeOrderDirection,
      },
      skip,
      take: limit,
    });

    // Transform data
    const transformedData = programs.map((program) => ({
      id: program.id,
      title: program.title,
      slug: program.slug,
      description: program.description,
      excerpt: program.excerpt,
      featured_image: program.featuredImage,
      price: program.price,
      duration: program.duration,
      max_participants: program.maxParticipants,
      certification_type: program.certificationType,
      category_id: program.categoryId,
      status: program.status,
      views: program.views,
      created_at: program.createdAt,
      category: program.category
        ? {
            name: program.category.name,
            slug: program.category.slug,
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
    console.error("Error fetching programs:", error);
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
