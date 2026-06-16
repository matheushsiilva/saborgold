import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: dbUrl }),
});

async function main() {
  console.log('🌟 Seeding Sabor Gold (plataforma completa)...');

  const regions = await Promise.all([
    prisma.region.upsert({
      where: { slug: 'porto-alegre-viamao-alvorada-guaiba-eldorado' },
      update: {},
      create: {
        name: 'Porto Alegre, Viamão, Alvorada, Guaiba, Eldorado',
        slug: 'porto-alegre-viamao-alvorada-guaiba-eldorado',
        state: 'RS',
      },
    }),
    prisma.region.upsert({
      where: { slug: 'novo-hamburgo-e-outras-cidades' },
      update: {},
      create: {
        name: 'Novo Hamburgo e outras cidades',
        slug: 'novo-hamburgo-e-outras-cidades',
        state: 'RS',
      },
    }),
  ]);

  // Clean up any other regions that might exist
  await prisma.region.deleteMany({
    where: {
      slug: {
        notIn: [
          'porto-alegre-viamao-alvorada-guaiba-eldorado',
          'novo-hamburgo-e-outras-cidades',
        ],
      },
    },
  });

  const elfbar = await prisma.brand.upsert({
    where: { slug: 'elfbar' },
    update: {},
    create: { name: 'ELFBAR', slug: 'elfbar' },
  });
  const ignite = await prisma.brand.upsert({
    where: { slug: 'ignite' },
    update: {},
    create: { name: 'IGNITE', slug: 'ignite' },
  });

  const pods = await prisma.category.upsert({
    where: { slug: 'pods' },
    update: { name: 'Pods' },
    create: { name: 'Pods', slug: 'pods' },
  });
  const vape = await prisma.category.upsert({
    where: { slug: 'vape' },
    update: { name: 'Vape' },
    create: { name: 'Vape', slug: 'vape' },
  });

  const samples = [
    {
      name: 'ELFBAR 15K',
      description: 'Pod descartável premium · 15.000 puffs',
      price: 129.9,
      imageUrl: 'pods-elf-bar',
      categoryId: pods.id,
      brandId: elfbar.id,
      badge: 'LANÇAMENTO',
      flavors: [
        { name: 'KIWI PASSION FRUIT GUAVA', description: 'Kiwi, Maracujá e Goiaba' },
        { name: 'WATERMELON ICE', description: 'Melancia gelada refrescante' },
        { name: 'BLUE RAZZ ICE', description: 'Framboesa azul com mentol' },
      ],
    },
    {
      name: 'IGNITE V80',
      description: 'Pod recarregável · Tela digital · Luxo',
      price: 149.9,
      imageUrl: 'pods-ignite-v50',
      categoryId: pods.id,
      brandId: ignite.id,
      badge: 'PROMOÇÃO',
      flavors: [
        { name: 'STRAWBERRY KIWI', description: 'Morango e Kiwi tropical' },
        { name: 'MENTHOL', description: 'Mentol puro intenso' },
      ],
    },
    {
      name: 'IGNITE V50',
      description: 'Compacto e potente · Edição Gold',
      price: 119.9,
      imageUrl: 'pods-ignite-v50',
      categoryId: pods.id,
      brandId: ignite.id,
      isBestSeller: true,
      flavors: [{ name: 'GRAPE ICE', description: 'Uva gelada premium' }],
    },
    {
      name: 'Zomo Strong 50g',
      description: 'Essência importada para narguilé',
      price: 89.9,
      imageUrl: 'essencia-zomo-grape',
      categoryId: vape.id,
      badge: null,
      flavors: [{ name: 'GRAPE MINT', description: 'Uva com menta intensa' }],
    },
  ];

  for (const s of samples) {
    const exists = await prisma.product.findFirst({ where: { name: s.name } });
    if (exists) continue;

    await prisma.product.create({
      data: {
        name: s.name,
        description: s.description,
        price: s.price,
        imageUrl: s.imageUrl,
        categoryId: s.categoryId,
        brandId: s.brandId,
        badge: s.badge,
        isBestSeller: !!(s as { isBestSeller?: boolean }).isBestSeller,
        flavors: {
          create: s.flavors.map((f, i) => ({
            name: f.name,
            description: f.description,
            order: i,
          })),
        },
        regions: {
          create: regions.map((r) => ({ regionId: r.id, inStock: true })),
        },
      },
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {
      heroSubtitle: 'Selecione sua região e explore pods ELFBAR, IGNITE e muito mais.',
    },
    create: {
      id: 'default',
      whatsappNumber: '5511999999999',
      instagramUrl: 'https://instagram.com/sabor.gold',
      heroTitle: 'MAIS QUE SABOR, UMA EXPERIÊNCIA.',
      heroSubtitle: 'Selecione sua região e explore pods ELFBAR, IGNITE e muito mais.',
      aboutText: 'Sabor Gold — plataforma premium de vapes e pods.',
      address: 'São Paulo - SP',
      contactEmail: 'contato@saborgold.com',
    },
  });

  console.log('✅ Seed concluído: regiões, marcas ELFBAR/IGNITE, produtos com sabores');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
