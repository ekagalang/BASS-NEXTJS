# 🚀 BASS Training Academy - Setup Guide

Quick reference untuk setup projek di device baru.

---

## ⚡ Quick Setup (1-2 Menit)

### Windows
```bash
setup.bat
```

### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

**Script akan otomatis:**
1. ✅ Install dependencies (`npm install`)
2. ✅ Setup `.env.local` (copy dari `.env.example`)
3. ✅ Generate Prisma Client
4. ✅ Sync database schema
5. ✅ Seed database dengan data dummy

---

## 📋 Prerequisites

Sebelum menjalankan setup, pastikan terinstall:

- ✅ **Node.js 18+** - [Download](https://nodejs.org)
- ✅ **MySQL/PostgreSQL** - Database server
- ✅ **Git** - Version control

---

## 🔧 Manual Setup

Jika prefer manual setup:

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local, ubah DATABASE_URL

# 3. Setup Prisma & Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Sync schema ke database
npm run db:seed          # Seed data dummy

# 4. Start development
npm run dev
```

---

## 🗄️ Database Configuration

Edit `.env.local`:

### MySQL (Default)
```env
DATABASE_URL="mysql://root:password@localhost:3306/bass"
```

### PostgreSQL
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bass"
```

### SQLite (Development only)
```env
DATABASE_URL="file:./dev.db"
```

---

## 📝 Available Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database
```bash
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:pull          # Pull schema from database
npm run db:studio        # Open Prisma Studio (GUI)
npm run db:seed          # Seed database
npm run db:reset         # Reset database & re-seed
```

### Utilities
```bash
node scripts/create-admin.js    # Create admin user only
node scripts/hash-password.js   # Hash a password
```

---

## 👤 Default Login

Setelah seeding:

**Email:** `admin@basstrainingacademy.com`
**Password:** `admin123`

---

## 🔍 Verify Setup

Test jika setup berhasil:

```bash
# 1. Start server
npm run dev

# 2. Test database connection
curl http://localhost:3000/api/test-db

# 3. Test API endpoints
curl http://localhost:3000/api/programs
curl http://localhost:3000/api/posts

# 4. Open browser
# http://localhost:3000
```

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"
- ✅ Check MySQL/PostgreSQL is running
- ✅ Verify `DATABASE_URL` in `.env.local`
- ✅ Test connection: `mysql -u root -p`

### Error: "Prisma Client not generated"
```bash
npm run db:generate
```

### Error: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Reset Everything
```bash
npm run db:reset      # Reset database & re-seed
npm run db:generate   # Re-generate Prisma Client
```

---

## 📚 Documentation

- **[README.md](./README.md)** - Main documentation
- **[SETUP_FROM_SCRATCH.md](./SETUP_FROM_SCRATCH.md)** - Detailed manual setup
- **[QUICK_START.md](./QUICK_START.md)** - Prisma usage & examples

---

## 🎯 Next Steps

After setup:

1. **Explore Prisma Studio:**
   ```bash
   npm run db:studio
   ```
   Opens GUI at http://localhost:5555

2. **Read Prisma docs:**
   - [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
   - [Prisma Schema](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

3. **Start development:**
   - Check `/src/app/api` for API examples
   - Check `prisma/schema.prisma` for database models
   - Check `QUICK_START.md` for Prisma usage examples

---

**Setup selesai! Happy coding! 🚀**
