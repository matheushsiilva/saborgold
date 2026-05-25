import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: dbUrl }),
});

async function main() {
  console.log('🌟 Seeding Sabor Gold database...');

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'pods-descartaveis' },
      update: {},
      create: { name: 'Pods Descartáveis', slug: 'pods-descartaveis' },
    }),
    prisma.category.upsert({
      where: { slug: 'essencias' },
      update: {},
      create: { name: 'Essências', slug: 'essencias' },
    }),
    prisma.category.upsert({
      where: { slug: 'acessorios' },
      update: {},
      create: { name: 'Acessórios', slug: 'acessorios' },
    }),
    prisma.category.upsert({
      where: { slug: 'kits' },
      update: {},
      create: { name: 'Kits Completos', slug: 'kits' },
    }),
    prisma.category.upsert({
      where: { slug: 'lancamentos' },
      update: {},
      create: { name: 'Lançamentos', slug: 'lancamentos' },
    }),
  ]);

  const [pods, essencias, kits, lancamentos] = categories;

  const products = [
    {
      name: 'Ignite V50 — Strawberry Kiwi',
      description: 'Sabor refrescante e doce. Até 5000 puffs. Edição premium importada.',
      price: 129.9,
      imageUrl: 'pods-ignite-v50',
      categoryId: pods.id,
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Elf Bar BC5000 — Watermelon Ice',
      description: 'Melancia gelada intensa. Recarregável USB-C. Design minimalista dourado.',
      price: 119.9,
      imageUrl: 'pods-elf-bar',
      categoryId: pods.id,
      isBestSeller: true,
    },
    {
      name: 'Zomo — Strong Grape Mint',
      description: 'Essência premium 50g. Uva com menta intensa. Importação direta.',
      price: 89.9,
      imageUrl: 'essencia-zomo-grape',
      categoryId: essencias.id,
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Tangiers — Cane Mint',
      description: 'A essência mais cobiçada do mundo. Sabor menta pura e refrescante.',
      price: 149.9,
      imageUrl: 'essencia-tangiers-mint',
      categoryId: essencias.id,
      isBestSeller: true,
    },
    {
      name: 'Vaporesso XROS 3 — Kit Gold Edition',
      description: 'Pod system premium com acabamento dourado. Bateria 1000mAh. Ajuste de airflow.',
      price: 249.9,
      imageUrl: 'kit-vaporesso-xros',
      categoryId: kits.id,
      isFeatured: true,
    },
    {
      name: 'Caliburn G3 — Kit Luxo',
      description: 'O kit mais vendido do mercado premium. Tela OLED. Carregamento rápido.',
      price: 199.9,
      imageUrl: 'kit-caliburn-g3',
      categoryId: kits.id,
      isBestSeller: true,
    },
    {
      name: 'Lost Mary OS5000 — Blue Razz Ice',
      description: 'Lançamento exclusivo 2026. Design ergonômico com glow dourado na base.',
      price: 134.9,
      imageUrl: 'pods-lost-mary',
      categoryId: lancamentos.id,
      isFeatured: true,
      isBestSeller: true,
    },
    {
      name: 'Carregador Magnético Gold',
      description: 'Carregador wireless magnético com acabamento dourado escovado.',
      price: 79.9,
      imageUrl: 'acessorio-carregador',
      categoryId: categories[2].id,
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({ data: p });
    }
  }

  const bannerCount = await prisma.banner.count();
  if (bannerCount === 0) {
    await prisma.banner.createMany({
      data: [
        {
          title: 'MAIS QUE SABOR, UMA EXPERIÊNCIA.',
          subtitle:
            'Descubra a seleção mais refinada de pods premium, essências exclusivas e acessórios de luxo.',
          imageUrl: 'gradient:gold',
          linkUrl: '/catalogo',
          isActive: true,
          order: 0,
        },
        {
          title: 'LANÇAMENTOS EXCLUSIVOS 2026',
          subtitle: 'Novidades importadas com estoque limitado. Garanta o seu antes que acabe.',
          imageUrl: 'gradient:dark',
          linkUrl: '/catalogo?categoria=lancamentos',
          isActive: true,
          order: 1,
        },
      ],
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      whatsappNumber: '5511999999999',
      instagramUrl: 'https://instagram.com/sabor.gold',
      address: 'Av. Europa, 1200 - Jardins, São Paulo - SP',
      contactEmail: 'contato@saborgold.com',
      heroTitle: 'MAIS QUE SABOR, UMA EXPERIÊNCIA.',
      heroSubtitle:
        'Descubra a seleção mais refinada de pods premium, essências exclusivas e acessórios de luxo criados para quem busca o extraordinário.',
      aboutText:
        'Nascida do desejo de elevar o lifestyle vape ao patamar do puro luxo, a Sabor Gold combina sofisticação estética, curadoria implacável e o compromisso de entregar sabores extraordinários.',
    },
  });

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
