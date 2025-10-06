// ============================================
// NEWSLETTER SUBSCRIPTION API
// POST /api/newsletter
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { generateRandomToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/newsletter
 * Subscribe to newsletter
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validation = newsletterSchema.safeParse(body);

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

    const { email, name } = validation.data;

    // Check if email already exists
    const existing = await db.query<any[]>(
      "SELECT id, status FROM newsletter_subscribers WHERE email = ? LIMIT 1",
      [email]
    );

    if (existing.length > 0) {
      const subscriber = existing[0];

      if (subscriber.status === "active") {
        return NextResponse.json(
          {
            success: false,
            message: "Email ini sudah terdaftar di newsletter kami.",
          },
          { status: 400 }
        );
      }

      // Reactivate if unsubscribed
      await db.query(
        "UPDATE newsletter_subscribers SET status = ?, subscribed_at = NOW() WHERE id = ?",
        ["active", subscriber.id]
      );

      return NextResponse.json({
        success: true,
        message: "Terima kasih! Anda telah berlangganan newsletter kami.",
      });
    }

    // Generate unsubscribe token
    const token = generateRandomToken(32);

    // Insert new subscriber
    await db.query(
      `INSERT INTO newsletter_subscribers (email, name, status, token, subscribed_at)
       VALUES (?, ?, 'active', ?, NOW())`,
      [email, name || null, token]
    );

    // TODO: Send welcome email (optional)
    // await sendWelcomeEmail({ email, name, token });

    return NextResponse.json({
      success: true,
      message: "Terima kasih! Anda telah berlangganan newsletter kami.",
    });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mendaftar newsletter. Silakan coba lagi.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
