import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Elevate Your Skills with Professional Training
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Expert-led courses designed to empower individuals and transform
              organizations
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/training"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
              >
                Explore Courses
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition text-center"
              >
                Request Consultation
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose BASS Training Academy?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We deliver excellence through proven methodologies and industry
              expertise
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Expert Trainers",
                desc: "Learn from industry professionals with real-world experience",
                icon: "👨‍🏫",
              },
              {
                title: "Flexible Learning",
                desc: "Choose from in-person, online, or hybrid training formats",
                icon: "⚡",
              },
              {
                title: "Practical Approach",
                desc: "Hands-on exercises and real case studies",
                icon: "🎯",
              },
              {
                title: "Certification",
                desc: "Receive recognized certificates upon completion",
                icon: "🏆",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-lg hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Training Programs */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Training Programs
            </h2>
            <p className="text-gray-600 text-lg">
              Discover our most popular courses
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Leadership Excellence",
                category: "Management",
                duration: "3 Days",
                level: "Intermediate",
                desc: "Develop essential leadership skills to drive team success and organizational growth",
              },
              {
                title: "Project Management Professional",
                category: "Project Management",
                duration: "5 Days",
                level: "Advanced",
                desc: "Master project management methodologies and earn PMP certification",
              },
              {
                title: "Digital Marketing Mastery",
                category: "Marketing",
                duration: "4 Days",
                level: "Beginner to Intermediate",
                desc: "Learn cutting-edge digital marketing strategies and tools",
              },
            ].map((training, i) => (
              <div
                key={i}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700"></div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {training.category}
                    </span>
                    <span>•</span>
                    <span>{training.duration}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {training.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">{training.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {training.level}
                    </span>
                    <Link
                      href="/training"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/training"
              className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              View All Training Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Training Solutions
            </h2>
            <p className="text-gray-600 text-lg">
              Tailored services to meet your organization's needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Corporate Training",
                desc: "Customized training programs designed specifically for your organization's goals and culture",
                features: [
                  "Custom curriculum",
                  "On-site delivery",
                  "Post-training support",
                ],
              },
              {
                title: "Public Workshops",
                desc: "Join our open enrollment sessions and network with professionals from various industries",
                features: [
                  "Industry networking",
                  "Flexible schedule",
                  "Certificate included",
                ],
              },
              {
                title: "Consulting Services",
                desc: "Expert guidance to help you implement best practices and optimize your operations",
                features: [
                  "Process improvement",
                  "Change management",
                  "Performance optimization",
                ],
              },
            ].map((service, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-lg border-2 border-gray-100 hover:border-blue-500 transition"
              >
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.desc}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <svg
                        className="w-5 h-5 text-green-500"
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
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/services"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Explore Service →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Training Programs" },
              { number: "10,000+", label: "Participants Trained" },
              { number: "15+", label: "Years Experience" },
              { number: "98%", label: "Satisfaction Rate" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-200 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 text-lg">
              Real feedback from real professionals
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "HR Director, Tech Corp",
                text: "The training programs have significantly improved our team's performance. Highly recommended!",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Project Manager",
                text: "Excellent content delivered by knowledgeable instructors. Worth every penny!",
                rating: 5,
              },
              {
                name: "Amanda Williams",
                role: "Marketing Lead",
                text: "Practical, engaging, and immediately applicable. Best training investment we've made.",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest Insights
            </h2>
            <p className="text-gray-600 text-lg">
              Stay updated with industry trends and tips
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "5 Leadership Skills Every Manager Needs in 2024",
                date: "Oct 1, 2024",
                category: "Leadership",
                excerpt:
                  "Discover the essential leadership competencies that will set you apart in today's dynamic business environment...",
              },
              {
                title: "The Future of Corporate Training: Trends to Watch",
                date: "Sep 28, 2024",
                category: "Industry Trends",
                excerpt:
                  "Explore how technology and changing workforce dynamics are reshaping corporate learning...",
              },
              {
                title: "Maximizing ROI from Employee Training Programs",
                date: "Sep 25, 2024",
                category: "Training Tips",
                excerpt:
                  "Learn proven strategies to measure and increase the return on investment from your training initiatives...",
              },
            ].map((post, i) => (
              <article
                key={i}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 hover:text-blue-600 transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link
                    href="/blog"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Team?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Let's discuss how our training solutions can help you achieve your
            organizational goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/training"
              className="inline-block border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition"
            >
              Browse Training Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
