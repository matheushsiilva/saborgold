import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      // Seed default on demand if not found
      settings = await prisma.siteSettings.create({
        data: {
          id: 'default',
          whatsappNumber: '5511999999999',
          instagramUrl: 'https://instagram.com/sabor.gold',
          facebookUrl: 'https://facebook.com/sabor.gold',
          address: 'Av. Europa, 1200 - Jardins, São Paulo - SP',
          contactEmail: 'contato@saborgold.com',
          heroTitle: 'MAIS QUE SABOR, UMA EXPERIÊNCIA.',
          heroSubtitle: 'Descubra a seleção mais refinada de pods premium, essências exclusivas e acessórios de luxo criados para quem busca o extraordinário.',
          aboutText: 'Nascida do desejo de elevar o lifestyle vape ao patamar do puro luxo, a Sabor Gold combina sofisticação estética, curadoria implacável e o compromisso de entregar sabores extraordinários. Cada detalhe, desde nossas embalagens até nossa seleção de marcas importadas, reflete o bom gosto e a exclusividade que definem nossos clientes.'
        }
      });
    }

    return NextResponse.json(settings);
  } catch (e: any) {
    console.error('Error fetching settings:', e);
    return NextResponse.json({ error: 'Failed to fetch settings', details: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { whatsappNumber, instagramUrl, facebookUrl, address, contactEmail, heroTitle, heroSubtitle, aboutText } = body;

    const updated = await prisma.siteSettings.update({
      where: { id: 'default' },
      data: {
        whatsappNumber,
        instagramUrl,
        facebookUrl,
        address,
        contactEmail,
        heroTitle,
        heroSubtitle,
        aboutText
      }
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error('Error updating settings:', e);
    return NextResponse.json({ error: 'Failed to update settings', details: e.message }, { status: 500 });
  }
}
