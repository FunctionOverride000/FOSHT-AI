import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, systemPrompt, blogCss } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized: User ID missing.' }, { status: 401 });
    }

    // Simpan konfigurasi langsung ke Database PostgreSQL
    await prisma.user.update({
      where: { id: userId },
      data: { 
        systemPrompt: systemPrompt, 
        blogCss: blogCss 
      }
    });

    return NextResponse.json({ success: true, message: 'Agent configuration securely saved.' });
  } catch (error) {
    console.error("Agent Update Error:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}