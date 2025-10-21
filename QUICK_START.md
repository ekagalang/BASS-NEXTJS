# 🚀 QUICK START - Daily Development Guide

Quick reference untuk development sehari-hari dengan Prisma ORM.

---

## ⚡ Setup Awal (New Device)

**Automated:**
```bash
# Windows
setup.bat

# Linux/Mac
./setup.sh
```

**Manual:**
```bash
npm install
cp .env.example .env.local  # Edit DATABASE_URL
npm run db:generate
npm run db:push
node prisma/seed.js
npm run dev
```

---

## 💻 Usage Examples

### Import Prisma
```typescript
import { prisma } from '@/lib/prisma'
```

### Basic CRUD

#### Create
```typescript
const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    password: hashedPassword,
    role: 'user'
  }
})
```

#### Read
```typescript
// Find all
const users = await prisma.user.findMany()

// Find one
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' }
})

// Find with filter
const activeUsers = await prisma.user.findMany({
  where: { status: 'active' }
})
```

#### Update
```typescript
const updated = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Jane Doe' }
})
```

#### Delete
```typescript
await prisma.user.delete({
  where: { id: 1 }
})
```

### With Relations
```typescript
// Get posts with author and category
const posts = await prisma.post.findMany({
  include: {
    author: true,
    category: true
  }
})

// Get program with schedules
const program = await prisma.program.findUnique({
  where: { slug: 'basic-programming' },
  include: {
    category: true,
    instructor: true,
    schedules: {
      where: { status: 'upcoming' }
    }
  }
})
```

### Pagination
```typescript
const page = 1
const limit = 10

const posts = await prisma.post.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' }
})

const total = await prisma.post.count()
```

### Search
```typescript
const results = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: 'javascript' } },
      { content: { contains: 'javascript' } }
    ]
  }
})
```

---

## 🔧 Useful Commands

```bash
# Generate Prisma Client
npm run db:generate

# Open Prisma Studio (GUI)
npm run db:studio

# Sync schema to database
npm run db:push

# Pull schema from database
npm run db:pull

# Create migration
npm run db:migrate

# Reset database (DANGER!)
npx prisma migrate reset
```

---

## 🔄 Ganti Database

### Dari MySQL ke PostgreSQL

1. Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Ubah dari "mysql"
  url      = env("DATABASE_URL")
}
```

2. Edit `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/bass_training"
```

3. Generate & Push:
```bash
npm run db:generate
npm run db:push
```

**DONE!** 🎉

---

## 🆘 Troubleshooting

### Error: "Prisma Client not generated"
```bash
npm run db:generate
```

### Error: "Can't reach database"
Check `.env.local` - pastikan `DATABASE_URL` benar

### Type errors after changes
```bash
npm run db:generate
```

---

## 📚 More Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [SETUP_FROM_SCRATCH.md](./SETUP_FROM_SCRATCH.md) - Detailed setup guide

---

## ✅ Tech Stack

✅ Next.js 15 with App Router
✅ TypeScript with full type safety
✅ Prisma ORM (database agnostic)
✅ MySQL (switchable to PostgreSQL, SQLite, etc.)
✅ Tailwind CSS for styling

---

**Now go build something awesome! 🚀**
