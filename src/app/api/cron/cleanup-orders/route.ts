import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Pastikan path prisma client Anda benar

export async function GET(req: Request) {
  // 1. Pengaman: Cek apakah yang memanggil benar-benar sistem Cron Vercel
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 2. Tentukan batas waktu (contoh: hapus yang sudah lebih dari 24 jam)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 3. Eksekusi penghapusan di Database
    const deletedOrders = await prisma.order.deleteMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: twentyFourHoursAgo, // lt = less than (kurang dari waktu tersebut)
        },
      },
    });

    console.log(`[CRON] Cleaned up ${deletedOrders.count} expired orders.`);

    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${deletedOrders.count} expired orders.` 
    });

  } catch (error: unknown) {
    console.error('[CRON ERROR]', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}