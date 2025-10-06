import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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

  return {
    title: `${program.title} - BASS Training Academy`,
    description: program.excerpt || program.description,
    keywords: program.category?.name,
  };
}

// Fetch single program
async function getProgram(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/programs" className="hover:text-blue-600">
              Programs
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{program.title}</span>
          </nav>
        </div>
      </div>

      {/* Program Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
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

              <p className="text-lg text-blue-100 mb-6">
                {program.excerpt || program.description}
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
                <div className="text-sm text-blue-200 mb-1">
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
                  className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Daftar Sekarang
                </Link>
                <a
                  href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan program ${program.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition"
                >
                  WhatsApp Kami
                </a>
              </div>
            </div>

            {/* Program Image */}
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              {program.featured_image ? (
                <img
                  src={program.featured_image}
                  alt={program.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-6xl font-bold">
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
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Tentang Program</h2>
                <div
                  className="prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: program.description }}
                />
              </div>

              {/* Learning Objectives */}
              {program.learning_objectives && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    Tujuan Pembelajaran
                  </h2>
                  <div
                    className="prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: program.learning_objectives,
                    }}
                  />
                </div>
              )}

              {/* Target Participants */}
              {program.target_participants && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    Peserta yang Cocok
                  </h2>
                  <div
                    className="prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: program.target_participants,
                    }}
                  />
                </div>
              )}

              {/* Program Requirements */}
              {program.requirements && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                  <h2 className="text-2xl font-bold mb-4">Persyaratan</h2>
                  <div
                    className="prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: program.requirements }}
                  />
                </div>
              )}

              {/* Instructors */}
              {program.instructors && program.instructors.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Instruktur</h2>
                  <div className="space-y-6">
                    {program.instructors.map((instructor: any) => (
                      <div key={instructor.id} className="flex gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold">
                          {instructor.name.charAt(0)}
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold mb-1">
                            {instructor.name}
                          </h3>
                          <div className="text-sm text-gray-500 mb-2">
                            {instructor.level === "master" && "Master Trainer"}
                            {instructor.level === "senior" && "Senior Trainer"}
                            {instructor.level === "regular" && "Trainer"}
                          </div>
                          <p className="text-gray-600 text-sm">
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
              <div className="bg-white rounded-lg shadow-md p-6 mb-8 sticky top-4">
                <h3 className="text-xl font-bold mb-4">
                  Informasi Pendaftaran
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Harga</span>
                    <span className="text-xl font-bold text-blue-900">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(program.price)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Durasi</span>
                    <span className="font-semibold">
                      {program.duration || "3 Hari"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Kapasitas</span>
                    <span className="font-semibold">
                      {program.max_participants} peserta
                    </span>
                  </div>

                  {program.certification_type && (
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-gray-600">Sertifikasi</span>
                      <span className="font-semibold">
                        {program.certification_type}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
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

                <Link
                  href={`/hubungi-kami?program=${program.slug}`}
                  className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
                >
                  Daftar Sekarang
                </Link>

                <a
                  href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan program ${program.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full border-2 border-blue-600 text-blue-600 text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Tanya via WhatsApp
                </a>
              </div>

              {/* Schedule Card */}
              {program.schedules && program.schedules.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h3 className="text-xl font-bold mb-4">Jadwal Terdekat</h3>
                  <div className="space-y-4">
                    {program.schedules.slice(0, 3).map((schedule: any) => (
                      <div
                        key={schedule.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
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

              {/* Share Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Bagikan Program</h3>
                <div className="flex gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      `https://basstrainingacademy.com/programs/${program.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      `https://basstrainingacademy.com/programs/${program.slug}`
                    )}&text=${encodeURIComponent(program.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-sky-500 text-white text-center py-2 rounded-lg hover:bg-sky-600 transition"
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      `https://basstrainingacademy.com/programs/${program.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-700 text-white text-center py-2 rounded-lg hover:bg-blue-800 transition"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Programs */}
      {relatedPrograms.length > 0 && (
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Program Terkait</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPrograms.map((relProgram: any) => (
                <article
                  key={relProgram.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      <Link
                        href={`/programs/${relProgram.slug}`}
                        className="hover:text-blue-600 transition"
                      >
                        {relProgram.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relProgram.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-blue-900">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(relProgram.price)}
                      </div>
                      <Link
                        href={`/programs/${relProgram.slug}`}
                        className="text-blue-600 hover:underline text-sm font-semibold"
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
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Meningkatkan Kompetensi?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Daftarkan diri Anda sekarang dan dapatkan sertifikasi profesional
          </p>
          <Link
            href={`/hubungi-kami?program=${program.slug}`}
            className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Hubungi Kami
          </Link>
        </div>
      </section>
    </div>
  );
}
