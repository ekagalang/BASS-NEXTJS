// ============================================
// SINGLE POST API
// GET /api/posts/[slug]
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { postRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/posts/[slug]
 * Get single post by slug
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params;

    // Get post by slug
    const post = await postRepository.findBySlug(slug);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Check if published
    if (post.status !== "published") {
      return NextResponse.json(
        {
          success: false,
          message: "Post tidak tersedia",
        },
        { status: 404 }
      );
    }

    // Check if published date is in the past
    if (post.published_at && new Date(post.published_at) > new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Post belum dipublikasikan",
        },
        { status: 404 }
      );
    }

    // Increment view count (async, don't wait)
    postRepository.incrementViews(post.id).catch(console.error);

    // Get related posts
    let relatedPosts = [];
    if (post.category_id) {
      relatedPosts = await postRepository.getRelated(
        post.id,
        post.category_id,
        3
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        post,
        related: relatedPosts,
      },
    });
  } catch (error: any) {
    console.error("Get post error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch post",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
