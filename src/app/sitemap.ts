import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

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
    const programs = await prisma.program.findMany({
      where: { status: "active" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    const programPages: MetadataRoute.Sitemap = programs.map((program) => ({
      url: `${baseUrl}/programs/${program.slug}`,
      lastModified: new Date(program.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Fetch all published posts
    const posts = await prisma.post.findMany({
      where: {
        status: "published",
        publishedAt: { lte: new Date() },
      },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    // Fetch all pages
    const pages = await prisma.page.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    });

    const customPages: MetadataRoute.Sitemap = pages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updatedAt),
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
