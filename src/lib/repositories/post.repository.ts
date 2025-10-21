// ============================================
// POST REPOSITORY
// Database operations untuk posts/blog
// Using Prisma ORM
// ============================================

import { prisma } from "@/lib/prisma";
import type { Post, User, PostCategory, Prisma } from "@prisma/client";

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

export interface PostFilters {
  categoryId?: number;
  authorId?: number;
  status?: string;
  search?: string;
}

export type PostWithRelations = Post & {
  category?: PostCategory | null;
  author: User;
};

class PostRepository {
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
      sortBy = "publishedAt",
      sortOrder = "desc",
    } = options;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PostWhereInput = {};

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.authorId) {
      where.authorId = filters.authorId;
    }

    if (filters.status) {
      where.status = filters.status as any;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { excerpt: { contains: filters.search } },
        { content: { contains: filters.search } },
      ];
    }

    // Validate sortBy
    const allowedSortColumns = [
      "id",
      "title",
      "publishedAt",
      "createdAt",
      "updatedAt",
      "views",
    ];
    const safeSortBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "publishedAt";

    // Get total count
    const total = await prisma.post.count({ where });

    // Get data
    const data = await prisma.post.findMany({
      where,
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            phone: true,
            status: true,
            emailVerifiedAt: true,
            createdAt: true,
            updatedAt: true,
            password: true, // Include for type compatibility
          },
        },
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
   * Find post by slug with relations
   */
  async findBySlug(slug: string): Promise<PostWithRelations | null> {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        author: true,
      },
    });
  }

  /**
   * Find post by ID with relations
   */
  async findById(id: number): Promise<PostWithRelations | null> {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        author: true,
      },
    });
  }

  /**
   * Increment view count
   */
  async incrementViews(id: number): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Get latest published posts
   */
  async getLatest(limit: number = 5): Promise<PostWithRelations[]> {
    return await prisma.post.findMany({
      where: {
        status: "published",
        publishedAt: {
          lte: new Date(),
        },
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
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            phone: true,
            status: true,
            emailVerifiedAt: true,
            createdAt: true,
            updatedAt: true,
            password: true,
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });
  }

  /**
   * Get related posts (same category)
   */
  async getRelated(
    postId: number,
    categoryId: number,
    limit: number = 3
  ): Promise<PostWithRelations[]> {
    return await prisma.post.findMany({
      where: {
        status: "published",
        categoryId,
        id: {
          not: postId,
        },
        publishedAt: {
          lte: new Date(),
        },
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
        author: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });
  }

  /**
   * Create new post
   */
  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return await prisma.post.create({
      data,
    });
  }

  /**
   * Update post
   */
  async update(id: number, data: Prisma.PostUpdateInput): Promise<Post> {
    return await prisma.post.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete post
   */
  async delete(id: number): Promise<Post> {
    return await prisma.post.delete({
      where: { id },
    });
  }

  /**
   * Count posts by status
   */
  async countByStatus(status: string): Promise<number> {
    return await prisma.post.count({
      where: { status: status as any },
    });
  }

  /**
   * Search posts
   */
  async search(query: string, limit: number = 10): Promise<PostWithRelations[]> {
    return await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { excerpt: { contains: query } },
          { content: { contains: query } },
        ],
        status: "published",
      },
      include: {
        category: true,
        author: true,
      },
      take: limit,
    });
  }
}

// Export singleton instance
export const postRepository = new PostRepository();
