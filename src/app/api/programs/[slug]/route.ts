// src/app/api/programs/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch program with category
    const query = `
      SELECT 
        p.*,
        pc.name as category_name,
        pc.slug as category_slug
      FROM programs p
      LEFT JOIN program_categories pc ON p.category_id = pc.id
      WHERE p.slug = ?
      LIMIT 1
    `;

    const results = await db.query<any[]>(query, [slug]);

    if (results.length === 0) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    const program = results[0];

    // Fetch instructors for this program
    const instructorsQuery = `
      SELECT 
        i.id,
        i.name,
        i.slug,
        i.level,
        i.bio,
        i.expertise
      FROM instructors i
      INNER JOIN program_instructors pi ON i.id = pi.instructor_id
      WHERE pi.program_id = ? AND i.status = 'active'
      ORDER BY i.display_order ASC
    `;

    const instructors = await db.query<any[]>(instructorsQuery, [program.id]);

    // Fetch schedules for this program
    const schedulesQuery = `
      SELECT 
        id,
        start_date,
        end_date,
        start_time,
        end_time,
        location,
        address,
        max_seats,
        available_seats,
        price,
        status
      FROM schedules
      WHERE program_id = ? AND status = 'upcoming'
      ORDER BY start_date ASC
      LIMIT 5
    `;

    const schedules = await db.query<any[]>(schedulesQuery, [program.id]);

    // Transform schedules (no calculation needed, available_seats already in DB)
    const schedulesWithSeats = schedules.map((schedule) => ({
      ...schedule,
      max_participants: schedule.max_seats,
      registered_participants: schedule.max_seats - schedule.available_seats,
    }));

    // Increment views
    await db.query("UPDATE programs SET views = views + 1 WHERE id = ?", [
      program.id,
    ]);

    // Build response
    const response = {
      id: program.id,
      title: program.title,
      slug: program.slug,
      description: program.description || program.content || "",
      excerpt: program.excerpt || "",
      featured_image: program.featured_image,
      learning_objectives: program.learning_objectives || "",
      target_participants: program.target_participants || "",
      requirements: program.requirements || "",
      price: program.price,
      duration: program.duration,
      max_participants: program.max_participants || 20,
      certification_type: program.certification_type,
      category_id: program.category_id,
      status: program.status,
      views: program.views,
      meta_title: program.meta_title,
      meta_description: program.meta_description,
      created_at: program.created_at,
      updated_at: program.updated_at,
      category: program.category_id
        ? {
            name: program.category_name,
            slug: program.category_slug,
          }
        : null,
      instructors: instructors.map((i) => ({
        ...i,
        expertise: i.expertise ? JSON.parse(i.expertise) : [],
      })),
      schedules: schedulesWithSeats,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error: any) {
    console.error("❌ Error fetching program:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch program",
        message: error.message,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
