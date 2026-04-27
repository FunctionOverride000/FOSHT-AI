import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    // Cek kecocokan dan kedaluwarsa OTP
    if (!user || user.resetOtp !== otp) {
      return NextResponse.json({ success: false, error: "Kode OTP salah." }, { status: 400 });
    }
    
    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return NextResponse.json({ success: false, error: "Kode OTP sudah kedaluwarsa. Silakan daftar ulang." }, { status: 400 });
    }

    // Bersihkan OTP, akun dianggap terverifikasi
    await prisma.user.update({
      where: { email },
      data: { resetOtp: null, otpExpiry: null },
    });

    return NextResponse.json({ success: true, message: "Email berhasil diverifikasi!" });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: "Gagal memverifikasi email." }, { status: 500 });
  }
}