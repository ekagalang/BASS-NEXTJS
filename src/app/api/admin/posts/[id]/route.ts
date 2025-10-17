// ============================================
// ADMIN SINGLE POST API
// GET/PUT/DELETE /api/admin/posts/[id]
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware/auth.middleware";
import { postRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/posts/[id]
 * Get single post by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json(
        { success: false, message: "Invalid post ID" },
        { status: 400 }
      );
    }

    const post = await postRepository.findById(postId);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    console.error("Admin get post error:", error);

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

/**
 * PUT /api/admin/posts/[id]
 * Update post by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json(
        { success: false, message: "Invalid post ID" },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await postRepository.findById(postId);
    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

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

    // Check if slug is taken by another post
    if (slug !== existingPost.slug) {
      const slugExists = await postRepository.findOneBy("slug", slug);
      if (slugExists && slugExists.id !== postId) {
        return NextResponse.json(
          { success: false, message: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    // Convert published_at to MySQL datetime format
    let mysqlPublishedAt = null;
    if (published_at) {
      const date = new Date(published_at);
      // Format: YYYY-MM-DD HH:MM:SS
      mysqlPublishedAt = date.toISOString().slice(0, 19).replace('T', ' ');
    }

    // Update post (tags removed - column doesn't exist in schema)
    const updateData: any = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      featured_image: featured_image || null,
      category_id: category_id || null,
      status: status || "draft",
      published_at: mysqlPublishedAt,
      updated_at: new Date(),
    };

    const updated = await postRepository.update(postId, updateData);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Failed to update post" },
        { status: 500 }
      );
    }

    // Get updated post
    const updatedPost = await postRepository.findById(postId);

    return NextResponse.json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error: any) {
    console.error("Admin update post error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update post",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/posts/[id]
 * Delete post by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json(
        { success: false, message: "Invalid post ID" },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await postRepository.findById(postId);
    if (!existingPost) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Delete post
    const deleted = await postRepository.delete(postId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Failed to delete post" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error: any) {
    console.error("Admin delete post error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete post",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
