// ============================================
// PROGRAM REPOSITORY
// Database operations untuk programs
// Using Prisma ORM
// ============================================

import { prisma } from "@/lib/prisma";
import type {
  Program,
  ProgramCategory,
  Instructor,
  Prisma,
} from "@prisma/client";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProgramFilters {
  category_id?: number;
  instructor_id?: number;
  status?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
}

export type ProgramWithRelations = Program & {
  category?: ProgramCategory | null;
  instructor?: Instructor | null;
};

class ProgramRepository {
  /**
   * Find all programs with filters and pagination
   */
  async findAllWithFilters(
    filters: ProgramFilters,
    options: PaginationOptions
  ): Promise<PaginatedResult<ProgramWithRelations>> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProgramWhereInput = {};

    if (filters.category_id) {
      where.categoryId = filters.category_id;
    }

    if (filters.instructor_id) {
      where.instructorId = filters.instructor_id;
    }

    if (filters.status) {
      where.status = filters.status as any;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    if (filters.min_price !== undefined) {
      where.price = {
        ...where.price,
        gte: filters.min_price,
      };
    }

    if (filters.max_price !== undefined) {
      where.price = {
        ...where.price,
        lte: filters.max_price,
      };
    }

    // Validate sortBy
    const allowedSortColumns = [
      "id",
      "title",
      "price",
      "createdAt",
      "updatedAt",
      "views",
    ];
    const safeSortBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "createdAt";

    // Get total count
    const total = await prisma.program.count({ where });

    // Get data
    const data = await prisma.program.findMany({
      where,
      include: {
        category: true,
        instructor: true,
      },
      orderBy: { [safeSortBy]: sortOrder },
      skip,
      take: limit,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find program by slug with relations
   */
  async findBySlug(slug: string): Promise<ProgramWithRelations | null> {
    return await prisma.program.findUnique({
      where: { slug },
      include: {
        category: true,
        instructor: true,
      },
    });
  }

  /**
   * Find program by ID with relations
   */
  async findById(id: number): Promise<ProgramWithRelations | null> {
    return await prisma.program.findUnique({
      where: { id },
      include: {
        category: true,
        instructor: true,
      },
    });
  }

  /**
   * Increment view count
   */
  async incrementViews(id: number): Promise<void> {
    await prisma.program.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Get featured programs
   */
  async getFeatured(limit: number = 6): Promise<ProgramWithRelations[]> {
    return await prisma.program.findMany({
      where: {
        status: "published",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        instructor: {
          select: {
            id: true,
            name: true,
            slug: true,
            photo: true,
            bio: true,
            expertise: true,
            experience: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: [{ views: "desc" }, { createdAt: "desc" }],
      take: limit,
    });
  }

  /**
   * Create new program
   */
  async create(data: Prisma.ProgramCreateInput): Promise<Program> {
    return await prisma.program.create({
      data,
    });
  }

  /**
   * Update program
   */
  async update(id: number, data: Prisma.ProgramUpdateInput): Promise<Program> {
    return await prisma.program.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete program
   */
  async delete(id: number): Promise<Program> {
    return await prisma.program.delete({
      where: { id },
    });
  }

  /**
   * Count programs by status
   */
  async countByStatus(status: string): Promise<number> {
    return await prisma.program.count({
      where: { status: status as any },
    });
  }

  /**
   * Get programs by category
   */
  async getByCategory(
    categoryId: number,
    limit: number = 10
  ): Promise<ProgramWithRelations[]> {
    return await prisma.program.findMany({
      where: {
        categoryId,
        status: "published",
      },
      include: {
        category: true,
        instructor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }

  /**
   * Get programs by instructor
   */
  async getByInstructor(
    instructorId: number,
    limit: number = 10
  ): Promise<ProgramWithRelations[]> {
    return await prisma.program.findMany({
      where: {
        instructorId,
        status: "published",
      },
      include: {
        category: true,
        instructor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }
}

// Export singleton instance
export const programRepository = new ProgramRepository();
