import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch post with category and author
    const query = `
      SELECT 
        p.*,
        pc.name as category_name,
        pc.slug as category_slug,
        u.name as author_name,
        u.email as author_email
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.slug = ? AND p.status = 'published'
      LIMIT 1
    `;

    const results = await db.query<any[]>(query, [slug]);

    if (results.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = results[0];

    // Increment views
    await db.query("UPDATE posts SET views = views + 1 WHERE id = ?", [
      post.id,
    ]);

    // Build response
    const response = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      category_id: post.category_id,
      author_id: post.author_id,
      status: post.status,
      views: post.views,
      published_at: post.published_at,
      meta_title: post.meta_title,
      meta_description: post.meta_description,
      created_at: post.created_at,
      updated_at: post.updated_at,
      category: post.category_id
        ? {
            name: post.category_name,
            slug: post.category_slug,
          }
        : null,
      author: {
        name: post.author_name,
        email: post.author_email,
      },
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
