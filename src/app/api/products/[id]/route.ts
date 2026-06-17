import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { deleteFromSupabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch product', details: e.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, imageUrl, categoryId, isFeatured, isBestSeller, inStock } = body;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name || existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
        categoryId: categoryId || existingProduct.categoryId,
        isFeatured: isFeatured !== undefined ? !!isFeatured : existingProduct.isFeatured,
        isBestSeller: isBestSeller !== undefined ? !!isBestSeller : existingProduct.isBestSeller,
        inStock: inStock !== undefined ? !!inStock : existingProduct.inStock,
      }
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error('Error updating product:', e);
    return NextResponse.json({ error: 'Failed to update product', details: e.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete the product image from Supabase Storage if it exists
    if (existingProduct.imageUrl) {
      try {
        await deleteFromSupabase(existingProduct.imageUrl);
      } catch (imgErr) {
        console.error('Failed to delete product image from storage:', imgErr);
        // Continue with product deletion even if image deletion fails
      }
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (e: any) {
    console.error('Error deleting product:', e);
    return NextResponse.json({ error: 'Failed to delete product', details: e.message }, { status: 500 });
  }
}
