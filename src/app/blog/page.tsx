// src/app/blog/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import HoverLink from "@/components/ui/HoverLink";

export const metadata: Metadata = {
  title: "Blog & Artikel",
  description:
    "Baca artikel terbaru seputar pengembangan SDM, tips pelatihan, dan berita terkini dari BASS Training Academy",
  keywords: "blog, artikel, tips pelatihan, pengembangan SDM, berita pelatihan",
};

// Fetch posts from API
async function getPosts(searchParams: any) {
  const params = new URLSearchParams();

  if (searchParams.category)
    params.append("category_id", searchParams.category);
  if (searchParams.search) params.append("search", searchParams.search);
  if (searchParams.page) params.append("page", searchParams.page);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  const url = `${baseUrl}/posts?${params.toString()}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("API Error:", res.status);
      return {
        data: [],
        pagination: { page: 1, limit: 9, total: 0, totalPages: 0 },
      };
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      data: [],
      pagination: { page: 1, limit: 9, total: 0, totalPages: 0 },
    };
  }
}

// Fetch categories
async function getCategories() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    const res = await fetch(`${baseUrl}/post-categories`, {
      cache: "force-cache",
    });

    if (!res.ok) return [];

    return res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const [postsData, categories] = await Promise.all([
    getPosts(params),
    getCategories(),
  ]);

  const { data: posts, pagination } = postsData;

  const PRIMARY = "#DA1E1E";
  const ACCENT = "#D91E43";

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section
        className="text-white py-20"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog & Artikel
            </h1>
            <p className="text-lg text-white/90">
              Temukan tips, insight, dan berita terbaru seputar pengembangan SDM
              dan pelatihan profesional
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <main className="lg:w-3/4">
              {posts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg border-0 p-12 text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-neutral-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900">
                    Belum Ada Artikel
                  </h3>
                  <p className="text-neutral-600">
                    Artikel akan segera tersedia. Nantikan update terbaru dari
                    kami!
                  </p>
                </div>
              ) : (
                <>
                  {/* Featured Post (First Post) */}
                  {posts.length > 0 && pagination.page === 1 && (
                    <article className="bg-white rounded-xl shadow-lg border-0 overflow-hidden mb-8 hover:shadow-2xl transition-all duration-300">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div
                          className="h-64 md:h-full"
                          style={{
                            background: posts[0].featured_image
                              ? "transparent"
                              : `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)`,
                          }}
                        >
                          {posts[0].featured_image && (
                            <img
                              src={posts[0].featured_image}
                              alt={posts[0].title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                          <span
                            className="inline-block text-xs px-3 py-1 rounded-full mb-3 w-fit font-medium"
                            style={{
                              backgroundColor: `${PRIMARY}15`,
                              color: PRIMARY,
                            }}
                          >
                            Featured
                          </span>
                          {posts[0].category && (
                            <span className="text-sm text-neutral-500 mb-2">
                              {posts[0].category.name}
                            </span>
                          )}
                          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-neutral-900 hover:underline transition-colors duration-300">
                            <HoverLink
                              href={`/blog/${posts[0].slug}`}
                              hoverColor={PRIMARY}
                            >
                              {posts[0].title}
                            </HoverLink>
                          </h2>
                          <p className="text-neutral-600 mb-4 line-clamp-3">
                            {posts[0].excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                            <span>{posts[0].author?.name}</span>
                            <span>•</span>
                            <span>
                              {new Date(
                                posts[0].published_at
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <Link
                            href={`/blog/${posts[0].slug}`}
                            className="font-semibold hover:underline transition-colors duration-300"
                            style={{ color: PRIMARY }}
                          >
                            Baca Selengkapnya →
                          </Link>
                        </div>
                      </div>
                    </article>
                  )}

                  {/* Posts Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {posts
                      .slice(pagination.page === 1 ? 1 : 0)
                      .map((post: any) => (
                        <article
                          key={post.id}
                          className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                          <div
                            className="h-48"
                            style={{
                              background: post.featured_image
                                ? "transparent"
                                : "linear-gradient(to-br, #e5e7eb, #d1d5db)",
                            }}
                          >
                            {post.featured_image && (
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="p-5">
                            {post.category && (
                              <span
                                className="inline-block text-xs px-3 py-1 rounded-full mb-3 font-medium"
                                style={{
                                  backgroundColor: `${PRIMARY}15`,
                                  color: PRIMARY,
                                }}
                              >
                                {post.category.name}
                              </span>
                            )}
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-neutral-900">
                              <HoverLink
                                href={`/blog/${post.slug}`}
                                className="hover:underline transition-colors duration-300"
                                hoverColor={PRIMARY}
                              >
                                {post.title}
                              </HoverLink>
                            </h3>
                            <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-sm text-neutral-500 border-t border-neutral-200 pt-3">
                              <span>{post.author?.name}</span>
                              <span>
                                {new Date(post.published_at).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </article>
                      ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      {pagination.page > 1 && (
                        <Link
                          href={`/blog?page=${pagination.page - 1}${
                            params.category
                              ? `&category=${params.category}`
                              : ""
                          }`}
                          className="px-4 py-2 bg-white border-2 border-neutral-200 rounded-xl hover:border-neutral-300 hover:shadow-md transition-all duration-300 font-medium"
                        >
                          Previous
                        </Link>
                      )}

                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      ).map((pageNum) => (
                        <Link
                          key={pageNum}
                          href={`/blog?page=${pageNum}${
                            params.category
                              ? `&category=${params.category}`
                              : ""
                          }`}
                          className={`px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                            pageNum === pagination.page
                              ? "text-white shadow-lg transform scale-105"
                              : "bg-white border-2 border-neutral-200 hover:border-neutral-300 hover:shadow-md text-neutral-700"
                          }`}
                          style={{
                            backgroundColor:
                              pageNum === pagination.page ? PRIMARY : undefined,
                          }}
                        >
                          {pageNum}
                        </Link>
                      ))}

                      {pagination.page < pagination.totalPages && (
                        <Link
                          href={`/blog?page=${pagination.page + 1}${
                            params.category
                              ? `&category=${params.category}`
                              : ""
                          }`}
                          className="px-4 py-2 bg-white border-2 border-neutral-200 rounded-xl hover:border-neutral-300 hover:shadow-md transition-all duration-300 font-medium"
                        >
                          Next
                        </Link>
                      )}
                    </div>
                  )}
                </>
              )}
            </main>

            {/* Sidebar */}
            <aside className="lg:w-1/4">
              {/* Categories */}
              <div className="bg-white rounded-xl shadow-lg border-0 p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-neutral-900">
                  Kategori
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/blog"
                    className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                      !params.category
                        ? "font-medium shadow-md"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                    style={{
                      backgroundColor: !params.category
                        ? `${PRIMARY}15`
                        : "transparent",
                      color: !params.category ? PRIMARY : undefined,
                    }}
                  >
                    Semua Artikel
                  </Link>
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/blog?category=${cat.id}`}
                      className={`block px-3 py-2 rounded-lg transition-all duration-300 ${
                        params.category === cat.id.toString()
                          ? "font-medium shadow-md"
                          : "text-neutral-600 hover:bg-neutral-50"
                      }`}
                      style={{
                        backgroundColor:
                          params.category === cat.id.toString()
                            ? `${PRIMARY}15`
                            : "transparent",
                        color:
                          params.category === cat.id.toString()
                            ? PRIMARY
                            : undefined,
                      }}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div
                className="text-white rounded-xl shadow-lg p-6"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)`,
                }}
              >
                <h3 className="text-xl font-bold mb-2">Newsletter</h3>
                <p className="text-white/90 text-sm mb-4">
                  Dapatkan update artikel terbaru langsung ke email Anda
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email Anda"
                    className="w-full px-4 py-2 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-md"
                  />
                  <button
                    type="submit"
                    className="w-full bg-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    style={{ color: PRIMARY }}
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
