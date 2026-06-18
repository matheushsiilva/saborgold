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
      regionIds
    } = body;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update basic product fields
      await tx.product.update({
        where: { id },
        data: {
          name: name || existingProduct.name,
          description: description !== undefined ? description : existingProduct.description,
          price: price !== undefined ? parseFloat(price) : existingProduct.price,
          imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
          categoryId: categoryId || existingProduct.categoryId,
          brandId: brandId !== undefined ? (brandId || null) : existingProduct.brandId,
          badge: badge !== undefined ? (badge || null) : existingProduct.badge,
          isFeatured: isFeatured !== undefined ? !!isFeatured : existingProduct.isFeatured,
          isBestSeller: isBestSeller !== undefined ? !!isBestSeller : existingProduct.isBestSeller,
          inStock: inStock !== undefined ? !!inStock : existingProduct.inStock,
        }
      });

      // 2. Sync flavors if provided
      if (flavors !== undefined) {
        await tx.productFlavor.deleteMany({ where: { productId: id } });
        if (flavors && flavors.length > 0) {
          await tx.productFlavor.createMany({
            data: flavors.map((f: { name: string; description?: string }, i: number) => ({
              productId: id,
              name: f.name,
              description: f.description || null,
              order: i,
            })),
          });
        }
      }

      // 3. Sync regions if provided
      if (regionIds !== undefined) {
        await tx.productRegion.deleteMany({ where: { productId: id } });
        if (regionIds && regionIds.length > 0) {
          await tx.productRegion.createMany({
            data: regionIds.map((regionId: string) => ({
              productId: id,
              regionId,
              inStock: true,
            })),
          });
        }
      }

      // 4. Return updated product with relations
      return await tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          brand: true,
          flavors: { orderBy: { order: 'asc' } },
          regions: { include: { region: true } }
        }
      });
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
