-- ============================================
-- SEED DATA: BASS Training Academy
-- Version: 1.0
-- Description: Sample data untuk development & testing
-- ============================================

USE bass;

-- ============================================
-- 1. USERS & AUTHENTICATION
-- ============================================

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role, phone, status) VALUES
('Admin BASS', 'admin@basstrainingacademy.com', '$2a$10$rKvVPpq6wX8YHc7qG5dZCOxGE3dJXmZ.3oFZhBvGlFZONpQKKQXDa', 'admin', '081234567890', 'active'),
('Instruktur Master', 'instruktur@basstrainingacademy.com', '$2a$10$rKvVPpq6wX8YHc7qG5dZCOxGE3dJXmZ.3oFZhBvGlFZONpQKKQXDa', 'instructor', '081234567891', 'active'),
('User Test', 'user@example.com', '$2a$10$rKvVPpq6wX8YHc7qG5dZCOxGE3dJXmZ.3oFZhBvGlFZONpQKKQXDa', 'user', '081234567892', 'active');

-- ============================================
-- 2. PROGRAM CATEGORIES
-- ============================================

INSERT INTO program_categories (name, slug, description, parent_id, display_order) VALUES
('Soft Skill', 'soft-skill', 'Pelatihan untuk mengembangkan kemampuan soft skill', NULL, 1),
('Training of Trainer', 'training-of-trainer', 'Pelatihan untuk menjadi trainer profesional', NULL, 2),
('Tenaga Kepelatihan', 'tenaga-kepelatihan', 'Sertifikasi tenaga kepelatihan', NULL, 3),
('Manajemen SDM', 'manajemen-sdm', 'Pelatihan manajemen sumber daya manusia', NULL, 4),
('Upskilling', 'upskilling', 'Program peningkatan keterampilan', NULL, 5),
('Komunikasi', 'komunikasi', 'Pelatihan komunikasi efektif', 1, 6),
('Leadership', 'leadership', 'Pelatihan kepemimpinan', 1, 7);

-- ============================================
-- 3. INSTRUCTORS
-- ============================================

INSERT INTO instructors (name, slug, level, bio, expertise, email, phone, status, display_order) VALUES
('Dr. Budi Santoso, M.M.', 'dr-budi-santoso', 'master', 
 'Praktisi HR dengan pengalaman 20 tahun di berbagai perusahaan multinasional. Memiliki sertifikasi BNSP dan internasional di bidang HRM.',
 '["Leadership", "HR Management", "Training Development"]',
 'budi.santoso@basstrainingacademy.com', '081234567893', 'active', 1),
 
('Ani Wijaya, S.Psi., M.Sc.', 'ani-wijaya', 'senior',
 'Psikolog industri dan organisasi dengan spesialisasi dalam pengembangan soft skill dan assessment.',
 '["Soft Skill", "Psychology", "Assessment"]',
 'ani.wijaya@basstrainingacademy.com', '081234567894', 'active', 2),
 
('Eko Prasetyo, S.Pd.', 'eko-prasetyo', 'regular',
 'Trainer bersertifikat BNSP dengan fokus pada metodologi pelatihan dan pengembangan instruktur.',
 '["Training Methods", "Instructional Design", "BNSP Certification"]',
 'eko.prasetyo@basstrainingacademy.com', '081234567895', 'active', 3);

-- ============================================
-- 4. PROGRAMS
-- ============================================

INSERT INTO programs (title, slug, category_id, description, content, duration, price, instructor_id, status, meta_title, meta_description) VALUES
('Pelatihan Training of Trainer (ToT)', 
 'pelatihan-training-of-trainer',
 2,
 'Program pelatihan komprehensif untuk menjadi trainer profesional dengan sertifikasi BNSP',
 '<h2>Deskripsi Program</h2><p>Program Training of Trainer dirancang untuk membekali peserta dengan kompetensi sebagai trainer profesional. Program ini mencakup metodologi pelatihan, teknik presentasi, dan penilaian pembelajaran.</p><h3>Yang Akan Dipelajari:</h3><ul><li>Prinsip-prinsip pembelajaran orang dewasa</li><li>Desain program pelatihan</li><li>Teknik fasilitasi dan presentasi</li><li>Evaluasi dan penilaian pelatihan</li><li>Persiapan sertifikasi BNSP</li></ul>',
 '3 Hari',
 3500000.00,
 1,
 'published',
 'Training of Trainer BNSP - Sertifikasi Trainer Profesional',
 'Program pelatihan Training of Trainer dengan sertifikasi BNSP. Menjadi trainer profesional yang kompeten dan tersertifikasi.'),

('Komunikasi Efektif untuk Profesional',
 'komunikasi-efektif-profesional',
 6,
 'Tingkatkan kemampuan komunikasi Anda di tempat kerja dengan teknik-teknik komunikasi yang terbukti efektif',
 '<h2>Mengapa Komunikasi Penting?</h2><p>Komunikasi yang efektif adalah kunci kesuksesan dalam karir. Program ini akan mengajarkan Anda cara berkomunikasi dengan percaya diri, jelas, dan persuasif.</p><h3>Materi Pelatihan:</h3><ul><li>Dasar-dasar komunikasi interpersonal</li><li>Active listening</li><li>Komunikasi verbal dan non-verbal</li><li>Presentasi yang impactful</li><li>Negosiasi dan persuasi</li></ul>',
 '2 Hari',
 2500000.00,
 2,
 'published',
 'Pelatihan Komunikasi Efektif - BASS Training Academy',
 'Tingkatkan skill komunikasi Anda dengan pelatihan komunikasi efektif untuk profesional dari BASS Training Academy.'),

('Leadership untuk Manager',
 'leadership-untuk-manager',
 7,
 'Program pengembangan kepemimpinan untuk manager yang ingin meningkatkan efektivitas tim',
 '<h2>Menjadi Leader yang Efektif</h2><p>Program ini dirancang khusus untuk manager yang ingin mengembangkan kemampuan kepemimpinan mereka dan membangun tim yang solid.</p><h3>Topik Bahasan:</h3><ul><li>Leadership vs Management</li><li>Motivasi tim</li><li>Delegation & empowerment</li><li>Conflict resolution</li><li>Performance management</li><li>Change management</li></ul>',
 '3 Hari',
 4000000.00,
 1,
 'published',
 'Pelatihan Leadership untuk Manager - Sertifikasi BNSP',
 'Program pengembangan kepemimpinan untuk manager. Tingkatkan kemampuan memimpin tim dengan efektif.'),

('Manajemen SDM Strategis',
 'manajemen-sdm-strategis',
 4,
 'Pelatihan komprehensif tentang manajemen sumber daya manusia dari perspektif strategis',
 '<h2>Strategic HR Management</h2><p>Pelajari bagaimana mengelola SDM secara strategis untuk mendukung tujuan bisnis organisasi.</p><h3>Materi:</h3><ul><li>HR Planning & Analytics</li><li>Talent Acquisition</li><li>Learning & Development</li><li>Performance Management System</li><li>Compensation & Benefits</li><li>Employee Engagement</li></ul>',
 '4 Hari',
 5500000.00,
 1,
 'published',
 'Pelatihan Manajemen SDM Strategis - BASS Training',
 'Program pelatihan manajemen SDM strategis. Kelola sumber daya manusia dengan pendekatan strategis dan terukur.');

 -- ============================================
-- 4.5 PROGRAM INSTRUCTORS (Junction Table)
-- ============================================

INSERT INTO program_instructors (program_id, instructor_id) VALUES
(1, 1), -- Training of Trainer dengan Dr. Budi Santoso
(1, 3), -- Training of Trainer dengan Eko Prasetyo
(2, 2), -- Komunikasi Efektif dengan Ani Wijaya
(3, 1), -- Leadership dengan Dr. Budi Santoso
(4, 1); -- Manajemen SDM dengan Dr. Budi Santoso

-- ============================================
-- 5. SCHEDULES
-- ============================================

INSERT INTO schedules (program_id, start_date, end_date, start_time, end_time, location, address, max_seats, available_seats, price, status) VALUES
(1, '2025-11-15', '2025-11-17', '09:00:00', '16:00:00', 
 'Hotel Grand Mercure Jakarta', 'Jl. Menteng Raya No. 15, Jakarta Pusat',
 20, 15, 3500000.00, 'upcoming'),
 
(1, '2025-12-10', '2025-12-12', '09:00:00', '16:00:00',
 'Hotel Santika Bandung', 'Jl. Sumatera No. 52, Bandung',
 20, 20, 3500000.00, 'upcoming'),

(2, '2025-11-20', '2025-11-21', '09:00:00', '17:00:00',
 'BASS Training Center', 'Jl. Titihan Raya Blok B9/HF12-7A Permata Bintaro',
 15, 10, 2500000.00, 'upcoming'),

(3, '2025-12-05', '2025-12-07', '08:30:00', '16:30:00',
 'Hotel Aston Surabaya', 'Jl. Pemuda No. 23, Surabaya',
 25, 18, 4000000.00, 'upcoming'),

(4, '2025-11-25', '2025-11-28', '09:00:00', '16:00:00',
 'Hotel Santika Premiere Yogyakarta', 'Jl. Jend. Sudirman No. 19, Yogyakarta',
 20, 12, 5500000.00, 'upcoming');

 -- ============================================
-- 5.5 PROGRAM INSTRUCTORS (Junction Table)
-- ============================================

INSERT INTO program_instructors (program_id, instructor_id) VALUES
(1, 1), -- ToT dengan Dr. Budi Santoso
(1, 3), -- ToT dengan Eko Prasetyo
(2, 2), -- Komunikasi Efektif dengan Ani Wijaya
(3, 1), -- Leadership dengan Dr. Budi Santoso
(4, 1); -- Manajemen SDM dengan Dr. Budi Santoso

-- ============================================
-- 6. PAGES
-- ============================================

INSERT INTO pages (title, slug, content, template, show_in_menu, status, meta_title, meta_description) VALUES
('Tentang Kami',
 'tentang-kami',
 '<h1>Tentang BASS Training Academy</h1><p>BASS Training Academy (Bintang Anugrah Surya Semesta) adalah lembaga pelatihan profesional yang berfokus pada pengembangan sumber daya manusia melalui program-program pelatihan berkualitas dan tersertifikasi BNSP.</p><h2>Visi Kami</h2><p>Menjadi lembaga pelatihan terkemuka di Indonesia yang menghasilkan SDM profesional dan kompeten.</p><h2>Misi Kami</h2><ul><li>Menyelenggarakan program pelatihan berkualitas tinggi</li><li>Memberikan sertifikasi yang diakui secara nasional</li><li>Meningkatkan kompetensi SDM Indonesia</li><li>Bermitra dengan industri untuk pengembangan SDM</li></ul>',
 'about',
 'yes',
 'published',
 'Tentang BASS Training Academy - Lembaga Pelatihan Profesional',
 'Kenali lebih dekat BASS Training Academy, lembaga pelatihan profesional dengan sertifikasi BNSP untuk pengembangan SDM berkualitas.'),

('Hubungi Kami',
 'hubungi-kami',
 '<h1>Hubungi BASS Training Academy</h1><p>Kami siap membantu Anda dalam pengembangan kompetensi dan karir. Hubungi kami melalui:</p><h2>Alamat Kantor</h2><p>Jl. Titihan Raya Blok B9/HF12-7A Permata Bintaro<br>Tangerang Selatan, Banten 15227</p><h2>Kontak</h2><p>Email: admin@basstrainingacademy.com<br>Telepon: (021) 1234-5678<br>WhatsApp: 0812-3456-7890</p><h2>Jam Operasional</h2><p>Senin - Jumat: 09:00 - 17:00 WIB<br>Sabtu: 09:00 - 14:00 WIB<br>Minggu & Libur: Tutup</p>',
 'contact',
 'yes',
 'published',
 'Hubungi Kami - BASS Training Academy',
 'Hubungi BASS Training Academy untuk informasi pelatihan dan sertifikasi. Kami siap membantu pengembangan kompetensi Anda.'),

('Visi & Misi',
 'visi-misi',
 '<h1>Visi & Misi BASS Training Academy</h1><h2>Visi</h2><p>Menjadi lembaga pelatihan dan pengembangan SDM terdepan di Indonesia yang menghasilkan tenaga profesional berkompeten tinggi dan tersertifikasi.</p><h2>Misi</h2><ol><li>Menyelenggarakan program pelatihan berkualitas tinggi sesuai standar BNSP</li><li>Mengembangkan metode pembelajaran inovatif dan efektif</li><li>Membangun kemitraan strategis dengan industri dan institusi pendidikan</li><li>Meningkatkan aksesibilitas pelatihan untuk seluruh lapisan masyarakat</li><li>Berkontribusi dalam peningkatan daya saing SDM Indonesia</li></ol><h2>Nilai-Nilai Kami</h2><ul><li><strong>Profesional:</strong> Menjalankan setiap program dengan standar profesional tertinggi</li><li><strong>Integritas:</strong> Berkomitmen pada kejujuran dan transparansi</li><li><strong>Inovasi:</strong> Terus berinovasi dalam metode dan materi pelatihan</li><li><strong>Kualitas:</strong> Mengutamakan kualitas dalam setiap aspek</li><li><strong>Kolaborasi:</strong> Membangun kerjasama yang saling menguntungkan</li></ul>',
 'default',
 'yes',
 'published',
 'Visi & Misi BASS Training Academy',
 'Visi dan misi BASS Training Academy dalam mengembangkan SDM Indonesia yang profesional dan kompeten.');

-- ============================================
-- 7. POST CATEGORIES
-- ============================================

INSERT INTO post_categories (name, slug, description) VALUES
('Berita', 'berita', 'Berita terkini seputar BASS Training Academy'),
('Tips & Artikel', 'tips-artikel', 'Tips dan artikel pengembangan diri'),
('Info Pelatihan', 'info-pelatihan', 'Informasi program pelatihan terbaru'),
('Sertifikasi', 'sertifikasi', 'Informasi seputar sertifikasi BNSP');

-- ============================================
-- 8. POSTS (Blog/Artikel)
-- ============================================

INSERT INTO posts (title, slug, content, excerpt, category_id, author_id, status, published_at, meta_title, meta_description) VALUES
('Tips Sukses Mengikuti Pelatihan Training of Trainer',
 'tips-sukses-training-of-trainer',
 '<h2>Persiapkan Diri Anda</h2><p>Mengikuti pelatihan Training of Trainer adalah langkah besar dalam karir Anda sebagai profesional. Berikut tips agar Anda sukses:</p><h3>1. Lakukan Riset</h3><p>Pelajari materi dasar tentang metodologi pelatihan sebelum mengikuti program.</p><h3>2. Persiapkan Mental</h3><p>Bersiaplah untuk praktik langsung dan menerima feedback konstruktif.</p><h3>3. Networking</h3><p>Manfaatkan kesempatan untuk berkenalan dengan sesama peserta dan instruktur.</p>',
 'Panduan lengkap agar sukses mengikuti pelatihan Training of Trainer dan mendapatkan sertifikasi BNSP',
 2,
 1,
 'published',
 NOW(),
 'Tips Sukses Mengikuti Pelatihan Training of Trainer',
 'Panduan lengkap tips sukses mengikuti pelatihan Training of Trainer dan mendapatkan sertifikasi BNSP.'),

('Pentingnya Sertifikasi BNSP untuk Karir Profesional',
 'pentingnya-sertifikasi-bnsp',
 '<h2>Mengapa Sertifikasi BNSP Penting?</h2><p>Sertifikasi BNSP (Badan Nasional Sertifikasi Profesi) adalah bukti kompetensi yang diakui secara nasional.</p><h3>Manfaat Sertifikasi BNSP:</h3><ul><li>Diakui oleh industri dan pemerintah</li><li>Meningkatkan kredibilitas profesional</li><li>Membuka peluang karir lebih luas</li><li>Standar kompetensi terukur</li><li>Berlaku secara nasional</li></ul>',
 'Ketahui pentingnya memiliki sertifikasi BNSP untuk pengembangan karir profesional Anda',
 4,
 1,
 'published',
 NOW(),
 'Pentingnya Sertifikasi BNSP untuk Karir Profesional',
 'Kenali manfaat dan pentingnya sertifikasi BNSP untuk meningkatkan kompetensi dan kredibilitas profesional Anda.'),

('Jadwal Pelatihan Terbaru Bulan November 2025',
 'jadwal-pelatihan-november-2025',
 '<h2>Program Pelatihan November 2025</h2><p>Berikut jadwal pelatihan yang akan diselenggarakan pada bulan November 2025:</p><h3>Training of Trainer</h3><p>Tanggal: 15-17 November 2025<br>Lokasi: Hotel Grand Mercure Jakarta</p><h3>Komunikasi Efektif</h3><p>Tanggal: 20-21 November 2025<br>Lokasi: BASS Training Center</p><p>Daftar sekarang! Tempat terbatas.</p>',
 'Lihat jadwal lengkap program pelatihan BASS Training Academy untuk bulan November 2025',
 3,
 1,
 'published',
 NOW(),
 'Jadwal Pelatihan November 2025 - BASS Training Academy',
 'Jadwal lengkap program pelatihan BASS Training Academy bulan November 2025. Daftar sekarang, tempat terbatas!');

-- ============================================
-- 9. CONTACTS (Sample)
-- ============================================

INSERT INTO contacts (name, email, phone, subject, message, status) VALUES
('John Doe', 'john@example.com', '081234567890', 
 'Informasi Pelatihan ToT', 
 'Saya ingin mendapatkan informasi lebih lanjut mengenai program Training of Trainer. Apakah ada jadwal untuk bulan depan?',
 'unread'),
 
('Jane Smith', 'jane@company.com', '081234567891',
 'Corporate Training',
 'Kami dari PT ABC tertarik untuk mengadakan in-house training untuk 30 karyawan. Mohon info lebih lanjut.',
 'read');

-- ============================================
-- 10. NEWSLETTER SUBSCRIBERS
-- ============================================

INSERT INTO newsletter_subscribers (email, name, status) VALUES
('subscriber1@example.com', 'Ahmad Subscriber', 'active'),
('subscriber2@example.com', 'Budi Newsletter', 'active'),
('subscriber3@example.com', 'Citra Info', 'active');

-- ============================================
-- 11. CHAT BOT RULES
-- ============================================

INSERT INTO chat_bot_rules (trigger_keyword, response_text, priority, is_active) VALUES
('halo,hi,hello,hai', 
 'Halo! Selamat datang di BASS Training Academy. Saya asisten virtual BASS. Ada yang bisa saya bantu? 😊',
 1, TRUE),

('jadwal,schedule,kapan',
 'Untuk melihat jadwal pelatihan terbaru, Anda bisa mengunjungi halaman Jadwal Pelatihan kami atau saya hubungkan dengan tim admin?',
 2, TRUE),

('harga,biaya,price,cost',
 'Untuk informasi harga program pelatihan, silakan hubungi tim kami di 0812-3456-7890 atau email ke admin@basstrainingacademy.com',
 3, TRUE),

('tot,trainer,training of trainer',
 'Training of Trainer adalah program unggulan kami! Program ini bersertifikasi BNSP dan berlangsung 3 hari. Apakah Anda ingin informasi lebih detail?',
 4, TRUE),

('lokasi,alamat,dimana,location',
 'Kantor kami berlokasi di Jl. Titihan Raya Blok B9/HF12-7A Permata Bintaro, Tangerang Selatan. Untuk pelatihan, kami menyelenggarakan di berbagai lokasi sesuai jadwal.',
 5, TRUE),

('terima kasih,thanks,thank you',
 'Sama-sama! Senang bisa membantu Anda. Jika ada pertanyaan lain, jangan ragu untuk bertanya ya! 😊',
 6, TRUE),

('admin,customer service,cs,hubungi',
 'Baik, saya akan menghubungkan Anda dengan admin kami. Mohon tunggu sebentar...',
 10, TRUE);

-- ============================================
-- 12. SETTINGS
-- ============================================

INSERT INTO settings (`key`, value, type, `group`, description) VALUES
-- General Settings
('site_name', 'BASS Training Academy', 'text', 'general', 'Nama website'),
('site_tagline', 'Lembaga Pelatihan Profesional Bersertifikasi BNSP', 'text', 'general', 'Tagline website'),
('site_description', 'BASS Training Academy adalah lembaga pelatihan profesional yang menyediakan program pelatihan berkualitas dengan sertifikasi BNSP untuk pengembangan SDM Indonesia.', 'text', 'general', 'Deskripsi website'),
('site_logo', '/assets/logo.png', 'text', 'general', 'Logo website'),
('site_favicon', '/assets/favicon.ico', 'text', 'general', 'Favicon'),

-- Contact Settings
('contact_email', 'admin@basstrainingacademy.com', 'text', 'contact', 'Email kontak'),
('contact_phone', '(021) 1234-5678', 'text', 'contact', 'Nomor telepon'),
('contact_whatsapp', '6281234567890', 'text', 'contact', 'WhatsApp (format: 62xxx)'),
('contact_address', 'Jl. Titihan Raya Blok B9/HF12-7A Permata Bintaro, Tangerang Selatan, Banten 15227', 'text', 'contact', 'Alamat kantor'),

-- Social Media
('social_facebook', 'https://facebook.com/basstrainingacademy', 'text', 'social', 'Facebook URL'),
('social_instagram', 'https://instagram.com/basstrainingacademy', 'text', 'social', 'Instagram URL'),
('social_linkedin', 'https://linkedin.com/company/basstrainingacademy', 'text', 'social', 'LinkedIn URL'),
('social_youtube', 'https://youtube.com/@basstrainingacademy', 'text', 'social', 'YouTube URL'),

-- SEO Settings
('seo_default_title', 'BASS Training Academy - Pelatihan Profesional Bersertifikasi BNSP', 'text', 'seo', 'Default SEO title'),
('seo_default_description', 'Lembaga pelatihan profesional dengan program berkualitas dan sertifikasi BNSP. Training of Trainer, Leadership, SDM, dan berbagai program pengembangan kompetensi.', 'text', 'seo', 'Default SEO description'),
('seo_keywords', 'pelatihan, training, sertifikasi BNSP, training of trainer, leadership, SDM, soft skill', 'text', 'seo', 'Default keywords'),

-- Email Settings
('email_from_name', 'BASS Training Academy', 'text', 'email', 'Nama pengirim email'),
('email_from_address', 'noreply@basstrainingacademy.com', 'text', 'email', 'Email pengirim'),

-- Features
('enable_chat', 'true', 'boolean', 'features', 'Enable chat widget'),
('enable_newsletter', 'true', 'boolean', 'features', 'Enable newsletter subscription'),
('enable_registration', 'true', 'boolean', 'features', 'Enable user registration');

-- ============================================
-- 13. GALLERIES
-- ============================================

INSERT INTO galleries (title, slug, description, images, status, display_order) VALUES
('Pelatihan Training of Trainer - Batch 15',
 'pelatihan-tot-batch-15',
 'Dokumentasi pelaksanaan Training of Trainer Batch 15 di Hotel Grand Mercure Jakarta',
 '[]',
 'published',
 1),

('Workshop Leadership 2024',
 'workshop-leadership-2024',
 'Galeri foto kegiatan Workshop Leadership untuk Manager tahun 2024',
 '[]',
 'published',
 2),

('Sertifikasi BNSP Oktober 2024',
 'sertifikasi-bnsp-oktober-2024',
 'Momen penyerahan sertifikat BNSP kepada peserta pelatihan',
 '[]',
 'published',
 3);

-- ============================================
-- END OF SEED DATA
-- ============================================

-- Verification Queries
SELECT 'Users created:' as Info, COUNT(*) as Total FROM users;
SELECT 'Programs created:' as Info, COUNT(*) as Total FROM programs;
SELECT 'Schedules created:' as Info, COUNT(*) as Total FROM schedules;
SELECT 'Pages created:' as Info, COUNT(*) as Total FROM pages;
SELECT 'Posts created:' as Info, COUNT(*) as Total FROM posts;
SELECT 'Chat bot rules:' as Info, COUNT(*) as Total FROM chat_bot_rules;
SELECT 'Settings configured:' as Info, COUNT(*) as Total FROM settings;