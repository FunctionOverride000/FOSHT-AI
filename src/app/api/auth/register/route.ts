import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { sendOtpEmail } from '../../../../lib/mail';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email sudah terdaftar!' }, { status: 400 });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Buat OTP 6-Digit
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 Menit

    // 4. Simpan user baru beserta OTP-nya
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        resetOtp: otp,
        otpExpiry: otpExpiry,
      }
    });

    // 5. Kirim Email Verifikasi
    await sendOtpEmail(email, otp, 'REGISTER');

    return NextResponse.json({ success: true, message: 'Registrasi tahap 1 berhasil. OTP terkirim!' });
  } catch (error: unknown) {
    console.error("Register Error:", error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}