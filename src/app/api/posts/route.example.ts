// ============================================
// EXAMPLE: Posts API Route using Prisma
// This is an example showing how to migrate from mysql2 to Prisma
// ============================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { postRepository } from '@/lib/repositories/prisma.base.repository'

// ============================================
// GET /api/posts
// Get all posts with pagination
// ============================================
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'published'

    // METHOD 1: Using Prisma Client directly
    const posts = await prisma.post.findMany({
      where: {
        status: status as any,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        category: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.post.count({
      where: { status: status as any },
    })

    // METHOD 2: Using Repository Pattern
    // const result = await postRepository.findAllPaginated({
    //   page,
    //   limit,
    //   where: { status },
    //   include: {
    //     author: {
    //       select: { id: true, name: true, email: true, avatar: true }
    //     },
    //     category: true
    //   }
    // })

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch posts',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ============================================
// POST /api/posts
// Create new post
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      categoryId,
      authorId,
      status,
      publishedAt,
    } = body

    // Validate required fields
    if (!title || !slug || !authorId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: title, slug, authorId',
        },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post with this slug already exists',
        },
        { status: 409 }
      )
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        categoryId: categoryId ? parseInt(categoryId) : null,
        authorId: parseInt(authorId),
        status: status || 'draft',
        publishedAt: publishedAt ? new Date(publishedAt) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully',
        data: post,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create post',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ============================================
// COMPARISON: MySQL2 vs Prisma
// ============================================

/*
BEFORE (MySQL2):
----------------
import { db } from '@/lib/db'

// Get posts
const posts = await db.query(`
  SELECT p.*,
         u.id as author_id, u.name as author_name, u.email as author_email,
         c.id as category_id, c.name as category_name
  FROM posts p
  LEFT JOIN users u ON p.author_id = u.id
  LEFT JOIN post_categories c ON p.category_id = c.id
  WHERE p.status = ?
  ORDER BY p.published_at DESC
  LIMIT ? OFFSET ?
`, [status, limit, (page - 1) * limit])

// Create post
const result = await db.query(`
  INSERT INTO posts (title, slug, content, excerpt, featured_image, category_id, author_id, status, published_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`, [title, slug, content, excerpt, featuredImage, categoryId, authorId, status, publishedAt])


AFTER (Prisma):
---------------
import { prisma } from '@/lib/prisma'

// Get posts - Type-safe, auto-completion, nested relations
const posts = await prisma.post.findMany({
  where: { status },
  include: {
    author: { select: { id: true, name: true, email: true } },
    category: true
  },
  orderBy: { publishedAt: 'desc' },
  skip: (page - 1) * limit,
  take: limit
})

// Create post - Type-safe, auto-validation
const post = await prisma.post.create({
  data: {
    title,
    slug,
    content,
    excerpt,
    featuredImage,
    categoryId,
    authorId,
    status,
    publishedAt: publishedAt ? new Date(publishedAt) : null
  },
  include: {
    author: true,
    category: true
  }
})

BENEFITS:
---------
✅ Type-safe queries with auto-completion
✅ No SQL injection vulnerabilities
✅ Automatic JOIN handling with include
✅ Built-in validation
✅ Easy to read and maintain
✅ Works with any database (MySQL, PostgreSQL, SQLite, etc.)
✅ Auto-generated TypeScript types
*/
