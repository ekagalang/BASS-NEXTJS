import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Fetch all program categories
    const categories = await db.query<any[]>(
      `SELECT id, name, slug, description, parent_id, display_order
       FROM program_categories
       ORDER BY display_order ASC, name ASC`
    );

    return NextResponse.json(categories, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetching program categories:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        message: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
