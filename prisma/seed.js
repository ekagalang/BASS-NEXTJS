const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // ==================================================
    // 1. USERS
    // ==================================================
    console.log('👥 Seeding users...');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const users = await prisma.user.createMany({
      data: [
        {
          name: 'Admin BASS',
          email: 'admin@basstrainingacademy.com',
          password: hashedPassword,
          role: 'admin',
          phone: '081234567890',
          status: 'active'
        },
        {
          name: 'Instruktur Master',
          email: 'instruktur@basstrainingacademy.com',
          password: hashedPassword,
          role: 'instructor',
          phone: '081234567891',
          status: 'active'
        },
        {
          name: 'User Test',
          email: 'user@example.com',
          password: hashedPassword,
          role: 'user',
          phone: '081234567892',
          status: 'active'
        }
      ],
      skipDuplicates: true
    });
    console.log(`✓ Created ${users.count} users`);

    // ==================================================
    // 2. PROGRAM CATEGORIES
    // ==================================================
    console.log('\n📂 Seeding program categories...');

    await prisma.programCategory.createMany({
      data: [
        { name: 'Soft Skill', slug: 'soft-skill', description: 'Pelatihan untuk mengembangkan kemampuan soft skill', displayOrder: 1 },
        { name: 'Training of Trainer', slug: 'training-of-trainer', description: 'Pelatihan untuk menjadi trainer profesional', displayOrder: 2 },
        { name: 'Tenaga Kepelatihan', slug: 'tenaga-kepelatihan', description: 'Sertifikasi tenaga kepelatihan', displayOrder: 3 },
        { name: 'Manajemen SDM', slug: 'manajemen-sdm', description: 'Pelatihan manajemen sumber daya manusia', displayOrder: 4 },
        { name: 'Upskilling', slug: 'upskilling', description: 'Program peningkatan keterampilan', displayOrder: 5 },
        { name: 'Komunikasi', slug: 'komunikasi', description: 'Pelatihan komunikasi efektif', displayOrder: 6, parentId: 1 },
        { name: 'Leadership', slug: 'leadership', description: 'Pelatihan kepemimpinan', displayOrder: 7, parentId: 1 }
      ],
      skipDuplicates: true
    });
    console.log('✓ Created program categories');

    // ==================================================
    // 3. INSTRUCTORS
    // ==================================================
    console.log('\n👨‍🏫 Seeding instructors...');

    await prisma.instructor.createMany({
      data: [
        {
          name: 'Dr. Budi Santoso, M.M.',
          slug: 'dr-budi-santoso',
          level: 'master',
          bio: 'Praktisi HR dengan pengalaman 20 tahun di berbagai perusahaan multinasional',
          expertise: JSON.stringify(['Leadership', 'HR Management', 'Training Development']),
          email: 'budi.santoso@basstrainingacademy.com',
          phone: '081234567893',
          status: 'active',
          displayOrder: 1
        },
        {
          name: 'Ani Wijaya, S.Psi., M.Sc.',
          slug: 'ani-wijaya',
          level: 'senior',
          bio: 'Psikolog industri dan organisasi dengan spesialisasi dalam pengembangan soft skill',
          expertise: JSON.stringify(['Soft Skill', 'Psychology', 'Assessment']),
          email: 'ani.wijaya@basstrainingacademy.com',
          phone: '081234567894',
          status: 'active',
          displayOrder: 2
        },
        {
          name: 'Eko Prasetyo, S.Pd.',
          slug: 'eko-prasetyo',
          level: 'regular',
          bio: 'Trainer bersertifikat BNSP dengan fokus pada metodologi pelatihan',
          expertise: JSON.stringify(['Training Methods', 'Instructional Design', 'BNSP Certification']),
          email: 'eko.prasetyo@basstrainingacademy.com',
          phone: '081234567895',
          status: 'active',
          displayOrder: 3
        }
      ],
      skipDuplicates: true
    });
    console.log('✓ Created instructors');

    // ==================================================
    // 4. PROGRAMS
    // ==================================================
    console.log('\n📚 Seeding programs...');

    await prisma.program.createMany({
      data: [
        {
          title: 'Pelatihan Training of Trainer (ToT)',
          slug: 'pelatihan-training-of-trainer',
          categoryId: 2,
          description: 'Program pelatihan komprehensif untuk menjadi trainer profesional dengan sertifikasi BNSP',
          content: '<h2>Deskripsi Program</h2><p>Program Training of Trainer dirancang untuk membekali peserta dengan kompetensi sebagai trainer profesional.</p>',
          duration: '3 Hari',
          price: 3500000.00,
          instructorId: 1,
          status: 'published',
          metaTitle: 'Training of Trainer BNSP - Sertifikasi Trainer Profesional',
          metaDescription: 'Program pelatihan Training of Trainer dengan sertifikasi BNSP'
        },
        {
          title: 'Komunikasi Efektif untuk Profesional',
          slug: 'komunikasi-efektif-profesional',
          categoryId: 6,
          description: 'Tingkatkan kemampuan komunikasi Anda di tempat kerja',
          content: '<h2>Mengapa Komunikasi Penting?</h2><p>Komunikasi yang efektif adalah kunci kesuksesan dalam karir.</p>',
          duration: '2 Hari',
          price: 2500000.00,
          instructorId: 2,
          status: 'published',
          metaTitle: 'Pelatihan Komunikasi Efektif - BASS Training Academy',
          metaDescription: 'Tingkatkan skill komunikasi Anda dengan pelatihan komunikasi efektif'
        },
        {
          title: 'Leadership untuk Manager',
          slug: 'leadership-untuk-manager',
          categoryId: 7,
          description: 'Program pengembangan kepemimpinan untuk manager',
          content: '<h2>Menjadi Leader yang Efektif</h2><p>Program ini dirancang khusus untuk manager yang ingin mengembangkan kemampuan kepemimpinan.</p>',
          duration: '3 Hari',
          price: 4000000.00,
          instructorId: 1,
          status: 'published',
          metaTitle: 'Pelatihan Leadership untuk Manager - Sertifikasi BNSP',
          metaDescription: 'Program pengembangan kepemimpinan untuk manager'
        },
        {
          title: 'Manajemen SDM Strategis',
          slug: 'manajemen-sdm-strategis',
          categoryId: 4,
          description: 'Pelatihan komprehensif tentang manajemen sumber daya manusia',
          content: '<h2>Strategic HR Management</h2><p>Pelajari bagaimana mengelola SDM secara strategis.</p>',
          duration: '4 Hari',
          price: 5500000.00,
          instructorId: 1,
          status: 'published',
          metaTitle: 'Pelatihan Manajemen SDM Strategis - BASS Training',
          metaDescription: 'Program pelatihan manajemen SDM strategis'
        }
      ],
      skipDuplicates: true
    });
    console.log('✓ Created programs');

    // ==================================================
    // 5. SCHEDULES
    // ==================================================
    console.log('\n📅 Seeding schedules...');

    await prisma.schedule.createMany({
      data: [
        {
          programId: 1,
          startDate: new Date('2025-11-15'),
          endDate: new Date('2025-11-17'),
          startTime: new Date('2025-11-15T09:00:00'),
          endTime: new Date('2025-11-15T16:00:00'),
          location: 'Hotel Grand Mercure Jakarta',
          address: 'Jl. Menteng Raya No. 15, Jakarta Pusat',
          maxSeats: 20,
          availableSeats: 15,
          price: 3500000.00,
          status: 'upcoming'
        },
        {
          programId: 2,
          startDate: new Date('2025-11-20'),
          endDate: new Date('2025-11-21'),
          startTime: new Date('2025-11-20T09:00:00'),
          endTime: new Date('2025-11-20T17:00:00'),
          location: 'BASS Training Center',
          address: 'Jl. Titihan Raya Blok B9/HF12-7A Permata Bintaro',
          maxSeats: 15,
          availableSeats: 10,
          price: 2500000.00,
          status: 'upcoming'
        },
        {
          programId: 3,
          startDate: new Date('2025-12-05'),
          endDate: new Date('2025-12-07'),
          startTime: new Date('2025-12-05T08:30:00'),
          endTime: new Date('2025-12-05T16:30:00'),
          location: 'Hotel Aston Surabaya',
          address: 'Jl. Pemuda No. 23, Surabaya',
          maxSeats: 25,
          availableSeats: 18,
          price: 4000000.00,
          status: 'upcoming'
        }
      ],
      skipDuplicates: true
    });
    console.log('✓ Created schedules');

    // ==================================================
    // 6. POST CATEGORIES
    // ==================================================
    console.log('\n🏷️  Seeding post categories...');

    await prisma.postCategory.createMany({
      data: [
        { name: 'Berita', slug: 'berita', description: 'Berita terkini seputar BASS Training Academy' },
        { name: 'Tips & Artikel', slug: 'tips-artikel', description: 'Tips dan artikel pengembangan diri' },
        { name: 'Info Pelatihan', slug: 'info-pelatihan', description: 'Informasi program pelatihan terbaru' },
        { name: 'Sertifikasi', slug: 'sertifikasi', description: 'Informasi seputar sertifikasi BNSP' }
      ],
      skipDuplicates: true
    });
    console.log('✓ Created post categories');

    // ==================================================
    // 7. POSTS
    // ==================================================
    console.log('\n📝 Seeding posts...');

    await prisma.post.createMany({
      data: [
        {
          title: 'Tips Sukses Mengikuti Pelatihan Training of Trainer',
          slug: 'tips-sukses-training-of-trainer',
          content: '<h2>Persiapkan Diri Anda</h2><p>Mengikuti pelatihan Training of Trainer adalah langkah besar dalam karir Anda.</p>',
          excerpt: 'Panduan lengkap agar sukses mengikuti pelatihan Training of Trainer',
          categoryId: 2,
          authorId: 1,
          status: 'published',
          publishedAt: new Date(),
          metaTitle: 'Tips Sukses Mengikuti Pelatihan Training of Trainer',
          metaDescription: 'Panduan lengkap tips sukses mengikuti pelatihan Training of Trainer'
        },
        {
          title: 'Pentingnya Sertifikasi BNSP untuk Karir Profesional',
          slug: 'pentingnya-sertifikasi-bnsp',
          content: '<h2>Mengapa Sertifikasi BNSP Penting?</h2><p>Sertifikasi BNSP adalah bukti kompetensi yang diakui secara nasional.</p>',
          excerpt: 'Ketahui pentingnya memiliki sertifikasi BNSP untuk pengembangan karir',
          categoryId: 4,
          authorId: 1,
          status: 'published',
          publishedAt: new Date(),
          metaTitle: 'Pentingnya Sertifikasi BNSP untuk Karir Profesional',
          metaDescription: 'Kenali manfaat dan pentingnya sertifikasi BNSP'
        },
        {
          title: 'Jadwal Pelatihan Terbaru Bulan November 2025',
          slug: 'jadwal-pelatihan-november-2025',
          content: '<h2>Program Pelatihan November 2025</h2><p>Berikut jadwal pelatihan yang akan diselenggarakan pada bulan November 2025.</p>',
          excerpt: 'Lihat jadwal lengkap program pelatihan BASS Training Academy untuk bulan November 2025',
          categoryId: 3,
          authorId: 1,
          status: 'published',
          publishedAt: new Date(),
          metaTitle: 'Jadwal Pelatihan November 2025 - BASS Training Academy',
          metaDescription: 'Jadwal lengkap program pelatihan BASS Training Academy bulan November 2025'
        }
      ],
      skipDuplicates: true
    });
    console.log('✓ Created posts');

    // ==================================================
    // 8. PAGES
    // ==================================================
    console.log('\n📄 Seeding pages...');

    await prisma.page.createMany({
      data: [
        {
          title: 'Tentang Kami',
          slug: 'tentang-kami',
          content: '<h1>Tentang BASS Training Academy</h1><p>BASS Training Academy adalah lembaga pelatihan profesional.</p>',
          template: 'about',
          showInMenu: 'yes',
          status: 'published',
          metaTitle: 'Tentang BASS Training Academy - Lembaga Pelatihan Profesional',
          metaDescription: 'Kenali lebih dekat BASS Training Academy'
        },
        {
          title: 'Hubungi Kami',
          slug: 'hubungi-kami',
          content: '<h1>Hubungi BASS Training Academy</h1><p>Kami siap membantu Anda.</p>',
          template: 'contact',
          showInMenu: 'yes',
          status: 'published',
          metaTitle: 'Hubungi Kami - BASS Training Academy',
          metaDescription: 'Hubungi BASS Training Academy untuk informasi pelatihan'
        }
      ],
      skipDuplicates: true
    });
    console.log('✓ Created pages');

    // ==================================================
    // SUMMARY
    // ==================================================
    console.log('\n' + '='.repeat(60));
    console.log('✅ Database seeding completed!\n');

    const [
      totalUsers,
      totalPrograms,
      totalPosts,
      totalInstructors,
      totalSchedules,
      totalPages
    ] = await Promise.all([
      prisma.user.count(),
      prisma.program.count(),
      prisma.post.count(),
      prisma.instructor.count(),
      prisma.schedule.count(),
      prisma.page.count()
    ]);

    console.log('📈 Final Database Statistics:');
    console.log(`   👥 Users: ${totalUsers}`);
    console.log(`   📚 Programs: ${totalPrograms}`);
    console.log(`   📝 Posts: ${totalPosts}`);
    console.log(`   👨‍🏫 Instructors: ${totalInstructors}`);
    console.log(`   📅 Schedules: ${totalSchedules}`);
    console.log(`   📄 Pages: ${totalPages}`);
    console.log('='.repeat(60));
    console.log('\n🎉 Your database now has dummy data! Ready to go!\n');

  } catch (error) {
    console.error('❌ Error during seeding:');
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
