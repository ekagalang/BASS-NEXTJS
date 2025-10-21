# 🗄️ Database Files

Folder ini berisi file-file terkait database.

---

## 📁 File Contents

### `seed.sql` (Backup/Reference Only)
**Purpose:** Raw SQL seed data untuk reference atau backup

**Status:** ❌ **Tidak digunakan dalam workflow normal**

**Usage:**
- ✅ Berguna untuk: Backup, dokumentasi, atau migrasi manual jika diperlukan
- ❌ Tidak digunakan: Proyek menggunakan Prisma, bukan raw SQL

**Note:**
Proyek ini menggunakan **Prisma ORM**, jadi kita pakai `prisma/seed.js` untuk seeding, bukan file SQL ini.

---

## 🚀 How to Seed Database (RECOMMENDED)

Gunakan Prisma seed script:

```bash
# Seed database dengan Prisma
node prisma/seed.js

# Atau via npm script
npm run db:seed
```

**Keuntungan menggunakan Prisma seed:**
- ✅ Type-safe
- ✅ Database agnostic (MySQL, PostgreSQL, SQLite)
- ✅ Otomatis handle timestamps (`created_at`, `updated_at`)
- ✅ Easy to maintain (mengikuti schema changes otomatis)
- ✅ Tidak perlu worry tentang SQL syntax

---

## 📊 Database Schema Management

### Prisma Workflow (Yang Kita Pakai)

```bash
# 1. Generate Prisma Client (setelah install atau schema change)
npm run db:generate

# 2. Push schema ke database (development)
npm run db:push

# 3. Seed database dengan data dummy
npm run db:seed

# 4. Reset database & re-seed
npm run db:reset

# 5. Open Prisma Studio (GUI untuk manage data)
npm run db:studio
```

---

## 🔄 Alternative: Manual SQL Import (Tidak Recommended)

Jika **benar-benar perlu** import `seed.sql` secara manual:

### Via MySQL CLI
```bash
# Login dan import
mysql -u root -p bass < seed.sql

# Atau via MySQL prompt
mysql -u root -p
USE bass;
source /path/to/database/seed.sql;
```

**⚠️ Warning:**
- File `seed.sql` mungkin memiliki format yang berbeda dengan schema Prisma saat ini
- Bisa terjadi error karena timestamp fields (`created_at`, `updated_at`)
- **Lebih baik gunakan `prisma/seed.js`**

---

## 💾 Backup Database

Jika ingin create backup SQL:

```bash
# Full backup (schema + data)
mysqldump -u root -p bass > backup_$(date +%Y%m%d).sql

# Data only (no schema)
mysqldump -u root -p --no-create-info bass > data_backup.sql

# Specific tables only
mysqldump -u root -p --no-create-info bass users programs posts > seed_backup.sql
```

---

## 📝 Perbandingan: seed.sql vs prisma/seed.js

| Feature | `seed.sql` | `prisma/seed.js` |
|---------|------------|------------------|
| **Format** | Raw SQL | JavaScript/Prisma |
| **Type Safety** | ❌ No | ✅ Yes |
| **Database Agnostic** | ❌ MySQL only | ✅ Any database |
| **Timestamps** | ⚠️ Manual | ✅ Auto |
| **Maintenance** | ⚠️ Manual update | ✅ Auto follows schema |
| **Currently Used** | ❌ No | ✅ **Yes** |
| **Recommended** | ❌ No | ✅ **Yes** |

---

## ✅ Recommended Workflow

### Development
```bash
# 1. Setup awal (new device)
npm install
npm run db:generate
npm run db:push
npm run db:seed

# 2. Development
npm run dev

# 3. View/Edit data
npm run db:studio
```

### Reset Everything
```bash
# Reset database & re-seed (DESTRUCTIVE!)
npm run db:reset
```

### Backup untuk Production
```bash
# Export current data
mysqldump -u root -p bass > backup_production.sql
```

---

## 🎯 Summary

| File | Status | Usage |
|------|--------|-------|
| `seed.sql` | 📦 Backup/Reference | Tidak digunakan |
| `../prisma/seed.js` | ✅ **Active** | **Digunakan untuk seeding** |

**Kesimpulan:** Gunakan `prisma/seed.js` untuk semua database seeding! 🚀

---

## 🆘 Troubleshooting

### Error: "Can't connect to database"
```bash
# Check MySQL is running
# Windows: services.msc → MySQL
# Linux: sudo systemctl status mysql
# Mac: brew services list
```

### Error: "Prisma Client not generated"
```bash
npm run db:generate
```

### Error: "Database schema out of sync"
```bash
npm run db:push
```

---

**Last Updated:** 2025-10-20
**Prisma Version:** 6.17.1
**Database:** MySQL (switchable to PostgreSQL, SQLite, etc.)
