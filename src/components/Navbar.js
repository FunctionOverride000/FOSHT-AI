'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        // Pastikan status login benar-benar datang dari data sukses profile
        if (data.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (e) {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, [pathname]); // Jalankan ulang setiap kali berpindah halaman

  return (
    <nav className="w-full bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-white tracking-tighter">
          FOSHT<span className="text-orange-500">.AI</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            // Jika sudah login dan tidak di dashboard, tampilkan tombol ke Dashboard
            pathname !== '/dashboard' && (
              <Link href="/dashboard" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-full transition">
                Dashboard
              </Link>
            )
          ) : (
            // Jika belum login dan tidak di halaman login, tampilkan tombol Login
            pathname !== '/login' && (
              <Link href="/login" className="bg-white hover:bg-gray-200 text-black font-bold px-6 py-2 rounded-full transition">
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}