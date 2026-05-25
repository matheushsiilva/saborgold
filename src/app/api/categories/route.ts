import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    return NextResponse.json(categories);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch categories', details: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, imageUrl } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9\s-]/g, '') // remove special characters
      .trim()
      .replace(/\s+/g, '-'); // replace spaces with hyphens

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        imageUrl: imageUrl || ''
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (e: any) {
    console.error('Error creating category:', e);
    return NextResponse.json({ error: 'Failed to create category', details: e.message }, { status: 500 });
  }
}
