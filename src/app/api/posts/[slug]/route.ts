import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch post with category and author using Prisma
    const post = await prisma.post.findFirst({
      where: {
        slug: slug,
        status: "published",
      },
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
            email: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment views
    await prisma.post.update({
      where: { id: post.id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // Build response
    const response = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featured_image: post.featuredImage,
      category_id: post.categoryId,
      author_id: post.authorId,
      status: post.status,
      views: post.views,
      published_at: post.publishedAt,
      meta_title: post.metaTitle,
      meta_description: post.metaDescription,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      category: post.category,
      author: post.author,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetching post:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch post",
        message: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
