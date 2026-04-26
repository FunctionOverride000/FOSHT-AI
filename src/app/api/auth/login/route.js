import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return Response.json({ success: false, error: 'Email tidak ditemukan' }, { status: 404 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return Response.json({ success: false, error: 'Password salah' }, { status: 401 });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // PERUBAHAN: Tambahkan 'await' di depan cookies()
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: '/',
    });

    return Response.json({ success: true, message: 'Login berhasil' });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}