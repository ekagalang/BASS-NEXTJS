// ============================================
// PROGRAM REPOSITORY
// Database operations untuk programs
// ============================================

import {
  BaseRepository,
  PaginatedResult,
  PaginationOptions,
} from "./base.repository";
import { db } from "@/lib/db";
import type { Program, ProgramWithRelations } from "@/types/database";

interface ProgramFilters {
  category_id?: number;
  instructor_id?: number;
  status?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
}

class ProgramRepository extends BaseRepository<Program> {
  constructor() {
    super("programs");
  }

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
      sortBy = "created_at",
      sortOrder = "desc",
    } = options;
    const offset = (page - 1) * limit;

    // Whitelist allowed sort columns untuk security
    const allowedSortColumns = [
      "id",
      "title",
      "price",
      "created_at",
      "updated_at",
      "views",
    ];
    const safeOrderBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const safeOrderDirection = sortOrder === "asc" ? "ASC" : "DESC";

    // Build WHERE clause
    const whereClauses: string[] = [];
    const params: any[] = [];

    if (filters.category_id) {
      whereClauses.push("p.category_id = ?");
      params.push(filters.category_id);
    }

    if (filters.instructor_id) {
      whereClauses.push("p.instructor_id = ?");
      params.push(filters.instructor_id);
    }

    if (filters.status) {
      whereClauses.push("p.status = ?");
      params.push(filters.status);
    }

    if (filters.search) {
      whereClauses.push("(p.title LIKE ? OR p.description LIKE ?)");
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.min_price !== undefined) {
      whereClauses.push("p.price >= ?");
      params.push(filters.min_price);
    }

    if (filters.max_price !== undefined) {
      whereClauses.push("p.price <= ?");
      params.push(filters.max_price);
    }

    const whereClause =
      whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

    // Count total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM programs p 
      ${whereClause}
    `;
    const countResult = await db.query<any[]>(
      countQuery,
      params.length > 0 ? params : undefined
    );
    const total = countResult[0].total;

    // Get data with relations
    // NOTE: ORDER BY tidak bisa pakai prepared statement parameter
    const dataQuery = `
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.category_id,
        p.description,
        p.content,
        p.image,
        p.duration,
        p.price,
        p.instructor_id,
        p.requirements,
        p.benefits,
        p.certificate,
        p.status,
        p.views,
        p.meta_title,
        p.meta_description,
        p.created_at,
        p.updated_at,
        pc.name as category_name,
        pc.slug as category_slug,
        i.name as instructor_name,
        i.slug as instructor_slug,
        i.photo as instructor_photo
      FROM programs p
      LEFT JOIN program_categories pc ON p.category_id = pc.id
      LEFT JOIN instructors i ON p.instructor_id = i.id
      ${whereClause}
      ORDER BY p.${safeOrderBy} ${safeOrderDirection}
      LIMIT ? OFFSET ?
    `;

    const queryParams =
      params.length > 0 ? [...params, limit, offset] : [limit, offset];
    const data = await db.query<any[]>(dataQuery, queryParams);

    // Transform data to include relations
    const transformedData: ProgramWithRelations[] = data.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      category_id: row.category_id,
      description: row.description,
      content: row.content,
      image: row.image,
      duration: row.duration,
      price: parseFloat(row.price),
      instructor_id: row.instructor_id,
      requirements: row.requirements,
      benefits: row.benefits ? JSON.parse(row.benefits) : null,
      certificate: row.certificate,
      status: row.status,
      views: row.views,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.category_id
        ? {
            id: row.category_id,
            name: row.category_name,
            slug: row.category_slug,
          }
        : undefined,
      instructor: row.instructor_id
        ? {
            id: row.instructor_id,
            name: row.instructor_name,
            slug: row.instructor_slug,
            photo: row.instructor_photo,
          }
        : undefined,
    }));

    return {
      data: transformedData,
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
    const query = `
      SELECT 
        p.*,
        pc.name as category_name,
        pc.slug as category_slug,
        i.name as instructor_name,
        i.slug as instructor_slug,
        i.photo as instructor_photo,
        i.bio as instructor_bio
      FROM programs p
      LEFT JOIN program_categories pc ON p.category_id = pc.id
      LEFT JOIN instructors i ON p.instructor_id = i.id
      WHERE p.slug = ?
      LIMIT 1
    `;

    const results = await db.query<any[]>(query, [slug]);

    if (results.length === 0) return null;

    const row = results[0];

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      category_id: row.category_id,
      description: row.description,
      content: row.content,
      image: row.image,
      duration: row.duration,
      price: row.price,
      instructor_id: row.instructor_id,
      requirements: row.requirements,
      benefits: row.benefits ? JSON.parse(row.benefits) : null,
      certificate: row.certificate,
      status: row.status,
      views: row.views,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.category_id
        ? {
            id: row.category_id,
            name: row.category_name,
            slug: row.category_slug,
          }
        : undefined,
      instructor: row.instructor_id
        ? {
            id: row.instructor_id,
            name: row.instructor_name,
            slug: row.instructor_slug,
            photo: row.instructor_photo,
            bio: row.instructor_bio,
          }
        : undefined,
    };
  }

  /**
   * Increment view count
   */
  async incrementViews(id: number): Promise<void> {
    await db.query("UPDATE programs SET views = views + 1 WHERE id = ?", [id]);
  }

  /**
   * Get featured programs
   */
  async getFeatured(limit: number = 6): Promise<ProgramWithRelations[]> {
    const query = `
      SELECT 
        p.*,
        pc.name as category_name,
        i.name as instructor_name
      FROM programs p
      LEFT JOIN program_categories pc ON p.category_id = pc.id
      LEFT JOIN instructors i ON p.instructor_id = i.id
      WHERE p.status = 'published'
      ORDER BY p.views DESC, p.created_at DESC
      LIMIT ?
    `;

    const results = await db.query<any[]>(query, [limit]);

    return results.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      category_id: row.category_id,
      description: row.description,
      content: row.content,
      image: row.image,
      duration: row.duration,
      price: row.price,
      instructor_id: row.instructor_id,
      requirements: row.requirements,
      benefits: row.benefits ? JSON.parse(row.benefits) : null,
      certificate: row.certificate,
      status: row.status,
      views: row.views,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.category_id
        ? {
            name: row.category_name,
          }
        : undefined,
      instructor: row.instructor_id
        ? {
            name: row.instructor_name,
          }
        : undefined,
    }));
  }
}

// Export singleton instance
export const programRepository = new ProgramRepository();
