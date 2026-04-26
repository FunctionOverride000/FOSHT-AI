import prisma from '../../../../lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { generateRandomApiKey, encryptApiKey } from '../../../../lib/encryption';

export async function POST(req) {
  try {
    // PERUBAHAN: Tambahkan 'await' di depan cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (user.freeKeyActionUsed) {
      return Response.json({ success: false, error: 'Jatah gratis sudah habis. Silakan lakukan pembayaran.' }, { status: 403 });
    }

    const rawApiKey = generateRandomApiKey();
    const { encryptedKey, iv, authTag } = encryptApiKey(rawApiKey);
    
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await prisma.$transaction([
      prisma.apiKey.create({
        data: {
          userId: user.id,
          name: "Free Bonus API Key",
          encryptedKey,
          iv,
          authTag,
          expiresAt
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { freeKeyActionUsed: true }
      })
    ]);

    return Response.json({ success: true, message: 'API Key gratis berhasil ditambahkan!' });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}