// ============================================
// MEDIA LIST API
// GET /api/admin/media
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { mediaRepository } from "@/lib/repositories";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const mimeType = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let media;

    // Handle search
    if (search) {
      media = await mediaRepository.search(search);
    }
    // Handle filter by type
    else if (mimeType) {
      media = await mediaRepository.findByMimeType(mimeType);
    }
    // Default: get all with pagination
    else {
      const result = await mediaRepository.findAllPaginated({
        page,
        limit,
        sortBy: "created_at",
        sortOrder: "desc",
      });

      // Get stats
      const stats = await mediaRepository.getStats();

      return NextResponse.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        stats,
      });
    }

    return NextResponse.json({
      success: true,
      data: media,
      total: media.length,
    });
  } catch (error) {
    console.error("Media list error:", error);
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
