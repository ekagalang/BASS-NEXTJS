// ============================================
// ADMIN SINGLE PROGRAM API
// GET/PUT/DELETE /api/admin/programs/[id]
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/middleware/auth.middleware";
import { programRepository } from "@/lib/repositories";
import { programSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/admin/programs/[id]
 * Get single program by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const programId = parseInt(params.id);

    if (isNaN(programId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid program ID",
        },
        { status: 400 }
      );
    }

    const program = await programRepository.findById(programId);

    if (!program) {
      return NextResponse.json(
        {
          success: false,
          message: "Program tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: program,
    });
  } catch (error: any) {
    console.error("Admin get program error:", error);

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

/**
 * PUT /api/admin/programs/[id]
 * Update program
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const programId = parseInt(params.id);

    if (isNaN(programId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid program ID",
        },
        { status: 400 }
      );
    }

    // Check if program exists
    const existingProgram = await programRepository.findById(programId);
    if (!existingProgram) {
      return NextResponse.json(
        {
          success: false,
          message: "Program tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Auto-generate slug if title changed
    if (body.title && !body.slug) {
      body.slug = generateSlug(body.title);
    }

    // Validate input (partial update)
    const validation = programSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check if slug already used by another program
    if (data.slug && data.slug !== existingProgram.slug) {
      const slugExists = await programRepository.findOneBy("slug", data.slug);
      if (slugExists && slugExists.id !== programId) {
        return NextResponse.json(
          {
            success: false,
            message: "Slug sudah digunakan",
          },
          { status: 400 }
        );
      }
    }

    // Update program
    const updateData: any = {
      ...data,
      updated_at: new Date(),
    };

    // Convert benefits to JSON if provided
    if (data.benefits) {
      updateData.benefits = JSON.stringify(data.benefits);
    }

    await programRepository.update(programId, updateData);

    // Get updated program
    const updatedProgram = await programRepository.findById(programId);

    return NextResponse.json({
      success: true,
      message: "Program berhasil diupdate",
      data: updatedProgram,
    });
  } catch (error: any) {
    console.error("Admin update program error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update program",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/programs/[id]
 * Delete program
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const programId = parseInt(params.id);

    if (isNaN(programId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid program ID",
        },
        { status: 400 }
      );
    }

    // Check if program exists
    const program = await programRepository.findById(programId);
    if (!program) {
      return NextResponse.json(
        {
          success: false,
          message: "Program tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Delete program
    await programRepository.delete(programId);

    // TODO: Delete related schedules, registrations, etc.

    return NextResponse.json({
      success: true,
      message: "Program berhasil dihapus",
    });
  } catch (error: any) {
    console.error("Admin delete program error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete program",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
