import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { postRepository } from "@/lib/repositories/post.repository";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const category_id = searchParams.get("category_id");
    const search = searchParams.get("search");

    // Build filters for Prisma
    const filters: any = {
      status: "published",
    };

    if (category_id) {
      filters.categoryId = parseInt(category_id);
    }

    if (search) {
      filters.search = search;
    }

    // Use Prisma to fetch posts with published date filter
    const where: any = {
      status: "published",
      publishedAt: {
        lte: new Date(),
      },
    };

    if (category_id) {
      where.categoryId = parseInt(category_id);
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    // Get total count
    const total = await prisma.post.count({ where });

    // Fetch posts with category and author
    const posts = await prisma.post.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Transform data to match expected format
    const transformedData = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      featured_image: post.featuredImage,
      category_id: post.categoryId,
      author_id: post.authorId,
      views: post.views,
      published_at: post.publishedAt,
      created_at: post.createdAt,
      category: post.category
        ? {
            name: post.category.name,
            slug: post.category.slug,
          }
        : null,
      author: {
        name: post.author.name,
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
