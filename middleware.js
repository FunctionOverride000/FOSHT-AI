import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. Cek apakah pengunjung membawa tiket (Cookie Token)
  const token = request.cookies.get('token')?.value;

  // 2. Kenali halaman apa yang sedang dituju pengunjung
  const path = request.nextUrl.pathname;
  const isDashboardPage = path.startsWith('/dashboard');
  const isAuthPage = path.startsWith('/login') || path.startsWith('/register');

  // ==========================================
  // ATURAN 1: BELUM LOGIN TAPI MAKSA MASUK DASHBOARD
  // ==========================================
  if (isDashboardPage && !token) {
    // Arahkan dengan anggun ke halaman login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ==========================================
  // ATURAN 2: SUDAH LOGIN TAPI ISENG BUKA HALAMAN LOGIN
  // ==========================================
  // Orang yang sudah login tidak perlu melihat form login atau register lagi
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika semua aman, silakan lewat!
  return NextResponse.next();
}

// Konfigurasi jalur patroli si Satpam (Middleware)
// Tentukan halaman mana saja yang perlu dijaga
export const config = {
  matcher: [
    '/dashboard/:path*', // Jaga seluruh halaman di dalam dashboard
    '/login',
    '/register'
  ],
};