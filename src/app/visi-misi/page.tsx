import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visi & Misi - BASS Training Academy",
  description:
    "Visi dan Misi BASS Training Academy dalam mengembangkan SDM Indonesia yang profesional dan kompeten melalui program pelatihan berkualitas.",
  keywords:
    "visi misi, bass training academy, pengembangan sdm, lembaga pelatihan",
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

export default async function VisionMissionPage() {
  const pageContent = await getPageContent("visi-misi");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Visi & Misi Kami
            </h1>
            <p className="text-lg text-blue-100">
              Komitmen kami dalam mengembangkan SDM Indonesia yang profesional
              dan berdaya saing tinggi
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Database Content */}
            {pageContent && (
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: pageContent.content }}
                />
              </div>
            )}

            {/* Vision Section */}
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Visi
                </h2>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 md:p-8 mb-6">
                <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-medium">
                  Menjadi lembaga pelatihan terkemuka di Indonesia yang
                  menghasilkan SDM profesional dan kompeten untuk mendukung
                  kemajuan industri nasional serta meningkatkan daya saing
                  global.
                </p>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="leading-relaxed">
                  Kami berkomitmen untuk terus berinovasi dalam metode
                  pelatihan, mengembangkan kurikulum yang relevan dengan
                  kebutuhan industri, dan menghasilkan lulusan yang tidak hanya
                  kompeten secara teknis tetapi juga memiliki integritas dan
                  profesionalisme tinggi.
                </p>
              </div>
            </div>

            {/* Mission Section */}
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Misi
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    number: "01",
                    title: "Program Pelatihan Berkualitas",
                    desc: "Menyelenggarakan program pelatihan dengan standar nasional dan internasional yang disesuaikan dengan kebutuhan industri terkini.",
                  },
                  {
                    number: "02",
                    title: "Sertifikasi Profesional",
                    desc: "Memberikan sertifikasi yang diakui secara nasional melalui kerjasama dengan BNSP dan lembaga sertifikasi internasional.",
                  },
                  {
                    number: "03",
                    title: "Peningkatan Kompetensi SDM",
                    desc: "Berkontribusi aktif dalam meningkatkan kompetensi SDM Indonesia melalui program-program pelatihan yang aplikatif dan berkelanjutan.",
                  },
                  {
                    number: "04",
                    title: "Kemitraan Strategis",
                    desc: "Membangun dan memperkuat kemitraan dengan industri, pemerintah, dan institusi pendidikan untuk pengembangan SDM yang holistik.",
                  },
                  {
                    number: "05",
                    title: "Instruktur Berpengalaman",
                    desc: "Menghadirkan instruktur profesional dan berpengalaman yang memiliki keahlian praktis di bidangnya masing-masing.",
                  },
                  {
                    number: "06",
                    title: "Inovasi Berkelanjutan",
                    desc: "Terus berinovasi dalam metode pembelajaran, teknologi pelatihan, dan pengembangan kurikulum yang dinamis.",
                  },
                ].map((mission, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-6 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-blue-300 hover:shadow-md transition"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {mission.number}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                        {mission.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {mission.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Values */}
            <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-8">
              <h2 className="text-3xl font-bold text-center mb-8">
                Nilai-Nilai Inti
              </h2>
              <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
                Nilai-nilai yang menjadi fondasi dalam setiap program dan
                aktivitas kami di BASS Training Academy
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: "💼",
                    title: "Profesionalisme",
                    desc: "Menjalankan setiap program dengan standar profesional tertinggi dan komitmen penuh terhadap kualitas.",
                  },
                  {
                    icon: "🤝",
                    title: "Integritas",
                    desc: "Berkomitmen pada kejujuran, transparansi, dan etika bisnis yang baik dalam setiap aspek layanan.",
                  },
                  {
                    icon: "💡",
                    title: "Inovasi",
                    desc: "Terus berinovasi dalam metode pembelajaran dan teknologi untuk memberikan pengalaman terbaik.",
                  },
                  {
                    icon: "⭐",
                    title: "Excellence",
                    desc: "Mengutamakan keunggulan dan kualitas dalam setiap program yang diselenggarakan.",
                  },
                  {
                    icon: "🤲",
                    title: "Kolaborasi",
                    desc: "Membangun kerjasama yang saling menguntungkan dengan berbagai pihak untuk kemajuan bersama.",
                  },
                  {
                    icon: "🎯",
                    title: "Fokus pada Hasil",
                    desc: "Berkomitmen penuh terhadap pencapaian tujuan dan kesuksesan setiap peserta pelatihan.",
                  },
                ].map((value, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-lg transition text-center"
                  >
                    <div className="text-5xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Commitment */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-center mb-6">
                Komitmen Kami
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-lg text-center text-blue-100 mb-8 leading-relaxed">
                  BASS Training Academy berkomitmen untuk terus memberikan
                  kontribusi nyata dalam pengembangan SDM Indonesia yang
                  berkualitas dan berdaya saing global.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  {[
                    {
                      number: "15+",
                      label: "Tahun Pengalaman",
                    },
                    {
                      number: "10K+",
                      label: "Peserta Terlatih",
                    },
                    {
                      number: "98%",
                      label: "Tingkat Kepuasan",
                    },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-4xl md:text-5xl font-bold mb-2">
                        {stat.number}
                      </div>
                      <div className="text-blue-200 text-sm uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Bergabunglah dengan Kami
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Mari bersama-sama membangun SDM Indonesia yang lebih baik dan
              kompeten
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/programs"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
              >
                Lihat Program Pelatihan
              </Link>
              <Link
                href="/hubungi-kami"
                className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
