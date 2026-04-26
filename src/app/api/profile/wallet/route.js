import prisma from '../../../../lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { btcWallet } = await req.json();

    if (!btcWallet || btcWallet.length < 26) {
      return Response.json({ success: false, error: 'Format alamat Bitcoin tidak valid.' }, { status: 400 });
    }

    // Update database
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { btcWallet }
    });

    return Response.json({ success: true, message: 'Alamat dompet berhasil dihubungkan!' });
  } catch (error) {
    // TAMBAHAN: Agar terminal memberi tahu kita error aslinya apa
    console.error("Wallet Save Error:", error); 
    
    if (error.code === 'P2002') {
      return Response.json({ success: false, error: 'Dompet ini sudah digunakan oleh akun lain. Silakan gunakan dompet Anda yang sebenarnya.' }, { status: 400 });
    }
    return Response.json({ success: false, error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}