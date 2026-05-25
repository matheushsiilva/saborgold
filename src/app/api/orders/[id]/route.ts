import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error('Error updating order:', e);
    return NextResponse.json({ error: 'Failed to update order', details: e.message }, { status: 500 });
  }
}
