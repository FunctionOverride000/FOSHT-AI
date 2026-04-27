import prisma from '../../../lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { decryptApiKey } from '../../../lib/encryption';

export async function GET(req) {
  try {
    // PERUBAHAN: Tambahkan 'await' di depan cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { 
        apiKeys: {
          orderBy: { createdAt: 'desc' }
        } 
      }
    });

    if (!user) return Response.json({ success: false, error: 'User not found' }, { status: 404 });

    const now = new Date();
    const processedKeys = user.apiKeys.map(key => {
      const isExpired = new Date(key.expiresAt) < now;
      return {
        id: key.id,
        name: key.name,
        key: isExpired ? 'EXPIRED_PLEASE_RENEW' : decryptApiKey(key.encryptedKey, key.iv, key.authTag),
        expiresAt: key.expiresAt,
        isExpired: isExpired,
        isActive: key.isActive
      };
    });

    return Response.json({
      success: true,
      userId: user.id,
      email: user.email,
      btcWallet: user.btcWallet,
      hasPin: !!user.pin,
      freeKeyUsed: user.freeKeyActionUsed,
      apiKeys: processedKeys
    });

  } catch (error) {
    return Response.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }
}