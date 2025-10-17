// ============================================
// MEDIA REPOSITORY
// Database operations for media/file management
// ============================================

import { BaseRepository } from "./base.repository";

export interface Media {
  id: number;
  filename: string;
  original_name: string;
  path: string;
  url: string;
  mime_type: string;
  size: number; // in bytes
  width?: number;
  height?: number;
  alt_text?: string;
  title?: string;
  description?: string;
  uploaded_by: number;
  created_at: string;
}

export class MediaRepository extends BaseRepository<Media> {
  constructor() {
    super("media");
  }

  /**
   * Find media by uploaded user
   */
  async findByUploader(uploadedBy: number): Promise<Media[]> {
    return this.findBy("uploaded_by", uploadedBy);
  }

  /**
   * Find media by mime type
   */
  async findByMimeType(mimeType: string): Promise<Media[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE mime_type LIKE ?
      ORDER BY created_at DESC
    `;
    return this.query<Media[]>(query, [`${mimeType}%`]);
  }

  /**
   * Search media by filename
   */
  async search(searchTerm: string): Promise<Media[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE filename LIKE ? OR original_name LIKE ? OR alt_text LIKE ?
      ORDER BY created_at DESC
    `;
    const term = `%${searchTerm}%`;
    return this.query<Media[]>(query, [term, term, term]);
  }

  /**
   * Get media stats
   */
  async getStats(): Promise<{
    total: number;
    totalSize: number;
    images: number;
    videos: number;
    documents: number;
  }> {
    const [statsResult] = await this.query<any[]>(`
      SELECT
        COUNT(*) as total,
        SUM(size) as totalSize,
        SUM(CASE WHEN mime_type LIKE 'image/%' THEN 1 ELSE 0 END) as images,
        SUM(CASE WHEN mime_type LIKE 'video/%' THEN 1 ELSE 0 END) as videos,
        SUM(CASE WHEN mime_type LIKE 'application/%' THEN 1 ELSE 0 END) as documents
      FROM ${this.tableName}
    `);

    return {
      total: statsResult.total || 0,
      totalSize: statsResult.totalSize || 0,
      images: statsResult.images || 0,
      videos: statsResult.videos || 0,
      documents: statsResult.documents || 0,
    };
  }
}

// Export singleton instance
export const mediaRepository = new MediaRepository();
