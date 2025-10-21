# 🎓 BASS Training Academy - Next.js

Website training academy menggunakan Next.js 15, TypeScript, dan **Prisma ORM**.

## ✨ Features

- 🎨 Modern UI dengan Tailwind CSS
- 🔐 Authentication & Authorization
- 📝 Blog/Posts Management
- 🎓 Programs & Courses Management
- 📅 Schedule Management
- 📧 Contact Form & Newsletter
- 🗺️ Dynamic Sitemap
- 💾 **Database Agnostic** - MySQL, PostgreSQL, SQLite, SQL Server support via Prisma
- 🔒 Type-safe database operations with Prisma ORM

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- MySQL (atau PostgreSQL/SQLite)
- Git

### Automated Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

Script akan otomatis:
- ✅ Install dependencies
- ✅ Setup environment variables
- ✅ Generate Prisma Client
- ✅ Sync database schema
- ✅ Seed database dengan data dummy

### Manual Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd BASS-NEXTJS

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local
# Edit .env.local - Add your DATABASE_URL

# 4. Generate Prisma Client & Sync database
npm run db:generate
npm run db:push

# 5. Seed database
node prisma/seed.js

# 6. Start development server
npm run dev
```

**Open:** http://localhost:3000

**Admin Login:**
- Email: `admin@basstrainingacademy.com`
- Password: `admin123`

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[README.md](./README.md)** | 📖 Main documentation (you are here) |
| [SETUP_FROM_SCRATCH.md](./SETUP_FROM_SCRATCH.md) | 🔧 Detailed setup guide for new device |
| [QUICK_START.md](./QUICK_START.md) | ⚡ Quick reference & Prisma usage examples |

---

## 🗄️ Database

Proyek ini menggunakan **Prisma ORM** yang mendukung multiple databases:

- ✅ **MySQL** (Default)
- ✅ **PostgreSQL**
- ✅ **SQLite**
- ✅ **SQL Server**
- ✅ **MongoDB**

### Switch Database Provider

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // or "mysql", "sqlite", "sqlserver"
  url      = env("DATABASE_URL")
}
```

Update `.env.local`:
```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/bass_training"

# SQLite
DATABASE_URL="file:./dev.db"
```

Generate & push:
```bash
npm run db:generate
npm run db:push
```

---

## 🛠️ Available Scripts

### Development
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database (Prisma)
```bash
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database (dev)
npm run db:pull          # Pull schema from database
npm run db:studio        # Open Prisma Studio GUI
npm run db:migrate       # Create migration (production)
npm run db:migrate:prod  # Deploy migrations (production)
npm run db:seed          # Seed database
```

### Utilities
```bash
node scripts/create-admin.js     # Create admin user
node find-mysql-usage.js         # Check MySQL2 usage
```

---

## 📁 Project Structure

```
BASS-NEXTJS/
├── prisma/
│   └── schema.prisma           # Database schema (21 models)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── (public)/          # Public pages
│   │   └── admin/             # Admin pages
│   ├── components/            # React components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma Client singleton
│   │   ├── auth.ts            # Authentication utilities
│   │   └── repositories/      # Data access layer
│   └── types/                 # TypeScript types
├── scripts/
│   └── create-admin.js        # Admin user creation
├── public/                    # Static files
├── database/                  # Database setup scripts
└── .env.local                 # Environment variables (create this!)
```

---

## 🔐 Environment Variables

Create `.env.local` with:

```env
# Database URL (REQUIRED)
DATABASE_URL="mysql://root:password@localhost:3306/bass_training"

# JWT Secret (REQUIRED - Generate a strong one!)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRES_IN=7d

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Upload Configuration
UPLOAD_MAX_SIZE=5242880
UPLOAD_DIR=./public/uploads
UPLOAD_ALLOWED_TYPES=image/jpeg,image/png,image/gif,image/webp,application/pdf
```

**Generate JWT Secret:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## 🗃️ Database Models

Prisma schema includes 21 models:

**Core:**
- User, Session
- Post, PostCategory
- Program, ProgramCategory, Instructor, Schedule, Registration
- Page
- Media, Gallery

**Features:**
- Contact, NewsletterSubscriber
- ChatSession, ChatMessage, ChatBotRule
- Setting, PageView

See `prisma/schema.prisma` for full schema.

---

## 🎨 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **ORM:** Prisma 6
- **Database:** MySQL (or PostgreSQL, SQLite, etc.)
- **Authentication:** JWT + bcrypt
- **UI Components:** Headless UI, Framer Motion
- **Forms:** React Hook Form + Zod

---

## 🔧 Development Workflow

### 1. Make Database Changes

Edit `prisma/schema.prisma`:
```prisma
model Post {
  id    Int    @id @default(autoincrement())
  title String
  // ... add more fields
}
```

### 2. Apply Changes

```bash
# Development
npm run db:push

# Production (creates migration)
npm run db:migrate
```

### 3. Use in Code

```typescript
import { prisma } from '@/lib/prisma'

// Type-safe queries with auto-completion!
const posts = await prisma.post.findMany({
  where: { status: 'published' },
  include: {
    author: true,
    category: true
  }
})
```

---

## 🎯 API Endpoints

### Public
- `GET /api/posts` - List posts
- `GET /api/posts/[slug]` - Get post by slug
- `GET /api/programs` - List programs
- `GET /api/programs/[slug]` - Get program by slug
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Subscribe to newsletter

### Admin (requires auth)
- `GET/POST/PUT/DELETE /api/admin/posts` - Manage posts

---

## 🧪 Testing

### Test Database Connection

```bash
# Start server
npm run dev

# Test endpoint
curl http://localhost:3000/api/test-db
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful",
  "database": "bass_training",
  "users": 1,
  "programs": 0
}
```

### Test with Prisma Studio

```bash
npm run db:studio
```

Opens GUI at http://localhost:5555 to browse/edit database.

---

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy!

### Railway

1. Create new project
2. Add MySQL/PostgreSQL service
3. Copy `DATABASE_URL` from Railway
4. Add to environment variables
5. Deploy from GitHub

### Docker

```bash
docker-compose up -d
```

See `docker-compose.yml` for configuration.

---

## 🐛 Troubleshooting

### "Prisma Client not generated"
```bash
npm run db:generate
```

### "Can't reach database server"
Check `.env.local` - ensure `DATABASE_URL` is correct

### "Environment variable not found"
Create `.env.local` from `.env.example`

### Type errors after schema changes
```bash
npm run db:generate
```

See [SETUP_FROM_SCRATCH.md](./SETUP_FROM_SCRATCH.md) for more troubleshooting.

---

## 📄 License

Private project - BASS Training Academy

---

## 👥 Contributors

- Developer Team

---

## 📞 Support

For issues and questions:
1. Check documentation in `/docs`
2. Read `SETUP_FROM_SCRATCH.md`
3. Contact dev team

---

## 🎉 Highlights

✅ **Type-safe** - Full TypeScript support with Prisma
✅ **Database Agnostic** - Switch between MySQL, PostgreSQL, SQLite easily
✅ **Modern Stack** - Next.js 15 + Prisma + Tailwind CSS
✅ **Developer Friendly** - Auto-completion, IntelliSense, and great DX
✅ **Production Ready** - Fully tested and documented

---

**Built with ❤️ using Next.js and Prisma**
