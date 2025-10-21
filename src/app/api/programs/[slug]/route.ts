// src/app/api/programs/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch program with relations using Prisma
    const program = await prisma.program.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        programInstructors: {
          where: {
            instructor: {
              status: "active",
            },
          },
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                slug: true,
                level: true,
                bio: true,
                expertise: true,
              },
            },
          },
          orderBy: {
            instructor: {
              displayOrder: "asc",
            },
          },
        },
        schedules: {
          where: {
            status: "upcoming",
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            startTime: true,
            endTime: true,
            location: true,
            address: true,
            maxSeats: true,
            availableSeats: true,
            price: true,
            status: true,
          },
          orderBy: {
            startDate: "asc",
          },
          take: 5,
        },
      },
    });

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    // Transform schedules with participant counts
    const schedulesWithSeats = program.schedules.map((schedule) => ({
      id: schedule.id,
      start_date: schedule.startDate,
      end_date: schedule.endDate,
      start_time: schedule.startTime,
      end_time: schedule.endTime,
      location: schedule.location,
      address: schedule.address,
      max_seats: schedule.maxSeats,
      available_seats: schedule.availableSeats,
      price: schedule.price,
      status: schedule.status,
      max_participants: schedule.maxSeats,
      registered_participants: schedule.maxSeats - schedule.availableSeats,
    }));

    // Transform instructors
    const instructors = program.programInstructors.map((pi) => ({
      id: pi.instructor.id,
      name: pi.instructor.name,
      slug: pi.instructor.slug,
      level: pi.instructor.level,
      bio: pi.instructor.bio,
      expertise: pi.instructor.expertise
        ? JSON.parse(pi.instructor.expertise as string)
        : [],
    }));

    // Increment views using Prisma
    await prisma.program.update({
      where: { id: program.id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // Build response
    // Note: Some fields referenced in the original code may not exist in the current schema
    // (e.g., excerpt, featured_image, learning_objectives, target_participants, max_participants, certification_type)
    // These are handled with fallbacks or omitted if not available in the schema
    const response = {
      id: program.id,
      title: program.title,
      slug: program.slug,
      description: program.description || program.content || "",
      excerpt: "", // Note: Field not in current Prisma schema
      featured_image: program.image, // Using 'image' field from schema
      learning_objectives: "", // Note: Field not in current Prisma schema
      target_participants: "", // Note: Field not in current Prisma schema
      requirements: program.requirements || "",
      price: program.price,
      duration: program.duration,
      max_participants: 20, // Note: Field not in current Prisma schema, using default
      certification_type: program.certificate, // Using 'certificate' field from schema
      category_id: program.categoryId,
      status: program.status,
      views: program.views + 1, // Return incremented value
      meta_title: program.metaTitle,
      meta_description: program.metaDescription,
      created_at: program.createdAt,
      updated_at: program.updatedAt,
      category: program.category
        ? {
            name: program.category.name,
            slug: program.category.slug,
          }
        : null,
      instructors,
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
