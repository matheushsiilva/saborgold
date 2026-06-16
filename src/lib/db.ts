import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  const pool = new Pool({
    connectionString,
    // Supabase Transaction Pooler already handles connection limits,
    // but we cap at 1 per serverless function instance to be safe.
    max: 1,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

if (process.env.NODE_ENV === 'production') {
  const prismaInstance = createPrismaClient();
  (global as unknown as { prisma?: PrismaClient }).prisma = prismaInstance;
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
}

export const prisma = globalForPrisma.prisma!;
export default prisma;
