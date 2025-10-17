// src/app/hubungi-kami/page.tsx
import { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Hubungi Kami - BASS Training Academy",
  description:
    "Hubungi BASS Training Academy untuk informasi pelatihan, konsultasi, atau pertanyaan lainnya. Kami siap membantu Anda.",
  keywords: "kontak, hubungi kami, informasi pelatihan, konsultasi",
};

export default function ContactPage() {
  const PRIMARY = "#DA1E1E";
  const ACCENT = "#D91E43";

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section
        className="text-white py-16"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, ${ACCENT} 100%)`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hubungi Kami
            </h1>
            <p className="text-lg text-white/90">
              Kami siap membantu Anda menemukan program pelatihan yang tepat
              untuk pengembangan kompetensi
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form - 2 columns */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border-0 p-8">
                <h2 className="text-2xl font-bold mb-2 text-neutral-900">
                  Kirim Pesan
                </h2>
                <p className="text-neutral-600 mb-6">
                  Isi formulir di bawah ini dan tim kami akan menghubungi Anda
                  secepatnya
                </p>

                <ContactForm />
              </div>
            </div>

            {/* Contact Info - 1 column */}
            <div className="lg:col-span-1">
              {/* Contact Details Card */}
              <div className="bg-white rounded-xl shadow-lg border-0 p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-neutral-900">
                  Informasi Kontak
                </h3>

                <div className="space-y-4">
                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${PRIMARY}15`,
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: PRIMARY }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">
                        Telepon
                      </div>
                      <a
                        href="tel:+622112345678"
                        className="hover:underline transition-colors duration-300"
                        style={{ color: PRIMARY }}
                      >
                        (021) 1234-5678
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${PRIMARY}15`,
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: PRIMARY }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">
                        Email
                      </div>
                      <a
                        href="mailto:admin@basstrainingacademy.com"
                        className="hover:underline transition-colors duration-300"
                        style={{ color: PRIMARY }}
                      >
                        admin@basstrainingacademy.com
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">
                        WhatsApp
                      </div>
                      <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline transition-colors duration-300"
                      >
                        0812-3456-7890
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${PRIMARY}15`,
                      }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: PRIMARY }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">
                        Alamat Kantor
                      </div>
                      <p className="text-neutral-600 text-sm">
                        Jl. Titihan Raya Blok B9/HF12-7A
                        <br />
                        Permata Bintaro
                        <br />
                        Tangerang Selatan, Banten 15227
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours Card */}
              <div className="bg-white rounded-xl shadow-lg border-0 p-6">
                <h3 className="text-xl font-bold mb-4 text-neutral-900">
                  Jam Operasional
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Senin - Jumat</span>
                    <span className="font-semibold text-neutral-900">
                      09:00 - 17:00 WIB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Sabtu</span>
                    <span className="font-semibold text-neutral-900">
                      09:00 - 14:00 WIB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Minggu & Libur</span>
                    <span className="font-semibold" style={{ color: PRIMARY }}>
                      Tutup
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-neutral-900">
            Lokasi Kami
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-96">
            {/* Google Maps Embed - Replace with your actual location */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.5227!2d106.7!3d-6.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTgnMDAuMCJTIDEwNsKwNDInMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
