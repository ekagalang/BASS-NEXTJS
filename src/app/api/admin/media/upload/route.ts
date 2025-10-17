// ============================================
// MEDIA UPLOAD API
// POST /api/admin/media/upload
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { mediaRepository } from "@/lib/repositories";
import { verifyToken } from "@/lib/auth";

// Disable default body parser for file uploads
export const runtime = "nodejs";

// Helper: Generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  const safeName = nameWithoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .substring(0, 50);

  return `${safeName}-${timestamp}-${random}${ext}`;
}

// Helper: Get file dimensions for images
async function getImageDimensions(
  buffer: Buffer,
  mimeType: string
): Promise<{ width?: number; height?: number }> {
  // For now, return empty - can implement with sharp or image-size package later
  return {};
}

// Helper: Validate file
function validateFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "video/mp4",
    "video/webm",
  ];

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File "${file.name}" exceeds maximum size of 10MB`,
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type "${file.type}" is not allowed`,
    };
  }

  return { isValid: true };
}

export async function POST(request: NextRequest) {
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

    const userId = decoded.userId;

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files provided" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Process each file
    const uploadedFiles = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validate file
        const validation = validateFile(file);
        if (!validation.isValid) {
          errors.push({
            filename: file.name,
            error: validation.error,
          });
          continue;
        }

        // Generate unique filename
        const filename = generateUniqueFilename(file.name);
        const filePath = path.join(uploadsDir, filename);
        const fileUrl = `/uploads/${filename}`;

        // Convert File to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Get image dimensions if it's an image
        let dimensions = {};
        if (file.type.startsWith("image/")) {
          dimensions = await getImageDimensions(buffer, file.type);
        }

        // Save file to disk
        await writeFile(filePath, buffer);

        // Save to database
        const mediaId = await mediaRepository.create({
          filename,
          original_name: file.name,
          path: filePath,
          url: fileUrl,
          mime_type: file.type,
          size: file.size,
          width: dimensions.width || null,
          height: dimensions.height || null,
          uploaded_by: userId,
        });

        // Get the created media record
        const mediaRecord = await mediaRepository.findById(mediaId);

        uploadedFiles.push(mediaRecord);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        errors.push({
          filename: file.name,
          error: "Failed to upload file",
        });
      }
    }

    // Return response
    if (uploadedFiles.length === 0 && errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "All uploads failed",
          errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      data: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Media upload error:", error);
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
