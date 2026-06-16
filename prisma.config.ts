// Prisma v7 config — connection URLs go here, NOT in schema.prisma
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// DIRECT_URL uses Session Pooler (port 5432) for migrations/push
// DATABASE_URL uses Transaction Pooler (port 6543) for runtime queries
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
