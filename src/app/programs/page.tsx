// src/app/programs/page.tsx
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Program Pelatihan - BASS Training Academy",
  description:
    "Jelajahi berbagai program pelatihan profesional bersertifikasi BNSP dari BASS Training Academy",
  keywords:
    "program pelatihan, training, sertifikasi BNSP, soft skill, leadership",
};

// Client Component untuk filter dan search
import ProgramsClient from "./ProgramsClient";

// Fungsi untuk fetch programs dari API
async function getPrograms(searchParams: any) {
  const params = new URLSearchParams();

  if (searchParams.category)
    params.append("category_id", searchParams.category);
  if (searchParams.search) params.append("search", searchParams.search);
  if (searchParams.page) params.append("page", searchParams.page);
  if (searchParams.sort) params.append("sortBy", searchParams.sort);

  // FIX: Remove /api prefix since we're calling from server side
  const url = `http://localhost:3000/api/programs?${params.toString()}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error:", res.status, errorText);
      throw new Error(`Failed to fetch programs: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching programs:", error);
    return {
      data: [],
      pagination: { page: 1, limit: 9, total: 0, totalPages: 0 },
    };
  }
}

// Fungsi untuk fetch categories
async function getCategories() {
  try {
    const res = await fetch("http://localhost:3000/api/program-categories", {
      cache: "force-cache",
    });

    if (!res.ok) {
      console.error("Categories API Error:", res.status);
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // FIX: Await searchParams (Next.js 15 requirement)
  const params = await searchParams;

  const [programsData, categories] = await Promise.all([
    getPrograms(params),
    getCategories(),
  ]);

  const { data: programs, pagination } = programsData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Program Pelatihan Profesional
            </h1>
            <p className="text-lg text-blue-100">
              Temukan program pelatihan yang sesuai dengan kebutuhan
              pengembangan kompetensi Anda
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter */}
            <aside className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-xl font-semibold mb-4">Filter Program</h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-700">Kategori</h4>
                  <div className="space-y-2">
                    <Link
                      href="/programs"
                      className={`block px-3 py-2 rounded-lg transition ${
                        !params.category
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Semua Kategori
                    </Link>
                    {categories.map((cat: any) => (
                      <Link
                        key={cat.id}
                        href={`/programs?category=${cat.id}`}
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

                {/* Price Range Info */}
                <div className="pt-6 border-t">
                  <h4 className="font-medium mb-3 text-gray-700">Info Harga</h4>
                  <p className="text-sm text-gray-600">
                    Program tersedia mulai dari Rp 2.000.000 hingga Rp 5.500.000
                  </p>
                </div>
              </div>
            </aside>

            {/* Programs Grid */}
            <main className="lg:w-3/4">
              {/* Search and Sort Bar */}
              <ProgramsClient
                initialSearch={(params.search as string) || ""}
                initialSort={(params.sort as string) || "created_at"}
                totalPrograms={pagination.total}
              />

              {/* Programs Grid */}
              {programs.length === 0 ? (
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
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">
                    Tidak Ada Program
                  </h3>
                  <p className="text-gray-600">
                    Program yang Anda cari tidak ditemukan. Coba filter lain
                    atau hubungi kami.
                  </p>
                  <Link
                    href="/programs"
                    className="inline-block mt-4 text-blue-600 hover:underline"
                  >
                    Reset Filter
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {programs.map((program: any) => (
                      <article
                        key={program.id}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                      >
                        {/* Program Image */}
                        <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 relative">
                          {program.featured_image ? (
                            <img
                              src={program.featured_image}
                              alt={program.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-white text-4xl font-bold">
                              {program.title.charAt(0)}
                            </div>
                          )}

                          {/* Status Badge */}
                          {program.status === "upcoming" && (
                            <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Segera Dibuka
                            </span>
                          )}
                        </div>

                        {/* Program Content */}
                        <div className="p-5">
                          {/* Category Badge */}
                          {program.category && (
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mb-3">
                              {program.category.name}
                            </span>
                          )}

                          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                            <Link
                              href={`/programs/${program.slug}`}
                              className="hover:text-blue-600 transition"
                            >
                              {program.title}
                            </Link>
                          </h3>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {program.excerpt || program.description}
                          </p>

                          {/* Program Meta */}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>{program.duration || "3 Hari"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                              </svg>
                              <span>
                                {program.max_participants || 20} peserta
                              </span>
                            </div>
                          </div>

                          {/* Price and CTA */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                Investasi
                              </div>
                              <div className="text-xl font-bold text-blue-900">
                                {new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                  minimumFractionDigits: 0,
                                }).format(program.price)}
                              </div>
                            </div>
                            <Link
                              href={`/programs/${program.slug}`}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                            >
                              Lihat Detail
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      {/* Previous Button */}
                      {pagination.page > 1 && (
                        <Link
                          href={`/programs?page=${pagination.page - 1}${
                            params.category
                              ? `&category=${params.category}`
                              : ""
                          }${params.search ? `&search=${params.search}` : ""}`}
                          className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition"
                        >
                          Previous
                        </Link>
                      )}

                      {/* Page Numbers */}
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      ).map((pageNum) => (
                        <Link
                          key={pageNum}
                          href={`/programs?page=${pageNum}${
                            params.category
                              ? `&category=${params.category}`
                              : ""
                          }${params.search ? `&search=${params.search}` : ""}`}
                          className={`px-4 py-2 rounded-lg transition ${
                            pageNum === pagination.page
                              ? "bg-blue-600 text-white"
                              : "bg-white border hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      ))}

                      {/* Next Button */}
                      {pagination.page < pagination.totalPages && (
                        <Link
                          href={`/programs?page=${pagination.page + 1}${
                            params.category
                              ? `&category=${params.category}`
                              : ""
                          }${params.search ? `&search=${params.search}` : ""}`}
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Tidak Menemukan Program yang Sesuai?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Kami menyediakan program pelatihan kustom sesuai kebutuhan
            organisasi Anda
          </p>
          <Link
            href="/hubungi-kami"
            className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Konsultasi Gratis
          </Link>
        </div>
      </section>
    </div>
  );
}
