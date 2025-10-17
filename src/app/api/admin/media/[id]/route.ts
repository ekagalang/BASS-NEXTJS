// ============================================
// MEDIA DELETE API
// DELETE /api/admin/media/[id]
// GET /api/admin/media/[id]
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import { mediaRepository } from "@/lib/repositories";
import { verifyToken } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Verify authentication
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const mediaId = parseInt(id);

    if (isNaN(mediaId)) {
      return NextResponse.json(
        { success: false, message: "Invalid media ID" },
        { status: 400 }
      );
    }

    const media = await mediaRepository.findById(mediaId);

    if (!media) {
      return NextResponse.json(
        { success: false, message: "Media not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error("Media get error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Verify authentication
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const mediaId = parseInt(id);

    if (isNaN(mediaId)) {
      return NextResponse.json(
        { success: false, message: "Invalid media ID" },
        { status: 400 }
      );
    }

    // Get media record
    const media = await mediaRepository.findById(mediaId);

    if (!media) {
      return NextResponse.json(
        { success: false, message: "Media not found" },
        { status: 404 }
      );
    }

    // Delete file from disk
    if (existsSync(media.path)) {
      try {
        await unlink(media.path);
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
        // Continue even if file deletion fails
      }
    }

    // Delete from database
    const deleted = await mediaRepository.delete(mediaId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Failed to delete media record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.error("Media delete error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
