'use client';
import { popupSuccess, popupError } from '../../lib/popup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        // Pop-up sukses opsional, atau bisa langsung dilempar ke dashboard
        await popupSuccess('Selamat Datang!', 'Login berhasil.');
        router.push('/dashboard'); 
      } else {
        // PERUBAHAN DI SINI
        popupError('Login Gagal', data.error || 'Email atau password salah');
      }
    } catch (err) {
      popupError('Error Jaringan', 'Periksa koneksi internet Anda.');
    }
    setLoading(false);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 w-full">
      <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Selamat Datang</h2>
        <p className="text-gray-400 text-center text-sm mb-6">Silakan login ke dashboard Anda.</p>
        
        <input 
          type="email" placeholder="Alamat Email" required 
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl p-3.5 mb-4 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
        />
        <input 
          type="password" placeholder="Password" required 
          value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl p-3.5 mb-6 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
        />
        
        <button 
          type="submit" disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-orange-500/20"
        >
          {loading ? 'Memeriksa...' : 'Masuk Dashboard'}
        </button>
        
        <p className="text-gray-500 text-sm mt-6 text-center">
          Belum punya akun? <Link href="/register" className="text-orange-400 hover:text-orange-300 hover:underline">Daftar sekarang</Link>
        </p>
      </form>
    </div>
  );
}