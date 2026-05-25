import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(messages);
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to fetch messages', details: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        name,
        email,
        phone: phone || '',
        subject: subject || 'Contato Geral',
        message,
        isRead: false
      }
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (e: any) {
    console.error('Error submitting message:', e);
    return NextResponse.json({ error: 'Failed to send message', details: e.message }, { status: 500 });
  }
}
