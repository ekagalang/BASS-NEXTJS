# 🚀 Setup From Scratch - New Device/Fresh Install

Panduan lengkap setup proyek BASS Training Academy dengan Prisma ORM dari awal.

> **Quick Setup:** Gunakan `setup.bat` (Windows) atau `./setup.sh` (Linux/Mac) untuk automated setup!

---

## 📋 Prerequisites

Pastikan sudah terinstall:
- ✅ **Node.js** (v18 atau lebih baru)
- ✅ **npm** atau **yarn** atau **pnpm**
- ✅ **Git**
- ✅ **MySQL** (atau PostgreSQL/SQLite)

---

## ⚡ Automated Setup (Recommended)

### Windows
```bash
setup.bat
```

### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

Script akan otomatis handle semua step berikut. Jika ingin manual setup, lanjutkan baca di bawah.

---

## 🔧 Manual Step-by-Step Setup

### 1. Clone Repository

```bash
# Clone dari GitHub
git clone https://github.com/your-username/BASS-NEXTJS.git
cd BASS-NEXTJS

# Atau jika sudah ada folder
cd path/to/BASS-NEXTJS
```

---

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

**Note:** `postinstall` script akan otomatis menjalankan `prisma generate`

---

### 3. Setup Database

#### Option A: MySQL (Default)

1. **Install MySQL** (jika belum):
   - **Windows**: Download dari [mysql.com](https://dev.mysql.com/downloads/installer/)
   - **Mac**: `brew install mysql`
   - **Linux**: `sudo apt install mysql-server`

2. **Start MySQL Service**:
   ```bash
   # Windows
   net start MySQL80

   # Mac
   brew services start mysql

   # Linux
   sudo systemctl start mysql
   ```

3. **Create Database**:
   ```bash
   # Login ke MySQL
   mysql -u root -p

   # Create database
   CREATE DATABASE bass_training CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

   # Create user (optional, recommended for production)
   CREATE USER 'bass_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON bass_training.* TO 'bass_user'@'localhost';
   FLUSH PRIVILEGES;

   # Exit
   EXIT;
   ```

#### Option B: PostgreSQL

1. **Install PostgreSQL**:
   - **Windows**: Download dari [postgresql.org](https://www.postgresql.org/download/)
   - **Mac**: `brew install postgresql`
   - **Linux**: `sudo apt install postgresql`

2. **Create Database**:
   ```bash
   # Login
   psql -U postgres

   # Create database
   CREATE DATABASE bass_training;

   # Create user
   CREATE USER bass_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE bass_training TO bass_user;

   # Exit
   \q
   ```

#### Option C: SQLite (Untuk Development)

Tidak perlu install apapun! SQLite akan otomatis membuat file database.

---

### 4. Setup Environment Variables

```bash
# Copy .env.example ke .env.local
cp .env.example .env.local

# Windows (PowerShell)
Copy-Item .env.example .env.local

# Atau manual copy file di file explorer
```

**Edit `.env.local`:**

#### Untuk MySQL:
```env
# Database URL
DATABASE_URL="mysql://root:your_mysql_password@localhost:3306/bass_training"

# Legacy fields (optional, untuk backward compatibility)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bass_training

# JWT Secret (PENTING: Generate yang baru!)
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Upload Config
UPLOAD_MAX_SIZE=5242880
UPLOAD_DIR=./public/uploads
```

#### Untuk PostgreSQL:
```env
DATABASE_URL="postgresql://bass_user:your_password@localhost:5432/bass_training"
```

#### Untuk SQLite:
```env
DATABASE_URL="file:./dev.db"
```

**PENTING:** Generate JWT Secret yang secure:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Atau gunakan online generator
# https://generate-secret.vercel.app/32
```

---

### 5. Setup Prisma

#### A. Generate Prisma Client

```bash
npm run db:generate
# atau
npx prisma generate
```

**Output yang diharapkan:**
```
✔ Generated Prisma Client (v6.x.x) to ./node_modules/@prisma/client
```

#### B. Push Schema ke Database

**Untuk Development (Recommended):**
```bash
npm run db:push
# atau
npx prisma db push
```

**Untuk Production (Recommended):**
```bash
npm run db:migrate
# atau
npx prisma migrate dev --name init
```

**Output yang diharapkan:**
```
✔ Your database is now in sync with your schema.
```

---

### 6. Seed Database

Seed database dengan data dummy (users, programs, posts, dll):

```bash
node prisma/seed.js
```

**Output:**
```
🌱 Starting database seeding...
👥 Seeding users...
✓ Created 3 users
📚 Seeding programs...
✓ Created 4 programs
📝 Seeding posts...
✓ Created 3 posts
...
🎉 Your database now has dummy data!
```

**Login Credentials:**
- Email: `admin@basstrainingacademy.com`
- Password: `admin123`

---

### 7. Verify Setup

#### A. Test Database Connection

```bash
# Start dev server
npm run dev
```

Buka browser: `http://localhost:3000/api/test-db`

**Expected response:**
```json
{
  "success": true,
  "message": "Database connection successful",
  "database": "bass_training",
  "users": 1,
  "programs": 0
}
```

#### B. Open Prisma Studio

```bash
npm run db:studio
# atau
npx prisma studio
```

Browser akan terbuka di: `http://localhost:5555`

Anda bisa browse dan edit database dengan GUI!

---

### 8. Start Development

```bash
npm run dev
```

**Server akan running di:**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api
- Prisma Studio: `npm run db:studio` → http://localhost:5555

---

## 🔄 Setup untuk Database Provider Lain

### Switch dari MySQL ke PostgreSQL

1. **Edit `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"  // Ubah dari "mysql"
  url      = env("DATABASE_URL")
}
```

2. **Update `.env.local`:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bass_training"
```

3. **Generate & Push:**
```bash
npm run db:generate
npm run db:push
```

### Switch ke SQLite (Development)

1. **Edit `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

2. **Update `.env.local`:**
```env
DATABASE_URL="file:./dev.db"
```

3. **Generate & Push:**
```bash
npm run db:generate
npm run db:push
```

---

## 📦 Quick Setup Script

Buat file `setup.sh` (Linux/Mac) atau `setup.bat` (Windows):

### Linux/Mac (`setup.sh`):
```bash
#!/bin/bash
echo "🚀 Setting up BASS Training Academy..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy env file
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local..."
  cp .env.example .env.local
  echo "⚠️  Please edit .env.local and add your DATABASE_URL!"
  read -p "Press enter after updating .env.local..."
fi

# Generate Prisma Client
echo "🔨 Generating Prisma Client..."
npm run db:generate

# Push schema to database
echo "💾 Syncing database schema..."
npm run db:push

# Create admin user
echo "👤 Creating admin user..."
node scripts/create-admin.js

echo "✅ Setup complete!"
echo "🚀 Run 'npm run dev' to start the development server"
echo "🎨 Run 'npm run db:studio' to open Prisma Studio"
```

### Windows (`setup.bat`):
```batch
@echo off
echo 🚀 Setting up BASS Training Academy...

echo 📦 Installing dependencies...
call npm install

if not exist .env.local (
    echo 📝 Creating .env.local...
    copy .env.example .env.local
    echo ⚠️  Please edit .env.local and add your DATABASE_URL!
    pause
)

echo 🔨 Generating Prisma Client...
call npm run db:generate

echo 💾 Syncing database schema...
call npm run db:push

echo 👤 Creating admin user...
call node scripts/create-admin.js

echo ✅ Setup complete!
echo 🚀 Run 'npm run dev' to start the development server
echo 🎨 Run 'npm run db:studio' to open Prisma Studio
pause
```

**Usage:**
```bash
# Linux/Mac
chmod +x setup.sh
./setup.sh

# Windows
setup.bat
```

---

## 🐛 Troubleshooting

### Error: "Prisma Client could not be generated"

**Solution:**
```bash
npm install @prisma/client
npm run db:generate
```

### Error: "Can't reach database server"

**Checklist:**
1. ✅ Database service running?
   ```bash
   # MySQL
   mysqladmin -u root -p status

   # PostgreSQL
   pg_isready
   ```

2. ✅ `DATABASE_URL` correct in `.env.local`?
3. ✅ Database exists?
   ```bash
   # MySQL
   mysql -u root -p -e "SHOW DATABASES;"

   # PostgreSQL
   psql -U postgres -l
   ```

4. ✅ User has permissions?

### Error: "Environment variable not found: DATABASE_URL"

**Solution:**
```bash
# Pastikan .env.local exists dan berisi DATABASE_URL
cat .env.local | grep DATABASE_URL

# Jika tidak ada, copy dari .env.example
cp .env.example .env.local
```

### Error: "Schema has unsupported features"

Terjadi karena switch provider. **Solution:**
```bash
# Reset database (HATI-HATI: Akan hapus semua data!)
npx prisma migrate reset

# Atau
npx prisma db push --force-reset
```

### Port 3000 already in use

**Solution:**
```bash
# Kill process di port 3000
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Atau gunakan port lain
npm run dev -- -p 3001
```

---

## 📋 Checklist Setup

Print atau bookmark checklist ini:

- [ ] Node.js installed (v18+)
- [ ] Database installed (MySQL/PostgreSQL/SQLite)
- [ ] Repository cloned
- [ ] `npm install` completed
- [ ] `.env.local` created and configured
- [ ] `DATABASE_URL` set correctly
- [ ] `JWT_SECRET` generated
- [ ] `npm run db:generate` executed
- [ ] `npm run db:push` executed
- [ ] Admin user created
- [ ] `npm run dev` works
- [ ] http://localhost:3000/api/test-db returns success
- [ ] `npm run db:studio` opens Prisma Studio
- [ ] Can login with admin credentials

---

## 🚀 Production Deployment

### Environment Variables

Tambahkan di production environment:

```env
# Production Database
DATABASE_URL="mysql://user:password@production-host:3306/bass_training?sslmode=require"

# Production URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Strong JWT Secret (BERBEDA dari development!)
JWT_SECRET=<generate-strong-secret-min-32-chars>

# Production settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Deployment Steps

```bash
# 1. Install dependencies
npm ci

# 2. Generate Prisma Client
npm run db:generate

# 3. Run migrations (PRODUCTION)
npx prisma migrate deploy

# 4. Build
npm run build

# 5. Start
npm start
```

**Platforms:**
- **Vercel**: Auto-detects Next.js, add `DATABASE_URL` in environment variables
- **Railway**: Auto-deploys, provides DATABASE_URL for PostgreSQL
- **AWS/DigitalOcean**: Use PM2 or Docker
- **Docker**: See `docker-compose.yml` (if provided)

---

## 📚 Additional Resources

### Documentation
- `QUICK_START.md` - Quick reference
- `README_PRISMA.md` - Prisma usage guide
- `PRISMA_MIGRATION_GUIDE.md` - Detailed guide
- `MIGRATION_COMPLETE.md` - Migration report

### Commands Cheat Sheet
```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Prisma
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to DB
npm run db:pull          # Pull schema from DB
npm run db:studio        # Open Prisma Studio
npm run db:migrate       # Create migration
npm run db:seed          # Seed database

# Database
node scripts/create-admin.js   # Create admin user
```

---

## 🎉 Done!

Sekarang proyek Anda sudah siap digunakan di device baru!

**Quick Test:**
```bash
# 1. Start server
npm run dev

# 2. Test API
curl http://localhost:3000/api/test-db

# 3. Open Prisma Studio
npm run db:studio

# 4. Test login
# Email: admin@basstrainingacademy.com
# Password: admin123
```

**Happy coding! 🚀**

---

## 💡 Tips

1. **Always backup database before major changes**
   ```bash
   # MySQL
   mysqldump -u root -p bass_training > backup.sql

   # PostgreSQL
   pg_dump bass_training > backup.sql
   ```

2. **Use Prisma Studio for quick data inspection**
   ```bash
   npm run db:studio
   ```

3. **Generate new JWT secret for each environment**
   ```bash
   openssl rand -base64 32
   ```

4. **Keep `.env.local` in `.gitignore`** (already done)

5. **Document your custom environment variables**

---

**Last Updated:** 2025-10-20
**Prisma Version:** 6.17.1
**Next.js Version:** 15.5.4
