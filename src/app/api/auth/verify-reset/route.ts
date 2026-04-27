import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs'; // Jika Anda memakai bcrypt untuk hash password

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword, newPin, type } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    // 1. Validasi OTP dan Waktu Kedaluwarsa
    if (!user || user.resetOtp !== otp) {
      return NextResponse.json({ success: false, error: "Kode OTP salah." }, { status: 400 });
    }
    
    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return NextResponse.json({ success: false, error: "Kode OTP sudah kedaluwarsa. Silakan minta ulang." }, { status: 400 });
    }

    // 2. Eksekusi Perubahan Data
    if (type === 'PASSWORD' && newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { email },
        data: { 
          password: hashedPassword,
          resetOtp: null, // Bersihkan OTP agar tidak bisa dipakai lagi
          otpExpiry: null 
        },
      });
    } else if (type === 'PIN' && newPin) {
      // Anda juga bisa menghash PIN jika mau, tapi untuk demo kita simpan plain text dulu
      await prisma.user.update({
        where: { email },
        data: { 
          pin: newPin,
          resetOtp: null,
          otpExpiry: null 
        },
      });
    }

    return NextResponse.json({ success: true, message: `${type} berhasil direset!` });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: "Gagal mereset data." }, { status: 500 });
  }
}