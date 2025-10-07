// src/app/blog/page.tsx
import Link from "next/link";
import { Metadata } from "next";

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

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blog & Artikel
            </h1>
            <p className="text-lg text-blue-100">
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
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
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
                  <h3 className="text-xl font-semibold mb-2">
                    Belum Ada Artikel
                  </h3>
                  <p className="text-gray-600">
                    Artikel akan segera tersedia. Nantikan update terbaru dari
                    kami!
                  </p>
                </div>
              ) : (
                <>
                  {/* Featured Post (First Post) */}
                  {posts.length > 0 && pagination.page === 1 && (
                    <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="h-64 md:h-full bg-gradient-to-br from-blue-400 to-blue-600">
                          {posts[0].featured_image && (
                            <img
                              src={posts[0].featured_image}
                              alt={posts[0].title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mb-3 w-fit">
                            Featured
                          </span>
                          {posts[0].category && (
                            <span className="text-sm text-gray-500 mb-2">
                              {posts[0].category.name}
                            </span>
                          )}
                          <h2 className="text-2xl md:text-3xl font-bold mb-3 hover:text-blue-600 transition">
                            <Link href={`/blog/${posts[0].slug}`}>
                              {posts[0].title}
                            </Link>
                          </h2>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {posts[0].excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
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
                            className="text-blue-600 font-semibold hover:underline"
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
                          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
                        >
                          <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300">
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
                              <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mb-3">
                                {post.category.name}
                              </span>
                            )}
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition">
                              <Link href={`/blog/${post.slug}`}>
                                {post.title}
                              </Link>
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
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
                          className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition"
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
                          className={`px-4 py-2 rounded-lg transition ${
                            pageNum === pagination.page
                              ? "bg-blue-600 text-white"
                              : "bg-white border hover:bg-gray-50"
                          }`}
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
                          className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition"
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
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Kategori</h3>
                <div className="space-y-2">
                  <Link
                    href="/blog"
                    className={`block px-3 py-2 rounded-lg transition ${
                      !params.category
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Semua Artikel
                  </Link>
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/blog?category=${cat.id}`}
                      className={`block px-3 py-2 rounded-lg transition ${
                        params.category === cat.id.toString()
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-blue-900 text-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-2">Newsletter</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Dapatkan update artikel terbaru langsung ke email Anda
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email Anda"
                    className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
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
