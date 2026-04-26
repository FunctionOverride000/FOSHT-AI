import prisma from '../../../lib/prisma';
import { generateRandomApiKey, encryptApiKey } from '../../../lib/encryption';
import axios from 'axios';

export async function POST(req) {
  try {
    const { orderId } = await req.json();
    
    // 1. Ambil order SEKALIGUS data user untuk melihat alamat dompet klien
    const order = await prisma.order.findUnique({ 
      where: { id: orderId },
      include: { user: true } // Mengambil relasi tabel User
    });
    
    if (!order) return Response.json({ error: "Order tidak ditemukan" }, { status: 404 });
    if (order.status === 'CONFIRMED') return Response.json({ status: 'CONFIRMED' });

    // 2. Kalkulasi Satoshi dan ambil dompet klien
    const expectedSatoshis = Math.round(order.btcAmount * 100000000);
    const clientWallet = order.user.btcWallet; // Dompet yang didaftarkan klien di Dashboard

    // 3. SCAN BLOCKCHAIN: Ambil riwayat transaksi dompet Admin
    const mempoolRes = await axios.get(`https://mempool.space/api/address/${order.btcAddress}/txs`);
    const transactions = mempoolRes.data;

    let paymentFound = false;

    // =========================================================
    // 4. THE ULTIMATE BLOCKCHAIN SCANNER (VIN & VOUT CHECK)
    // =========================================================
    for (const tx of transactions) {
      
      // CEK PENGIRIM (VIN): Pastikan uang dikirim DARI dompet klien
      // Kita pakai opsional chaining (?.) untuk menghindari error jika prevout kosong
      const isFromClient = clientWallet && tx.vin.some(
        input => input.prevout?.scriptpubkey_address === clientWallet
      );
      
      // Jika benar ini dikirim dari klien yang bersangkutan...
      if (isFromClient) {
        
        // CEK PENERIMA (VOUT): Pastikan uang MASUK ke dompet Admin dengan nominal pas
        for (const output of tx.vout) {
          if (output.scriptpubkey_address === order.btcAddress && output.value === expectedSatoshis) {
            paymentFound = true; // BINGO! Pembayaran Valid.
            break;
          }
        }
      }
      
      if (paymentFound) break;
    }

    // =========================================================
    // 5. JIKA KETEMU, AKTIFKAN API KEY & LISENSI
    // =========================================================
    if (paymentFound) {
      const now = new Date();
      let expiresAt = new Date();
      
      if (order.planType === '1_MONTH') expiresAt.setMonth(now.getMonth() + 1);
      else if (order.planType === '3_MONTHS') expiresAt.setMonth(now.getMonth() + 3);
      else if (order.planType === '1_YEAR') expiresAt.setFullYear(now.getFullYear() + 1);
      else expiresAt.setMonth(now.getMonth() + 1);

      const rawApiKey = generateRandomApiKey();
      const { encryptedKey, iv, authTag } = encryptApiKey(rawApiKey);

      await prisma.$transaction(async (tx) => {
        // Update status order jadi sukses
        await tx.order.update({ where: { id: orderId }, data: { status: 'CONFIRMED' } });
        
        // Terbitkan API Key rahasia untuk klien
        await tx.apiKey.create({
          data: {
            userId: order.userId,
            name: `API Key (${order.planType})`,
            encryptedKey, 
            iv, 
            authTag, 
            expiresAt,
          }
        });
      });

      return Response.json({ status: 'CONFIRMED', message: 'Pembayaran Valid di Blockchain!' });
    }

    // Jika belum ketemu di blockchain (atau dikirim dari dompet yang salah)
    return Response.json({ 
      status: 'PENDING', 
      message: "Menunggu transaksi dari dompet Anda yang terdaftar..." 
    });
    
  } catch (error) {
    console.error("FOSHT Payment Error:", error);
    return Response.json({ success: false, error: 'Gagal memindai jaringan blockchain.' }, { status: 500 });
  }
}