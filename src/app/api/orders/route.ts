import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(orders);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch orders', details: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, deliveryMethod, address, items, totalPrice } = body;

    if (!customerName || !customerPhone || !items || !totalPrice) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        deliveryMethod,
        address: address || '',
        itemsJson: JSON.stringify(items),
        totalPrice: parseFloat(totalPrice),
        status: 'Pendente'
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (e: any) {
    console.error('Error recording order:', e);
    return NextResponse.json({ error: 'Failed to record order', details: e.message }, { status: 500 });
  }
}
