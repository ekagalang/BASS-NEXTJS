import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali lebih dekat BASS Training Academy, lembaga pelatihan profesional dengan sertifikasi BNSP untuk pengembangan SDM berkualitas",
  keywords:
    "tentang kami, bass training academy, lembaga pelatihan, sertifikasi bnsp",
};

// Fetch page content from database
async function getPageContent(slug: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/pages/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

export default async function AboutPage() {
  const pageContent = await getPageContent("tentang-kami");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tentang BASS Training Academy
            </h1>
            <p className="text-lg text-blue-100">
              Lembaga pelatihan profesional bersertifikasi BNSP untuk
              pengembangan SDM Indonesia
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              {pageContent ? (
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: pageContent.content }}
                />
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-6">Profil Perusahaan</h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    <strong>BASS Training Academy</strong> (Bintang Anugrah
                    Surya Semesta) adalah lembaga pelatihan profesional yang
                    berfokus pada pengembangan sumber daya manusia melalui
                    program-program pelatihan berkualitas dan tersertifikasi
                    BNSP.
                  </p>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Dengan pengalaman lebih dari 15 tahun dalam industri
                    pelatihan, kami telah membantu ribuan profesional dan
                    ratusan perusahaan dalam meningkatkan kompetensi dan
                    produktivitas tim mereka.
                  </p>
                </>
              )}
            </div>

            {/* Vision & Mission */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Vision */}
              <div className="bg-blue-50 rounded-lg p-8">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Visi</h3>
                <p className="text-gray-700">
                  Menjadi lembaga pelatihan terkemuka di Indonesia yang
                  menghasilkan SDM profesional dan kompeten untuk mendukung
                  kemajuan industri nasional.
                </p>
              </div>

              {/* Mission */}
              <div className="bg-blue-50 rounded-lg p-8">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white"
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
                </div>
                <h3 className="text-2xl font-bold mb-3">Misi</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      Menyelenggarakan program pelatihan berkualitas tinggi
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      Memberikan sertifikasi yang diakui secara nasional
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Meningkatkan kompetensi SDM Indonesia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Bermitra dengan industri untuk pengembangan SDM</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Core Values */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Nilai-Nilai Kami
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Profesional",
                    desc: "Menjalankan setiap program dengan standar profesional tertinggi",
                    icon: "💼",
                  },
                  {
                    title: "Integritas",
                    desc: "Berkomitmen pada kejujuran dan transparansi dalam setiap aspek",
                    icon: "🤝",
                  },
                  {
                    title: "Inovasi",
                    desc: "Terus berinovasi dalam metode dan materi pelatihan",
                    icon: "💡",
                  },
                  {
                    title: "Kualitas",
                    desc: "Mengutamakan kualitas dalam setiap program yang diselenggarakan",
                    icon: "⭐",
                  },
                  {
                    title: "Kolaborasi",
                    desc: "Membangun kerjasama yang saling menguntungkan",
                    icon: "🤲",
                  },
                  {
                    title: "Komitmen",
                    desc: "Berkomitmen penuh terhadap kesuksesan peserta",
                    icon: "🎯",
                  },
                ].map((value, i) => (
                  <div
                    key={i}
                    className="text-center p-6 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="text-5xl mb-3">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Pencapaian Kami
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { number: "15+", label: "Tahun Pengalaman" },
                  { number: "10,000+", label: "Peserta Terlatih" },
                  { number: "500+", label: "Program Pelatihan" },
                  { number: "98%", label: "Tingkat Kepuasan" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold mb-2">
                      {stat.number}
                    </div>
                    <div className="text-blue-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-3xl font-bold mb-6">Mengapa Memilih Kami?</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Instruktur Berpengalaman",
                    desc: "Tim instruktur kami adalah praktisi berpengalaman dengan sertifikasi internasional",
                  },
                  {
                    title: "Sertifikasi BNSP",
                    desc: "Program pelatihan kami tersertifikasi BNSP dan diakui secara nasional",
                  },
                  {
                    title: "Metode Pembelajaran Efektif",
                    desc: "Kombinasi teori dan praktik dengan studi kasus nyata dari industri",
                  },
                  {
                    title: "Fasilitas Lengkap",
                    desc: "Ruang pelatihan nyaman dengan peralatan modern dan teknologi terkini",
                  },
                  {
                    title: "Fleksibel",
                    desc: "Tersedia jadwal reguler dan dapat disesuaikan untuk in-house training",
                  },
                  {
                    title: "Post Training Support",
                    desc: "Dukungan konsultasi pasca pelatihan untuk memastikan implementasi ilmu",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Accreditation */}
            <div className="bg-blue-50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Terakreditasi & Terpercaya
              </h2>
              <p className="text-gray-700 mb-4">
                BASS Training Academy adalah Lembaga Pelatihan yang telah
                terakreditasi dan bekerja sama dengan Lembaga Sertifikasi
                Profesi (LSP) yang telah mendapatkan lisensi dari BNSP (Badan
                Nasional Sertifikasi Profesi).
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="bg-white px-6 py-3 rounded-lg shadow">
                  <span className="font-semibold text-blue-900">
                    Sertifikasi BNSP
                  </span>
                </div>
                <div className="bg-white px-6 py-3 rounded-lg shadow">
                  <span className="font-semibold text-blue-900">
                    ISO Certified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Bergabung dengan Ribuan Profesional Lainnya?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Mari tingkatkan kompetensi Anda bersama BASS Training Academy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/programs"
              className="inline-block bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Lihat Program Pelatihan
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
  );
}
