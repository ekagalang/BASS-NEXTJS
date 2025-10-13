import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const query = `
      SELECT 
        id,
        title,
        slug,
        content,
        template,
        meta_title,
        meta_description,
        created_at,
        updated_at
      FROM pages
      WHERE slug = ? AND status = 'published'
      LIMIT 1
    `;

    const results = await db.query<any[]>(query, [slug]);

    if (results.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(results[0], {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetching page:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch page",
        message: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
