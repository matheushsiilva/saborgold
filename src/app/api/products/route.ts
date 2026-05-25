import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('categoria');
    const search = searchParams.get('busca');
    const featured = searchParams.get('destaque');

    let where: any = {};

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (featured === 'true') {
      where.OR = [
        { isFeatured: true },
        { isBestSeller: true }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (e: any) {
    console.error('Error fetching products:', e);
    return NextResponse.json({ error: 'Failed to fetch products', details: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, imageUrl, categoryId, isFeatured, isBestSeller, inStock } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        imageUrl: imageUrl || 'default-product',
        categoryId,
        isFeatured: !!isFeatured,
        isBestSeller: !!isBestSeller,
        inStock: inStock !== false
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (e: any) {
    console.error('Error creating product:', e);
    return NextResponse.json({ error: 'Failed to create product', details: e.message }, { status: 500 });
  }
}
