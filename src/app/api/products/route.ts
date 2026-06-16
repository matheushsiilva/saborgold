import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('categoria');
    const brandSlug = searchParams.get('marca');
    const regionSlug = searchParams.get('regiao');
    const search = searchParams.get('busca');

    const where: Record<string, unknown> = {};

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    if (brandSlug && brandSlug !== 'todos') {
      where.brand = { slug: brandSlug };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { name: { contains: search } } },
        { flavors: { some: { name: { contains: search } } } },
        { flavors: { some: { description: { contains: search } } } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        flavors: { orderBy: { order: 'asc' } },
        regions: regionSlug
          ? {
              where: { region: { slug: regionSlug }, inStock: true },
              include: { region: true },
            }
          : { include: { region: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });

    const filtered = regionSlug
      ? products.filter((p) => {
          if (p.regions.length === 0) return p.inStock;
          return p.regions.some((r) => r.inStock);
        })
      : products;

    return NextResponse.json(filtered);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    console.error('Error fetching products:', e);
    return NextResponse.json({ error: 'Failed to fetch products', details: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      imageUrl,
      categoryId,
      brandId,
      badge,
      isFeatured,
      isBestSeller,
      inStock,
      flavors,
      regionIds,
    } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        imageUrl: imageUrl || 'pods-default',
        categoryId,
        brandId: brandId || null,
        badge: badge || null,
        isFeatured: !!isFeatured,
        isBestSeller: !!isBestSeller,
        inStock: inStock !== false,
        flavors: flavors?.length
          ? {
              create: flavors.map((f: { name: string; description?: string }, i: number) => ({
                name: f.name,
                description: f.description || null,
                order: i,
              })),
            }
          : undefined,
        regions: regionIds?.length
          ? {
              create: regionIds.map((regionId: string) => ({
                regionId,
                inStock: true,
              })),
            }
          : undefined,
      },
      include: { flavors: true, brand: true, category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to create product', details: message }, { status: 500 });
  }
}
