import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '../../../../lib/prisma'; // Pastikan path ini benar sesuai struktur folder Anda

export async function POST(req) {
  try {
    const body = await req.json();
    
    // PERUBAHAN: Menangkap 'pin', bukan lagi 'password'
    const { wallet, pin } = body;

    if (!wallet || !pin) {
      return NextResponse.json({ success: false, error: 'Alamat Wallet dan Security PIN wajib diisi.' }, { status: 400 });
    }

    // 1. Cek Token Login
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Sesi habis, silakan login ulang.' }, { status: 401 });
    }

    // 2. Verifikasi JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id; 

    // 3. Ambil data User dari Database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User tidak ditemukan.' }, { status: 404 });
    }

    // 4. Verifikasi Security PIN
    // Cek apakah user sudah pernah membuat PIN
    if (!user.pin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Anda belum mengatur PIN. Silakan klik "Forgot PIN" untuk membuat PIN baru via Email.' 
      }, { status: 403 });
    }

    // Cek kecocokan PIN (Berdasarkan kode sebelumnya, PIN disimpan sebagai teks biasa)
    if (user.pin !== pin) {
      return NextResponse.json({ success: false, error: 'Security PIN salah! Perubahan ditolak.' }, { status: 403 });
    }

    // 5. Update Wallet dengan proteksi Error Prisma
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          btcWallet: wallet 
        }
      });
      
      return NextResponse.json({ success: true, message: 'Alamat Wallet berhasil diperbarui!' });

    } catch (prismaError) {
      // Jika alamat wallet sudah ada yang pakai di akun lain
      if (prismaError.code === 'P2002') {
        return NextResponse.json({ 
          success: false, 
          error: 'Alamat Bitcoin ini sudah terdaftar pada pengguna lain. Gunakan alamat unik.' 
        }, { status: 400 });
      }
      throw prismaError; // Lempar ke catch utama jika error lain
    }

  } catch (error) {
    console.error("FOSHT Wallet Update Error:", error);
    
    // Memberikan pesan error yang lebih detil agar tidak bingung
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Sistem mengalami gangguan.' 
    }, { status: 500 });
  }
}