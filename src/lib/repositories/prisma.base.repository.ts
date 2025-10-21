// ============================================
// PRISMA BASE REPOSITORY
// Generic CRUD operations using Prisma ORM
// Database-agnostic: Works with MySQL, PostgreSQL, SQLite, etc.
// ============================================

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

export interface PaginationOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * Base Repository using Prisma
 * @example
 * class UserRepository extends PrismaBaseRepository<User> {
 *   constructor() {
 *     super(prisma.user)
 *   }
 * }
 */
export class PrismaBaseRepository<
  T,
  TDelegate extends {
    findMany: any
    findUnique: any
    findFirst: any
    create: any
    update: any
    delete: any
    count: any
  }
> {
  protected model: TDelegate

  constructor(model: TDelegate) {
    this.model = model
  }

  /**
   * Find all records
   */
  async findAll(options?: PaginationOptions & { where?: any; include?: any }): Promise<T[]> {
    const { sortBy = 'id', sortOrder = 'desc', where, include } = options || {}

    return await this.model.findMany({
      where,
      include,
      orderBy: { [sortBy]: sortOrder },
    })
  }

  /**
   * Find all with pagination
   */
  async findAllPaginated(
    options: PaginationOptions & { where?: any; include?: any }
  ): Promise<PaginatedResult<T>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'desc',
      where,
      include
    } = options

    const skip = (page - 1) * limit

    // Get total count
    const total = await this.model.count({ where })

    // Get data
    const data = await this.model.findMany({
      where,
      include,
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip,
    })

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Find by ID
   */
  async findById(id: number, include?: any): Promise<T | null> {
    return await this.model.findUnique({
      where: { id },
      include,
    })
  }

  /**
   * Find by field(s)
   */
  async findBy(where: any, include?: any): Promise<T[]> {
    return await this.model.findMany({
      where,
      include,
    })
  }

  /**
   * Find one by field(s)
   */
  async findOneBy(where: any, include?: any): Promise<T | null> {
    return await this.model.findFirst({
      where,
      include,
    })
  }

  /**
   * Create new record
   */
  async create(data: any): Promise<T> {
    return await this.model.create({
      data,
    })
  }

  /**
   * Update record by ID
   */
  async update(id: number, data: any): Promise<T> {
    return await this.model.update({
      where: { id },
      data,
    })
  }

  /**
   * Delete record by ID
   */
  async delete(id: number): Promise<T> {
    return await this.model.delete({
      where: { id },
    })
  }

  /**
   * Count records
   */
  async count(where?: any): Promise<number> {
    return await this.model.count({ where })
  }

  /**
   * Check if record exists
   */
  async exists(where: any): Promise<boolean> {
    const count = await this.model.count({ where })
    return count > 0
  }

  /**
   * Upsert (update or create)
   */
  async upsert(where: any, update: any, create: any): Promise<T> {
    return await this.model.upsert({
      where,
      update,
      create,
    })
  }

  /**
   * Batch create
   */
  async createMany(data: any[]): Promise<{ count: number }> {
    return await this.model.createMany({
      data,
      skipDuplicates: true,
    })
  }

  /**
   * Batch update
   */
  async updateMany(where: any, data: any): Promise<{ count: number }> {
    return await this.model.updateMany({
      where,
      data,
    })
  }

  /**
   * Batch delete
   */
  async deleteMany(where: any): Promise<{ count: number }> {
    return await this.model.deleteMany({
      where,
    })
  }
}

/**
 * Example specific repositories
 */

// User Repository Example
export class UserRepository extends PrismaBaseRepository<
  any,
  typeof prisma.user
> {
  constructor() {
    super(prisma.user)
  }

  async findByEmail(email: string) {
    return await this.findOneBy({ email })
  }

  async findActiveUsers() {
    return await this.findBy({ status: 'active' })
  }
}

// Post Repository Example
export class PostRepository extends PrismaBaseRepository<
  any,
  typeof prisma.post
> {
  constructor() {
    super(prisma.post)
  }

  async findPublished() {
    return await this.findBy(
      { status: 'published' },
      {
        author: true,
        category: true,
      }
    )
  }

  async findBySlug(slug: string) {
    return await this.findOneBy(
      { slug },
      {
        author: true,
        category: true,
      }
    )
  }

  async incrementViews(id: number) {
    return await this.model.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    })
  }
}

// Program Repository Example
export class ProgramRepository extends PrismaBaseRepository<
  any,
  typeof prisma.program
> {
  constructor() {
    super(prisma.program)
  }

  async findPublishedWithDetails() {
    return await this.findBy(
      { status: 'published' },
      {
        category: true,
        instructor: true,
        schedules: true,
      }
    )
  }

  async findBySlug(slug: string) {
    return await this.findOneBy(
      { slug },
      {
        category: true,
        instructor: true,
        schedules: {
          where: {
            status: 'upcoming',
          },
          orderBy: {
            startDate: 'asc',
          },
        },
      }
    )
  }

  async search(query: string) {
    return await this.model.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
        status: 'published',
      },
      include: {
        category: true,
        instructor: true,
      },
    })
  }
}

// Export singleton instances
export const userRepository = new UserRepository()
export const postRepository = new PostRepository()
export const programRepository = new ProgramRepository()
