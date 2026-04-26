import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

// BENAR: Menggunakan "export async function POST" (Tanpa kata "default")
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1. Cek apakah email sudah terdaftar di database
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return Response.json({ success: false, error: 'Email sudah terdaftar!' }, { status: 400 });
    }

    // 2. Acak (Hash) password agar aman
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan user baru ke database Neon
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      }
    });

    return Response.json({ success: true, message: 'Registrasi berhasil!' });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}