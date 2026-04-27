'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function Toast({ type, message, onClose }: { type: 'success' | 'error'; message: string; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      background: type === 'success' ? '#0d2318' : '#2a1212',
      border: `1px solid ${type === 'success' ? '#22c55e30' : '#ef444430'}`,
      borderRadius: '14px', padding: '0.85rem 1.1rem',
      boxShadow: '0 20px 60px #00000060',
      animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      maxWidth: 320,
    }}>
      <style>{`@keyframes toastIn { from{opacity:0;transform:translateY(12px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>
      <div style={{
        width: 32, height: 32, borderRadius: '9px', flexShrink: 0,
        background: type === 'success' ? '#22c55e15' : '#ef444415',
        border: `1px solid ${type === 'success' ? '#22c55e25' : '#ef444425'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {type === 'success' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" width="14" height="14" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" width="14" height="14" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        )}
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#e5e7eb', lineHeight: 1.5, flex: 1 }}>{message}</p>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: '2px', flexShrink: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'register' | 'otp'>('register');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return showToast('error', 'Semua kolom wajib diisi.');
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Kode OTP telah dikirim ke email Anda.');
        setMode('otp');
      } else {
        showToast('error', data.error);
      }
    } catch (_) {
      showToast('error', 'Network error. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return showToast('error', 'Masukkan 6 digit kode OTP.');
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Akun berhasil diverifikasi! Mengalihkan ke halaman login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        showToast('error', data.error);
      }
    } catch (_) {
      showToast('error', 'Network error. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .auth-input { width: 100%; box-sizing: border-box; background: #080808; border: 1px solid #1d1d1d; border-radius: 12px; padding: 0.85rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: #e5e7eb; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .auth-input:focus { border-color: #f7931a50; box-shadow: 0 0 0 3px #f7931a10; }
        .auth-input::placeholder { color: #374151; }
        .auth-btn { width: 100%; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.9rem; padding: 1rem; border-radius: 12px; border: none; background: linear-gradient(135deg, #f7931a, #e8750a); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s; box-shadow: 0 4px 20px #f7931a30; }
        .auth-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 6px 25px #f7931a45; }
        .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="relative z-10 w-full max-w-[420px]" style={{ animation: 'fadeSlideIn 0.5s ease-out' }}>
        
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link href="/" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem', color: '#f0f0f0', letterSpacing: '-0.04em', textDecoration: 'none' }}>
            FOSHT<span style={{ color: '#f7931a' }}>.AI</span>
          </Link>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Decentralized SEO Engine
          </p>
        </div>

        {/* Auth Card */}
        <div style={{ background: 'linear-gradient(145deg, #111, #0d0d0d)', border: '1px solid #1d1d1d', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px #00000060' }}>
          <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #f7931a60, transparent)' }} />
          
          <div className="p-8 md:p-10">
            {mode === 'register' && (
              <form onSubmit={handleRegister} style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Create Account</h2>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#6b7280' }}>Join the automated SEO revolution.</p>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.5rem' }}>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@company.com" className="auth-input" />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '0.5rem' }}>Secure Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Create a strong password" minLength={6} className="auth-input" style={{ paddingRight: '3rem' }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0 }}>
                      {showPw ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="auth-btn">
                  {loading ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-6.22-8.56"/></svg> Creating...</> : 'Continue to Verification'}
                </button>
              </form>
            )}

            {mode === 'otp' && (
              <form onSubmit={handleVerify} style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: 56, height: 56, borderRadius: '50%', background: '#f7931a15', border: '1px solid #f7931a30', marginBottom: '1rem' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#f7931a" strokeWidth="2" width="24" height="24" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Check your inbox</h2>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5 }}>We&apos;ve sent a 6-digit code to <br/><strong style={{ color: '#e5e7eb' }}>{email}</strong></p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required placeholder="Enter 6-digit code" maxLength={6} className="auth-input" style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.4em', textAlign: 'center', fontSize: '1.25rem', padding: '1rem' }} />
                </div>

                <button type="submit" disabled={loading || otp.length < 6} className="auth-btn">
                  {loading ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-6.22-8.56"/></svg> Verifying...</> : 'Verify & Complete'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#6b7280' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#f7931a', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }}>
              Sign in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}