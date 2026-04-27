import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { sendOtpEmail } from '../../../../lib/mail';

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json(); // type isinya 'PASSWORD' atau 'PIN'

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Demi keamanan, jangan beritahu jika email tidak ada. Beri respon sukses palsu.
      return NextResponse.json({ success: true, message: "Jika email terdaftar, OTP telah dikirim." });
    }

    // Buat 6-Digit OTP acak
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Kedaluwarsa dalam 10 menit
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    // Simpan ke database
    await prisma.user.update({
      where: { email },
      data: { resetOtp: otp, otpExpiry },
    });

    // Kirim Email pakai functionoverride000@gmail.com
    await sendOtpEmail(email, otp, type);

    return NextResponse.json({ success: true, message: "OTP berhasil dikirim ke email Anda." });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Gagal mengirim OTP." }, { status: 500 });
  }
}