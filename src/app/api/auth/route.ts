import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, phone } = await request.json();
    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Informe nome e e-mail ou WhatsApp' },
        { status: 400 }
      );
    }

    let user = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    }
    if (!user && phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      user = await prisma.user.findFirst({
        where: { phone: { contains: cleanPhone.slice(-8) } },
      });
    }

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email: email || null,
          phone: phone?.replace(/\D/g, '') || null,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name },
      });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
