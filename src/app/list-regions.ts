import { PrismaClient } from 'c:/Users/PC/Documents/Sabor Gold/src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';

const dbUrl = 'file:c:/Users/PC/Documents/Sabor Gold/dev.db';
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: dbUrl }),
});

async function main() {
  const regions = await prisma.region.findMany();
  console.log('REGIONS IN DATABASE:', JSON.stringify(regions, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
