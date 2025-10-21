import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Fetch all program categories
    const categories = await prisma.programCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        parentId: true,
        displayOrder: true,
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ],
    });

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
