import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isRead } = body;

    if (isRead === undefined) {
      return NextResponse.json({ error: 'isRead value required' }, { status: 400 });
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { isRead: !!isRead }
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error('Error updating message status:', e);
    return NextResponse.json({ error: 'Failed to update message status', details: e.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.message.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (e: any) {
    console.error('Error deleting message:', e);
    return NextResponse.json({ error: 'Failed to delete message', details: e.message }, { status: 500 });
  }
}
