// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Validation schema (manual, bisa pakai Zod juga)
function validateContactForm(data: any) {
  const errors: any = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Nama minimal 2 karakter";
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Email tidak valid";
  }

  if (!data.phone || data.phone.trim().length < 10) {
    errors.phone = "Nomor telepon minimal 10 digit";
  }

  if (!data.subject || data.subject.trim().length < 3) {
    errors.subject = "Subject minimal 3 karakter";
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = "Pesan minimal 10 karakter";
  }

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const errors = validateContactForm(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = body;

    // Insert into database
    const query = `
      INSERT INTO contacts (name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'unread')
    `;

    await db.query(query, [
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      subject.trim(),
      message.trim(),
    ]);

    // TODO: Send email notification (optional)
    // await sendEmailNotification({ name, email, subject, message });

    return NextResponse.json(
      {
        success: true,
        message:
          "Terima kasih! Pesan Anda telah diterima. Kami akan segera menghubungi Anda.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error saving contact:", error);
    return NextResponse.json(
      {
        error: "Failed to submit contact form",
        message:
          "Terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// GET method untuk admin (optional - untuk list contacts)
export async function GET(request: NextRequest) {
  try {
    // This should be protected with auth in production
    const contacts = await db.query<any[]>(
      `SELECT id, name, email, phone, subject, status, created_at
       FROM contacts
       ORDER BY created_at DESC
       LIMIT 50`
    );

    return NextResponse.json(contacts);
  } catch (error: any) {
    console.error("❌ Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts", message: error.message },
      { status: 500 }
    );
  }
}
