// ============================================
// SINGLE PROGRAM API
// GET /api/programs/[slug]
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { programRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/programs/[slug]
 * Get single program by slug
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = params;

    // Get program by slug
    const program = await programRepository.findBySlug(slug);

    if (!program) {
      return NextResponse.json(
        {
          success: false,
          message: "Program tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Check if published (for public access)
    if (program.status !== "published") {
      return NextResponse.json(
        {
          success: false,
          message: "Program tidak tersedia",
        },
        { status: 404 }
      );
    }

    // Increment view count (async, don't wait)
    programRepository.incrementViews(program.id).catch(console.error);

    return NextResponse.json({
      success: true,
      data: program,
    });
  } catch (error: any) {
    console.error("Get program error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch program",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
