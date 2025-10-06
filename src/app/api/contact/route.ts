// ============================================
// CONTACT FORM API
// POST /api/contact
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/contact
 * Submit contact form
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = contactSchema.safeParse(body);

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

    const { name, email, phone, subject, message } = validation.data;

    // Get client IP and user agent
    const ip_address =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const user_agent = request.headers.get("user-agent") || "unknown";

    // Insert to database
    await db.query(
      `INSERT INTO contacts (name, email, phone, subject, message, status, ip_address, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, 'unread', ?, ?, NOW())`,
      [
        name,
        email,
        phone || null,
        subject || null,
        message,
        ip_address,
        user_agent,
      ]
    );

    // TODO: Send email notification to admin (optional)
    // await sendEmailNotification({ name, email, message });

    return NextResponse.json({
      success: true,
      message: "Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.",
    });
  } catch (error: any) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengirim pesan. Silakan coba lagi.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
