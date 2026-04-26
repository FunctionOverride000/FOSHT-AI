import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma'; // Jalur ke database Anda

export async function POST(req) {
  try {
    // 1. Tangkap data yang dikirim dari form Dashboard
    const body = await req.json();
    const { wallet, password } = body; // Di frontend, pastikan nama payloadnya 'wallet' dan 'password'

    if (!wallet || !password) {
      return NextResponse.json({ success: false, error: 'Alamat Wallet dan Password wajib diisi.' }, { status: 400 });
    }

    // 2. Cek Token Login (Apakah user benar-benar sedang login?)
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Sesi habis, silakan login ulang.' }, { status: 401 });
    }

    // 3. Bongkar Token untuk tahu ini akun milik siapa
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id; 

    // 4. Cari data User di Database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User tidak ditemukan.' }, { status: 404 });
    }

    // 5. VERIFIKASI KEAMANAN: Cocokkan password yang diketik dengan yang ada di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: 'Password salah! Perubahan ditolak untuk keamanan.' }, { status: 403 });
    }

    // 6. SIMPAN WALLET BARU
    // Catatan: Jika nama kolom di schema.prisma Anda bukan 'walletAddress' (misal: 'btcWallet'), silakan diubah di bawah ini
    await prisma.user.update({
      where: { id: userId },
      data: {
        walletAddress: wallet 
      }
    });

    return NextResponse.json({ success: true, message: 'Alamat Wallet berhasil diperbarui!' });

  } catch (error) {
    console.error("FOSHT Wallet Update Error:", error);
    return NextResponse.json({ success: false, error: 'Sistem mengalami gangguan saat menyimpan data.' }, { status: 500 });
  }
}