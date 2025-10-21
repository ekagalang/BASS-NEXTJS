// ============================================
// PRISMA CLIENT SINGLETON
// Prevents multiple instances in development (hot reload)
// ============================================

import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development
// to prevent exhausting database connection limit

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Test database connection
 * @returns true if connected, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    await prisma.$connect()
    console.log('✅ Prisma database connection successful')
    return true
  } catch (error) {
    console.error('❌ Prisma database connection failed:', error)
    return false
  }
}

/**
 * Disconnect from database
 * Call this when shutting down server
 */
export async function disconnect(): Promise<void> {
  await prisma.$disconnect()
  console.log('✅ Prisma disconnected')
}

// Export default
export default prisma
