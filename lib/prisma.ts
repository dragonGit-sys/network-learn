// Singleton Prisma Client — pola resmi Next.js (hindari koneksi ganda saat hot-reload).
// Koneksi aktual baru dibuka saat query pertama; import modul ini aman saat build.
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
