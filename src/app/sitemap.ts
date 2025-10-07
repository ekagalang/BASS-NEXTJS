import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://basstrainingacademy.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tentang-kami`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/hubungi-kami`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    // Fetch all active programs
    const programs = await db.query<any[]>(
      `SELECT slug, updated_at 
       FROM programs 
       WHERE status = 'active' 
       ORDER BY updated_at DESC`
    );

    const programPages: MetadataRoute.Sitemap = programs.map((program) => ({
      url: `${baseUrl}/programs/${program.slug}`,
      lastModified: new Date(program.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Fetch all published posts
    const posts = await db.query<any[]>(
      `SELECT slug, updated_at 
       FROM posts 
       WHERE status = 'published' AND published_at <= NOW()
       ORDER BY published_at DESC`
    );

    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    // Fetch all pages
    const pages = await db.query<any[]>(
      `SELECT slug, updated_at 
       FROM pages 
       WHERE status = 'published'`
    );

    const customPages: MetadataRoute.Sitemap = pages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updated_at),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    // Combine all
    return [...staticPages, ...programPages, ...blogPages, ...customPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static pages if database fails
    return staticPages;
  }
}
