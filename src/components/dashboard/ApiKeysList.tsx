'use client';
import { useState } from 'react';

// 1. BUKU PANDUAN TYPESCRIPT
type ApiKeyObj = {
  id: string;
  name: string;
  expiresAt: string | Date;
  decryptedKey?: string;
  key?: string;
  apiKey?: string;
  token?: string;
  value?: string;
  [key: string]: unknown;
};

// ─── Custom Modal Toast (Persis seperti WalletSettings) ──────────────
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

// 2. KOMPONEN UTAMA
export default function ApiKeysList({ keys }: { keys: ApiKeyObj[] }) {
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Mengganti alert dengan Toast estetik
    showToast('success', 'API Key successfully copied!');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .ws-input { width: 100%; box-sizing: border-box; outline: none; border-radius: 12px; padding: 0.75rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; transition: border-color 0.2s, box-shadow 0.2s; }
        .ws-mono { font-family: 'JetBrains Mono', monospace !important; font-size: 0.8rem !important; }
        
        .ws-copy-btn {
          display: flex; align-items: center; gap: 0.4rem;
          background: #111; border: 1px solid #1d1d1d;
          color: #e5e7eb; font-family: 'DM Sans', sans-serif; font-size: 0.75rem; font-weight: 600;
          padding: 0.5rem 0.75rem; border-radius: 8px; cursor: pointer;
          transition: all 0.2s;
        }
        .ws-copy-btn:not(:disabled):hover {
          background: #1a1a1a; border-color: #f7931a50; color: #f7931a; transform: translateY(-1px);
        }
        .ws-copy-btn:disabled {
          color: #4b5563; cursor: not-allowed; opacity: 0.7;
        }
        
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div style={{
        background: 'linear-gradient(145deg, #111, #0d0d0d)', border: '1px solid #1d1d1d',
        borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px #00000040',
        animation: 'fadeSlideIn 0.4s ease-out'
      }}>
        {/* Top accent */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #f7931a40, transparent)' }} />

        <div style={{ padding: '1.75rem' }}>

          {/* Header API Licenses */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid #141414' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#f7931a12', border: '1px solid #f7931a25', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#f7931a" strokeWidth="1.8" width="17" height="17" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f0f0f0', letterSpacing: '-0.02em' }}>
                API Licenses
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#4b5563', fontWeight: 300 }}>
                Manage and view your active API keys
              </p>
            </div>
          </div>

          {/* Empty State atau List Keys */}
          {(!keys || keys.length === 0) ? (
            <div style={{ border: '1px dashed #1d1d1d', background: '#0a0a0a', borderRadius: '16px', padding: '3rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.4 }}>🔑</span>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#6b7280' }}>
                You don&apos;t have any active API Keys yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {keys.map((keyObj) => {
                const isExpired = new Date(keyObj.expiresAt) < new Date();
                // 3. Penangkap raw key tanpa error ': unknown'
                const rawKey = keyObj.decryptedKey || keyObj.key || keyObj.apiKey || keyObj.token || keyObj.value || "";

                return (
                  <div key={keyObj.id} style={{
                    background: isExpired ? '#ef444405' : '#080808',
                    border: `1px solid ${isExpired ? '#ef444415' : '#141414'}`,
                    borderRadius: '16px', padding: '1.25rem',
                    transition: 'border-color 0.3s',
                  }}>
                    
                    {/* Header Item: Title, Badge & Tombol Copy */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#f0f0f0' }}>
                            {keyObj.name}
                          </h3>
                          {isExpired ? (
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#ef4444', background: '#ef444415', border: '1px solid #ef444430', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                              Expired
                            </span>
                          ) : (
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#4ade80', background: '#22c55e15', border: '1px solid #22c55e30', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                              Active
                            </span>
                          )}
                        </div>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: '#6b7280' }}>
                          Expires: {new Date(keyObj.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(rawKey)}
                        disabled={isExpired}
                        className="ws-copy-btn"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copy Key
                      </button>
                    </div>

                    {/* Form Input yang menampung API Key (Meniru UI Wallet input) */}
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        readOnly
                        value={isExpired ? '************************ (Key Expired)' : (rawKey || "Synchronizing...")}
                        className="ws-input ws-mono"
                        style={{ 
                          paddingLeft: '2.5rem', 
                          color: isExpired ? '#4b5563' : '#f7931a',
                          borderColor: isExpired ? '#ef444415' : '#1d1d1d',
                          background: isExpired ? 'transparent' : '#050505',
                        }}
                      />
                      <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke={isExpired ? '#4b5563' : '#6b7280'} strokeWidth="1.8" width="15" height="15" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}