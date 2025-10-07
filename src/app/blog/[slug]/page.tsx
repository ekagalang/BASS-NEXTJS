// src/app/blog/[slug]/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  const ogImage =
    post.featured_image || "https://basstrainingacademy.com/og-image.jpg";

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.category?.name,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://basstrainingacademy.com/blog/${post.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author?.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

// Fetch single post
async function getPost(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const res = await fetch(`${baseUrl}/posts/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Fetch related posts
async function getRelatedPosts(categoryId: number, currentId: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const res = await fetch(
      `${baseUrl}/posts?category_id=${categoryId}&limit=3`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.data.filter((p: any) => p.id !== currentId).slice(0, 3);
  } catch (error) {
    return [];
  }
}

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = post.category_id
    ? await getRelatedPosts(post.category_id, post.id)
    : [];

  // Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author?.name,
    },
    publisher: {
      "@type": "Organization",
      name: "BASS Training Academy",
      logo: {
        "@type": "ImageObject",
        url: "https://basstrainingacademy.com/logo.png",
      },
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-blue-600">
                Blog
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium line-clamp-1">
                {post.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Article Header */}
        <article className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Category Badge */}
              {post.category && (
                <Link
                  href={`/blog?category=${post.category_id}`}
                  className="inline-block bg-blue-100 text-blue-700 text-sm px-4 py-1 rounded-full mb-4 hover:bg-blue-200 transition"
                >
                  {post.category.name}
                </Link>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8 pb-8 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-semibold">
                    {post.author?.name?.charAt(0)}
                  </div>
                  <span className="font-medium">{post.author?.name}</span>
                </div>
                <span>•</span>
                <span>
                  {new Date(post.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>{post.views} views</span>
              </div>

              {/* Featured Image */}
              {post.featured_image && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-lg prose-blue max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share Buttons */}
              <div className="flex items-center gap-3 py-6 border-t border-b mb-8">
                <span className="font-semibold">Bagikan:</span>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    `https://basstrainingacademy.com/blog/${post.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    `https://basstrainingacademy.com/blog/${post.slug}`
                  )}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    `https://basstrainingacademy.com/blog/${post.slug}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>

              {/* Author Info */}
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {post.author?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {post.author?.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Penulis artikel di BASS Training Academy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">Artikel Terkait</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((relPost: any) => (
                    <article
                      key={relPost.id}
                      className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                        {relPost.featured_image && (
                          <img
                            src={relPost.featured_image}
                            alt={relPost.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-5">
                        {relPost.category && (
                          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mb-2">
                            {relPost.category.name}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                          <Link
                            href={`/blog/${relPost.slug}`}
                            className="hover:text-blue-600 transition"
                          >
                            {relPost.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {relPost.excerpt}
                        </p>
                        <div className="text-sm text-gray-500">
                          {new Date(relPost.published_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-blue-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Tertarik dengan Program Pelatihan Kami?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Tingkatkan kompetensi Anda dengan program pelatihan profesional
              bersertifikasi BNSP
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/programs"
                className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Lihat Program
              </Link>
              <Link
                href="/hubungi-kami"
                className="inline-block border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
