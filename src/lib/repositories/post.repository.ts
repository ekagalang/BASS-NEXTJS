// ============================================
// POST REPOSITORY
// Database operations untuk posts/blog
// ============================================

import {
  BaseRepository,
  PaginatedResult,
  PaginationOptions,
} from "./base.repository";
import { db } from "@/lib/db";
import type { Post, PostWithRelations } from "@/types/database";

interface PostFilters {
  category_id?: number;
  author_id?: number;
  status?: string;
  search?: string;
}

class PostRepository extends BaseRepository<Post> {
  constructor() {
    super("posts");
  }

  /**
   * Find all posts with filters and pagination
   */
  async findAllWithFilters(
    filters: PostFilters,
    options: PaginationOptions
  ): Promise<PaginatedResult<PostWithRelations>> {
    const {
      page = 1,
      limit = 10,
      sortBy = "published_at",
      sortOrder = "desc",
    } = options;
    const offset = (page - 1) * limit;

    // Whitelist allowed sort columns
    const allowedSortColumns = [
      "id",
      "title",
      "published_at",
      "created_at",
      "updated_at",
      "views",
    ];
    const safeOrderBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "published_at";
    const safeOrderDirection = sortOrder === "asc" ? "ASC" : "DESC";

    // Build WHERE clause
    const whereClauses: string[] = [];
    const params: any[] = [];

    if (filters.category_id) {
      whereClauses.push("p.category_id = ?");
      params.push(filters.category_id);
    }

    if (filters.author_id) {
      whereClauses.push("p.author_id = ?");
      params.push(filters.author_id);
    }

    if (filters.status) {
      whereClauses.push("p.status = ?");
      params.push(filters.status);
    }

    if (filters.search) {
      whereClauses.push(
        "(p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)"
      );
      params.push(
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`
      );
    }

    const whereClause =
      whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : "";

    // Count total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM posts p 
      ${whereClause}
    `;
    const countResult = await db.query<any[]>(
      countQuery,
      params.length > 0 ? params : undefined
    );
    const total = countResult[0].total;

    // Get data with relations
    const dataQuery = `
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.content,
        p.excerpt,
        p.featured_image,
        p.category_id,
        p.author_id,
        p.status,
        p.views,
        p.published_at,
        p.meta_title,
        p.meta_description,
        p.created_at,
        p.updated_at,
        pc.name as category_name,
        pc.slug as category_slug,
        u.name as author_name,
        u.email as author_email,
        u.avatar as author_avatar
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      LEFT JOIN users u ON p.author_id = u.id
      ${whereClause}
      ORDER BY p.${safeOrderBy} ${safeOrderDirection}
      LIMIT ? OFFSET ?
    `;

    const queryParams =
      params.length > 0 ? [...params, limit, offset] : [limit, offset];
    const data = await db.query<any[]>(dataQuery, queryParams);

    // Transform data
    const transformedData: PostWithRelations[] = data.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      excerpt: row.excerpt,
      featured_image: row.featured_image,
      category_id: row.category_id,
      author_id: row.author_id,
      status: row.status,
      views: row.views,
      published_at: row.published_at,
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
      author: {
        id: row.author_id,
        name: row.author_name,
        email: row.author_email,
        avatar: row.author_avatar,
      },
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
   * Find post by slug with relations
   */
  async findBySlug(slug: string): Promise<PostWithRelations | null> {
    const query = `
      SELECT 
        p.*,
        pc.name as category_name,
        pc.slug as category_slug,
        u.name as author_name,
        u.email as author_email,
        u.avatar as author_avatar
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      LEFT JOIN users u ON p.author_id = u.id
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
      content: row.content,
      excerpt: row.excerpt,
      featured_image: row.featured_image,
      category_id: row.category_id,
      author_id: row.author_id,
      status: row.status,
      views: row.views,
      published_at: row.published_at,
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
      author: {
        id: row.author_id,
        name: row.author_name,
        email: row.author_email,
        avatar: row.author_avatar,
      },
    };
  }

  /**
   * Increment view count
   */
  async incrementViews(id: number): Promise<void> {
    await db.query("UPDATE posts SET views = views + 1 WHERE id = ?", [id]);
  }

  /**
   * Get latest posts
   */
  async getLatest(limit: number = 5): Promise<PostWithRelations[]> {
    const query = `
      SELECT 
        p.*,
        pc.name as category_name,
        u.name as author_name
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published' AND p.published_at <= NOW()
      ORDER BY p.published_at DESC
      LIMIT ?
    `;

    const results = await db.query<any[]>(query, [limit]);

    return results.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      excerpt: row.excerpt,
      featured_image: row.featured_image,
      category_id: row.category_id,
      author_id: row.author_id,
      status: row.status,
      views: row.views,
      published_at: row.published_at,
      meta_title: row.meta_title,
      meta_description: row.meta_description,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: row.category_id
        ? {
            name: row.category_name,
          }
        : undefined,
      author: {
        name: row.author_name,
      },
    }));
  }

  /**
   * Get related posts (same category)
   */
  async getRelated(
    postId: number,
    categoryId: number,
    limit: number = 3
  ): Promise<PostWithRelations[]> {
    const query = `
      SELECT 
        p.*,
        pc.name as category_name
      FROM posts p
      LEFT JOIN post_categories pc ON p.category_id = pc.id
      WHERE p.status = 'published' 
        AND p.category_id = ?
        AND p.id != ?
        AND p.published_at <= NOW()
      ORDER BY p.published_at DESC
      LIMIT ?
    `;

    const results = await db.query<any[]>(query, [categoryId, postId, limit]);

    return results.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      featured_image: row.featured_image,
      category_id: row.category_id,
      author_id: row.author_id,
      status: row.status,
      views: row.views,
      published_at: row.published_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      category: {
        name: row.category_name,
      },
    }));
  }
}

// Export singleton instance
export const postRepository = new PostRepository();
