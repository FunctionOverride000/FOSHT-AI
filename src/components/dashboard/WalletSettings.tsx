'use client';
import { useState, useEffect } from 'react';

type UserProfile = {
  email?: string;
  btcWallet?: string;
  walletAddress?: string;
  hasPin?: boolean; // WAJIB: Menandakan user sudah buat PIN atau belum dari backend
  [key: string]: unknown;
};

// ─── Custom modal ─────────────────────────────────────────────────────────────
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
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#e5e7eb', lineHeight: 1.5, flex: 1 }}>
        {message}
      </p>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: '2px', flexShrink: 0, lineHeight: 0 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

export default function WalletSettings({ profile, onUpdate }: { profile: UserProfile; onUpdate: () => void }) {
  // States untuk Wallet & PIN (Utama)
  const [wallet, setWallet]     = useState(profile?.btcWallet || profile?.walletAddress || '');
  const [pin, setPin]           = useState('');
  
  // States Manajemen Mode UI
  // 'default' = Tampilan awal
  // 'setup_required' = Kunci layar untuk user lama yang belum punya PIN
  // 'otp_form' = Form untuk buat/reset PIN
  // 'change_pw_form' = Form untuk ganti Password
  const [mode, setMode]         = useState<'default' | 'setup_required' | 'otp_form' | 'change_pw_form'>('default');
  
  // States Form Reset/Change
  const [otp, setOtp]           = useState('');
  const [newPin, setNewPin]     = useState('');
  const [newPassword, setNewPw] = useState('');
  
  // UI States
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // EFek: Kunci layar ke 'setup_required' jika data backend bilang hasPin false
  useEffect(() => {
    if (profile && profile.hasPin === false) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode('setup_required');
    }
  }, [profile]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Simpan Wallet
  const handleSave = async () => {
    if (!wallet || !pin) {
      showToast('error', 'Wallet address and Security PIN are both required.');
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch('/api/profile/update-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet, pin }), 
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Bitcoin wallet updated successfully.');
        setPin('');
        onUpdate();
      } else {
        showToast('error', data.error ?? 'Security verification failed.');
      }
    } catch (_) {
      showToast('error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Minta OTP (Untuk PIN)
  const handleRequestPinOtp = async () => {
    if (!profile?.email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, type: 'PIN' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'OTP Code has been sent to your email.');
        setMode('otp_form');
      } else {
        showToast('error', data.error ?? 'Failed to send OTP.');
      }
    } catch (_) {
      showToast('error', 'Network error while requesting OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Verifikasi OTP (Untuk PIN)
  const handleVerifyPinOtp = async () => {
    if (!otp || !newPin) {
      showToast('error', 'Please enter both the OTP code and your new PIN.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, otp, newPin, type: 'PIN' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Security PIN established successfully!');
        setMode('default');
        setOtp('');
        setNewPin('');
        setPin(newPin); // Opsional: otomatis isi form setelah berhasil
        onUpdate(); // Update state global agar kunci layar terbuka
      } else {
        showToast('error', data.error ?? 'Invalid or expired OTP code.');
      }
    } catch (_) {
      showToast('error', 'Network error while resetting PIN.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Minta OTP (Untuk Ganti Password)
  const handleRequestPwOtp = async () => {
    if (!profile?.email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, type: 'PASSWORD' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Password reset code sent to your email.');
        setMode('change_pw_form');
      } else {
        showToast('error', data.error ?? 'Failed to send reset code.');
      }
    } catch (_) {
      showToast('error', 'Network error while requesting reset code.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Verifikasi OTP (Untuk Ganti Password)
  const handleVerifyPwOtp = async () => {
    if (!otp || !newPassword) {
      showToast('error', 'Please enter both the code and your new password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, otp, newPassword, type: 'PASSWORD' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Account password successfully changed!');
        setMode('default');
        setOtp('');
        setNewPw('');
      } else {
        showToast('error', data.error ?? 'Invalid or expired reset code.');
      }
    } catch (_) {
      showToast('error', 'Network error while changing password.');
    } finally {
      setLoading(false);
    }
  };

  const isValidBtc = wallet.length > 10;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .ws-input {
          width: 100%; box-sizing: border-box;
          background: #080808;
          border: 1px solid #1d1d1d;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; color: #e5e7eb;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ws-input:focus { border-color: #f7931a50; box-shadow: 0 0 0 3px #f7931a10; }
        .ws-input::placeholder { color: #374151; }

        .ws-mono { font-family: 'JetBrains Mono', monospace !important; font-size: 0.8rem !important; }

        .ws-save-btn {
          width: 100%; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.9rem;
          padding: 0.9rem; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #f7931a, #e8750a);
          color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s; box-shadow: 0 2px 16px #f7931a30;
        }
        .ws-save-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 6px 24px #f7931a45; }
        .ws-save-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 #22c55e50} 50%{box-shadow:0 0 0 4px transparent} }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div style={{
        background: 'linear-gradient(145deg, #111, #0d0d0d)', border: '1px solid #1d1d1d',
        borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px #00000040',
      }}>
        {/* Top accent */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #f7931a40, transparent)' }} />

        <div style={{ padding: '1.75rem' }}>

          {/* HEADER UMUM */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid #141414' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#f7931a12', border: '1px solid #f7931a25', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#f7931a" strokeWidth="1.8" width="17" height="17" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12V8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-2"/><path d="M16 12h4v4h-4a2 2 0 010-4z"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f0f0f0', letterSpacing: '-0.02em' }}>Account & Security</h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#4b5563', fontWeight: 300 }}>Manage your wallet and credentials</p>
            </div>
          </div>

          {/* 🔴 TAMPILAN LOCK: WAJIB SETUP PIN (User Lama) */}
          {mode === 'setup_required' && (
            <div style={{ animation: 'fadeSlideIn 0.3s ease-out', textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: 64, height: 64, borderRadius: '50%', background: '#ef444415', border: '1px solid #ef444430', marginBottom: '1.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" width="28" height="28" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#f0f0f0', marginBottom: '0.5rem' }}>
                Security Update Required
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.6, marginBottom: '2rem', padding: '0 1rem' }}>
                FOSHT AI has upgraded its security infrastructure. To continue managing your API Keys and Wallet, you must set up a 6-Digit Security PIN via your registered email.
              </p>
              <button onClick={handleRequestPinOtp} disabled={loading} className="ws-save-btn">
                {loading ? 'Sending Code...' : 'Setup Security PIN Now'}
              </button>
            </div>
          )}

          {/* 🟢 TAMPILAN NORMAL (Default) */}
          {mode === 'default' && (
            <div style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
              
              {/* Email */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4b5563', marginBottom: '0.5rem' }}>
                  Registered Email
                </label>
                <div style={{ background: '#080808', border: '1px solid #141414', borderRadius: '12px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8" width="14" height="14" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: '#6b7280' }}>
                    {profile?.email || 'Loading…'}
                  </span>
                </div>
              </div>

              {/* Bitcoin Wallet */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4b5563' }}>Bitcoin Payout Wallet</label>
                  {isValidBtc && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', fontWeight: 600, color: '#4ade80', background: '#22c55e12', border: '1px solid #22c55e25', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />Valid format
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg viewBox="0 0 24 24" fill="#f7931a" width="14" height="14"><path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/></svg>
                  </div>
                  <input type="text" value={wallet} onChange={e => setWallet(e.target.value)} placeholder="bc1q… or 1A1z… or 3J98t…" className="ws-input ws-mono" style={{ paddingLeft: '2.2rem' }} />
                </div>
              </div>

              {/* Security PIN Input */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f7931a' }}>
                    Security PIN <span style={{ color: '#f7931a60', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(required to save)</span>
                  </label>
                  <button onClick={handleRequestPinOtp} disabled={loading} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#f7931a'} onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                    Forgot PIN?
                  </button>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()} placeholder="Enter your 6-Digit PIN" className="ws-input ws-mono" maxLength={6} style={{ paddingRight: '2.8rem', borderColor: '#f7931a20', letterSpacing: showPw ? 'normal' : '0.2em' }} />
                  <button onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: '2px', lineHeight: 0, transition: 'color 0.15s' }}>
                    {showPw ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button onClick={handleSave} disabled={loading || !wallet || !pin} className="ws-save-btn">
                {loading ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15" style={{ animation: 'spin 0.9s linear infinite' }} strokeLinecap="round"><path d="M21 12a9 9 0 11-6.22-8.56"/></svg> Verifying…</> : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Securely Update Wallet</>}
              </button>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#374151', textAlign: 'center', marginTop: '0.85rem', lineHeight: 1.6, fontWeight: 300 }}>
                Your wallet address is used for Bitcoin payment refunds only. It is never shared or sold.
              </p>

              {/* FITUR BARU: Tombol Ganti Password di bawah, sangat halus & estetik */}
              <div style={{ borderTop: '1px solid #141414', marginTop: '1.5rem', paddingTop: '1.25rem', textAlign: 'center' }}>
                <button 
                  onClick={handleRequestPwOtp} 
                  disabled={loading} 
                  style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.2s' }} 
                  onMouseEnter={e => e.currentTarget.style.color = '#f7931a'} 
                  onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                >
                  {loading ? 'Processing...' : 'Change Account Password'}
                </button>
              </div>

            </div>
          )}

          {/* 🟡 TAMPILAN OTP (Form Verifikasi & Buat PIN Baru) */}
          {mode === 'otp_form' && (
            <div style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
              <div style={{ background: '#f7931a10', border: '1px solid #f7931a20', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#e5e7eb', lineHeight: 1.5 }}>
                  We have sent a 6-digit verification code to <strong style={{ color: '#f7931a' }}>{profile?.email}</strong>.
                </p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4b5563', marginBottom: '0.5rem' }}>6-Digit Email Code</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter code" maxLength={6} className="ws-input ws-mono" style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.2rem' }} />
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f7931a', marginBottom: '0.5rem' }}>New Security PIN</label>
                <input type="password" value={newPin} onChange={e => setNewPin(e.target.value)} placeholder="Create 6-digit PIN" maxLength={6} className="ws-input ws-mono" style={{ letterSpacing: '0.2em', textAlign: 'center' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {profile?.hasPin !== false && (
                  <button onClick={() => setMode('default')} className="ws-input" style={{ flex: 0.4, cursor: 'pointer', textAlign: 'center', fontWeight: 700 }}>Cancel</button>
                )}
                <button onClick={handleVerifyPinOtp} disabled={loading || !otp || !newPin} className="ws-save-btn" style={{ flex: 1 }}>
                  {loading ? 'Verifying...' : 'Set PIN & Continue'}
                </button>
              </div>
            </div>
          )}

          {/* 🔵 TAMPILAN GANTI PASSWORD (OTP Form) - Sama Persis Estetikanya */}
          {mode === 'change_pw_form' && (
            <div style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
              <div style={{ background: '#f7931a10', border: '1px solid #f7931a20', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#e5e7eb', lineHeight: 1.5 }}>
                  A password reset code has been sent to <strong style={{ color: '#f7931a' }}>{profile?.email}</strong>. Please enter it below to create your new password.
                </p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4b5563', marginBottom: '0.5rem' }}>6-Digit Email Code</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter code" maxLength={6} className="ws-input ws-mono" style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.2rem' }} />
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f7931a', marginBottom: '0.5rem' }}>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPw(e.target.value)} placeholder="Enter new password" minLength={6} className="ws-input" />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setMode('default')} className="ws-input" style={{ flex: 0.4, cursor: 'pointer', textAlign: 'center', fontWeight: 700 }}>Cancel</button>
                <button onClick={handleVerifyPwOtp} disabled={loading || !otp || !newPassword} className="ws-save-btn" style={{ flex: 1 }}>
                  {loading ? 'Verifying...' : 'Set New Password'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}