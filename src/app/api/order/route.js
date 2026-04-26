import prisma from '../../../lib/prisma';
import axios from 'axios';

export async function POST(req) {
  try {
    const { userId, planType, targetKeyId } = await req.json();

    // 1. THE GATEKEEPER: Ambil harga mutlak dari .env (Abaikan input harga dari klien)
    let planUsd = 0;
    if (planType === '1_MONTH') planUsd = Number(process.env.NEXT_PUBLIC_PRICE_1_MONTH);
    else if (planType === '3_MONTHS') planUsd = Number(process.env.NEXT_PUBLIC_PRICE_3_MONTHS);
    else if (planType === '1_YEAR') planUsd = Number(process.env.NEXT_PUBLIC_PRICE_1_YEAR);
    else return Response.json({ success: false, error: 'Paket tidak valid' }, { status: 400 });

    // 2. Ambil alamat dompet Anda dari .env
    const btcAddress = process.env.MY_BTC_ADDRESS;
    if (!btcAddress) {
      return Response.json({ success: false, error: 'Admin belum mengatur alamat dompet.' }, { status: 500 });
    }

    // 3. Ambil harga BTC ke USD secara Real-Time dari CoinGecko
    const priceRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const btcPrice = priceRes.data.bitcoin.usd;
    
    // 4. Hitung jumlah BTC & Tambahkan 3 digit Satoshi acak untuk pelacakan transaksi
    const baseBtcAmount = planUsd / btcPrice;
    const randomFractions = Math.floor(Math.random() * 900) + 100;
    const uniqueBtcAmount = parseFloat(baseBtcAmount.toFixed(8)) + (randomFractions / 100000000);

    // 5. Simpan ke database
    const order = await prisma.order.create({
      data: {
        userId,
        planType,
        usdAmount: planUsd,
        btcAmount: parseFloat(uniqueBtcAmount.toFixed(8)),
        btcAddress: btcAddress,
        targetKeyId: targetKeyId || null
      }
    });

    return Response.json({ success: true, order });
  } catch (error) {
    console.error("FOSHT Order Error:", error);
    return Response.json({ success: false, error: 'Gagal membuat tagihan' }, { status: 500 });
  }
}