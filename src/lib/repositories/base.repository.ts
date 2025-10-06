// ============================================
// BASE REPOSITORY
// Generic CRUD operations
// ============================================

import { db } from "@/lib/db";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

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

export class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Find all records
   */
  async findAll(options?: PaginationOptions): Promise<T[]> {
    const { sortBy = "id", sortOrder = "desc" } = options || {};

    const query = `SELECT * FROM ${this.tableName} ORDER BY ${sortBy} ${sortOrder}`;
    const results = await db.query<T[]>(query);
    return results;
  }

  /**
   * Find all with pagination
   */
  async findAllPaginated(
    options: PaginationOptions
  ): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, sortBy = "id", sortOrder = "desc" } = options;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await db.query<any[]>(
      `SELECT COUNT(*) as total FROM ${this.tableName}`
    );
    const total = countResult[0].total;

    // Get data
    const data = await db.query<T[]>(
      `SELECT * FROM ${this.tableName} 
       ORDER BY ${sortBy} ${sortOrder} 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

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
   * Find by ID
   */
  async findById(id: number): Promise<T | null> {
    const results = await db.query<T[]>(
      `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`,
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Find by field
   */
  async findBy(field: string, value: any): Promise<T[]> {
    const results = await db.query<T[]>(
      `SELECT * FROM ${this.tableName} WHERE ${field} = ?`,
      [value]
    );
    return results;
  }

  /**
   * Find one by field
   */
  async findOneBy(field: string, value: any): Promise<T | null> {
    const results = await db.query<T[]>(
      `SELECT * FROM ${this.tableName} WHERE ${field} = ? LIMIT 1`,
      [value]
    );
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Create new record
   */
  async create(data: Partial<T>): Promise<number> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map(() => "?").join(", ");

    const query = `
      INSERT INTO ${this.tableName} (${fields.join(", ")}) 
      VALUES (${placeholders})
    `;

    const result = await db.query<any>(query, values);
    return result.insertId;
  }

  /**
   * Update record by ID
   */
  async update(id: number, data: Partial<T>): Promise<boolean> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field) => `${field} = ?`).join(", ");

    const query = `
      UPDATE ${this.tableName} 
      SET ${setClause} 
      WHERE id = ?
    `;

    const result = await db.query<any>(query, [...values, id]);
    return result.affectedRows > 0;
  }

  /**
   * Delete record by ID
   */
  async delete(id: number): Promise<boolean> {
    const result = await db.query<any>(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  /**
   * Count all records
   */
  async count(whereClause?: string, params?: any[]): Promise<number> {
    let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;

    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }

    const result = await db.query<any[]>(query, params);
    return result[0].total;
  }

  /**
   * Check if record exists
   */
  async exists(field: string, value: any): Promise<boolean> {
    const count = await this.count(`${field} = ?`, [value]);
    return count > 0;
  }

  /**
   * Execute custom query
   */
  async query<R = any>(query: string, params?: any[]): Promise<R> {
    return await db.query<R>(query, params);
  }
}
