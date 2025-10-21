// src/app/programs/[slug]/page.tsx
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import HoverLink from "@/components/ui/HoverLink";
import { HoverButton, HoverAnchor } from "@/components/ui/HoverButton";

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const program = await getProgram(params.slug);

  if (!program) {
    return {
      title: "Program Tidak Ditemukan",
    };
  }

  const ogImage =
    program.featured_image || "https://basstrainingacademy.com/og-image.jpg";

  return {
    title: program.meta_title || program.title,
    description:
      program.meta_description || program.excerpt || program.description,
    keywords: program.category?.name,
    openGraph: {
      title: program.title,
      description: program.excerpt || program.description,
      type: "article",
      url: `https://basstrainingacademy.com/programs/${program.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: program.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: program.title,
      description: program.excerpt,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://basstrainingacademy.com/programs/${program.slug}`,
    },
  };
}

// Fetch single program
async function getProgram(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/programs/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching program:", error);
    return null;
  }
}

// Fetch related programs
async function getRelatedPrograms(categoryId: number, currentId: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(
      `${baseUrl}/api/programs?category_id=${categoryId}&limit=3`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.data.filter((p: any) => p.id !== currentId).slice(0, 3);
  } catch (error) {
    return [];
  }
}

export default async function SingleProgramPage({
  params,
}: {
  params: { slug: string };
}) {
  const program = await getProgram(params.slug);

  if (!program) {
    notFound();
  }

  const relatedPrograms = program.category_id
    ? await getRelatedPrograms(program.category_id, program.id)
    : [];

  // Structured data for the program/course
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.title,
    description: program.description,
    provider: {
      "@type": "Organization",
      name: "BASS Training Academy",
      sameAs: "https://basstrainingacademy.com",
    },
    hasCourseInstance: program.schedules?.map((schedule: any) => ({
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: schedule.location,
        address: schedule.address,
      },
      startDate: schedule.start_date,
      endDate: schedule.end_date,
      instructor: program.instructors?.map((instructor: any) => ({
        "@type": "Person",
        name: instructor.name,
      })),
    })),
    offers: {
      "@type": "Offer",
      price: program.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
  };

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://basstrainingacademy.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Programs",
        item: "https://basstrainingacademy.com/programs",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: program.title,
        item: `https://basstrainingacademy.com/programs/${program.slug}`,
      },
    ],
  };

  const PRIMARY = "#DA1E1E";
  const ACCENT = "#D91E43";

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(courseSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="min-h-screen bg-neutral-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-neutral-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm text-neutral-600">
              <HoverLink
                href="/"
                className="hover:underline transition-colors duration-300"
                hoverColor={PRIMARY}
              >
                Home
              </HoverLink>
              <span>/</span>
              <HoverLink
                href="/programs"
                className="hover:underline transition-colors duration-300"
                hoverColor={PRIMARY}
              >
                Programs
              </HoverLink>
              <span>/</span>
              <span className="text-neutral-900 font-medium">
                {program.title}
              </span>
            </nav>
          </div>
        </div>

        {/* Program Hero */}
        <section
          className="text-white py-16"
          style={{
            background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)`,
          }}
        >
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                {/* Category Badge */}
                {program.category && (
                  <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm mb-4">
                    {program.category.name}
                  </span>
                )}

                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {program.title}
                </h1>

                <p className="text-lg text-white/90 mb-6">
                  {program.excerpt || program.description?.substring(0, 200)}
                </p>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
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
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
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
                    <span>Max {program.max_participants} peserta</span>
                  </div>
                  {program.certification_type && (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                      </svg>
                      <span>Sertifikat {program.certification_type}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-sm text-white/80 mb-1">
                    Investasi Program
                  </div>
                  <div className="text-4xl font-bold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(program.price)}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/hubungi-kami?program=${program.slug}`}
                    className="bg-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ color: PRIMARY }}
                  >
                    Daftar Sekarang
                  </Link>
                  <HoverAnchor
                    href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan program ${program.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    defaultColor="white"
                    hoverColor={PRIMARY}
                    defaultBg="transparent"
                    hoverBg="white"
                  >
                    WhatsApp Kami
                  </HoverAnchor>
                </div>
              </div>

              {/* Program Image */}
              <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-2xl">
                {program.featured_image ? (
                  <img
                    src={program.featured_image}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white text-6xl font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${ACCENT} 0%, ${PRIMARY} 100%)`,
                    }}
                  >
                    {program.title.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Program Details */}
              <div className="lg:col-span-2">
                {/* Description */}
                <div className="bg-white rounded-xl shadow-lg border-0 p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-neutral-900">
                    Tentang Program
                  </h2>
                  <div
                    className="prose prose-neutral max-w-none"
                    dangerouslySetInnerHTML={{ __html: program.description }}
                  />
                </div>

                {/* Learning Objectives */}
                {program.learning_objectives && (
                  <div className="bg-white rounded-xl shadow-lg border-0 p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-neutral-900">
                      Tujuan Pembelajaran
                    </h2>
                    <div
                      className="prose prose-neutral max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: program.learning_objectives,
                      }}
                    />
                  </div>
                )}

                {/* Target Participants */}
                {program.target_participants && (
                  <div className="bg-white rounded-xl shadow-lg border-0 p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-neutral-900">
                      Peserta yang Cocok
                    </h2>
                    <div
                      className="prose prose-neutral max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: program.target_participants,
                      }}
                    />
                  </div>
                )}

                {/* Instructors */}
                {program.instructors && program.instructors.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg border-0 p-8">
                    <h2 className="text-2xl font-bold mb-6 text-neutral-900">
                      Instruktur
                    </h2>
                    <div className="space-y-6">
                      {program.instructors.map((instructor: any) => (
                        <div key={instructor.id} className="flex gap-4">
                          <div
                            className="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                            style={{
                              background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)`,
                            }}
                          >
                            {instructor.name.charAt(0)}
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold mb-1 text-neutral-900">
                              {instructor.name}
                            </h3>
                            <div
                              className="text-sm mb-2 font-medium"
                              style={{ color: PRIMARY }}
                            >
                              {instructor.level === "master" &&
                                "Master Trainer"}
                              {instructor.level === "senior" &&
                                "Senior Trainer"}
                              {instructor.level === "regular" && "Trainer"}
                            </div>
                            <p className="text-neutral-600 text-sm">
                              {instructor.bio}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                {/* Registration Card */}
                <div className="bg-white rounded-xl shadow-lg border-0 p-6 mb-8 sticky top-4">
                  <h3 className="text-xl font-bold mb-4 text-neutral-900">
                    Informasi Pendaftaran
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                      <span className="text-neutral-600">Harga</span>
                      <span
                        className="text-xl font-bold"
                        style={{ color: PRIMARY }}
                      >
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(program.price)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                      <span className="text-neutral-600">Durasi</span>
                      <span className="font-semibold text-neutral-900">
                        {program.duration || "3 Hari"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                      <span className="text-neutral-600">Kapasitas</span>
                      <span className="font-semibold text-neutral-900">
                        {program.max_participants} peserta
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Status</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          program.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {program.status === "active"
                          ? "Tersedia"
                          : "Segera Dibuka"}
                      </span>
                    </div>
                  </div>

                  <HoverButton
                    href={`/hubungi-kami?program=${program.slug}`}
                    className="block w-full text-white text-center px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 mb-3"
                    defaultBg={PRIMARY}
                    hoverBg={ACCENT}
                  >
                    Daftar Sekarang
                  </HoverButton>

                  <a
                    href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan program ${program.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full border-2 text-center px-6 py-3 rounded-xl font-semibold hover:bg-neutral-50 transition-all duration-300"
                    style={{
                      borderColor: PRIMARY,
                      color: PRIMARY,
                    }}
                  >
                    Tanya via WhatsApp
                  </a>
                </div>

                {/* Schedule Card */}
                {program.schedules && program.schedules.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg border-0 p-6">
                    <h3 className="text-xl font-bold mb-4 text-neutral-900">
                      Jadwal Terdekat
                    </h3>
                    <div className="space-y-4">
                      {program.schedules.slice(0, 3).map((schedule: any) => (
                        <div
                          key={schedule.id}
                          className="border-2 border-neutral-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                        >
                          <div
                            className="flex items-center gap-2 mb-2 font-medium"
                            style={{ color: PRIMARY }}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="font-semibold">
                              {new Date(schedule.start_date).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            <strong>Lokasi:</strong> {schedule.location}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Waktu:</strong>{" "}
                            {schedule.start_time.substring(0, 5)} -{" "}
                            {schedule.end_time.substring(0, 5)} WIB
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              Tersedia: {schedule.available_seats} kursi
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                schedule.status === "upcoming"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {schedule.status === "upcoming"
                                ? "Dibuka"
                                : "Penuh"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Related Programs */}
        {relatedPrograms.length > 0 && (
          <section className="py-12 bg-neutral-100">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-neutral-900">
                Program Terkait
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPrograms.map((relProgram: any) => (
                  <article
                    key={relProgram.id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div
                      className="h-48"
                      style={{
                        background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)`,
                      }}
                    ></div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-neutral-900">
                        <HoverLink
                          href={`/programs/${relProgram.slug}`}
                          className="hover:underline transition-colors duration-300"
                          hoverColor={PRIMARY}
                        >
                          {relProgram.title}
                        </HoverLink>
                      </h3>
                      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                        {relProgram.excerpt}
                      </p>
                      <div className="flex justify-between items-center">
                        <div
                          className="text-lg font-bold"
                          style={{ color: PRIMARY }}
                        >
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(relProgram.price)}
                        </div>
                        <Link
                          href={`/programs/${relProgram.slug}`}
                          className="hover:underline text-sm font-semibold transition-colors duration-300"
                          style={{ color: PRIMARY }}
                        >
                          Lihat Detail →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section
          className="py-20 text-white"
          style={{
            background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)`,
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Meningkatkan Kompetensi?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Daftarkan diri Anda sekarang dan dapatkan sertifikasi profesional
            </p>
            <Link
              href={`/hubungi-kami?program=${program.slug}`}
              className="inline-block bg-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{ color: PRIMARY }}
            >
              Hubungi Kami
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
