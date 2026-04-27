'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WalletSettings from '../../components/dashboard/WalletSettings';
import AgentSettings from '../../components/dashboard/AgentSettings';
import ApiKeysList from '../../components/dashboard/ApiKeysList';

// ─── Types ────────────────────────────────────────────────────────────────────
type ApiKeyType = {
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

type UserProfileData = {
  id: string;
  email?: string;
  btcWallet?: string;
  walletAddress?: string;
  systemPrompt?: string;
  blogCss?: string;
  apiKeys?: ApiKeyType[];
  keys?: ApiKeyType[];
  ApiKeys?: ApiKeyType[];
  [key: string]: unknown;
};

type Tab = { id: string; label: string; icon: React.ReactNode };

// ─── Tab icon SVGs ────────────────────────────────────────────────────────────
const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);
const AgentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
  </svg>
);
const WalletIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-2" /><path d="M16 12h4v4h-4a2 2 0 010-4z" />
  </svg>
);

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', background: '#080808',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        border: '2px solid #1a1a1a',
        borderTopColor: '#f7931a',
        animation: 'spin 0.9s linear infinite',
      }} />
      <p style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: '0.8rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: '#f7931a',
        animation: 'fadeUp 0.4s ease',
      }}>
        Loading FOSHT Core...
      </p>
    </div>
  );
}

// ─── Sign-out confirmation modal ──────────────────────────────────────────────
function SignOutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.15s ease',
    }}>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{
        width: '100%', maxWidth: 380,
        background: 'linear-gradient(145deg, #141414, #0d0d0d)',
        border: '1px solid #2a1515',
        borderRadius: '20px', overflow: 'hidden',
        boxShadow: '0 40px 80px #00000060',
        animation: 'slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #ef444480, transparent)' }} />
        <div style={{ padding: '1.75rem' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '12px',
            background: '#ef444412', border: '1px solid #ef444430',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" width="20" height="20" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </div>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#f0f0f0', marginBottom: '0.4rem' }}>
            Sign out?
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            You&apos;ll be redirected to the login page. Any unsaved changes will be lost.
          </p>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={onCancel} style={{
              flex: 1, padding: '0.65rem', borderRadius: '10px',
              background: '#1a1a1a', border: '1px solid #2a2a2a',
              color: '#9ca3af', fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#222')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}
            >
              Cancel
            </button>
            <button onClick={onConfirm} style={{
              flex: 1, padding: '0.65rem', borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none', color: '#fff',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              boxShadow: '0 0 16px #ef444430',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 20px #ef444450'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 16px #ef444430'; }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('keys');
  const [mounted, setMounted] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.status === 401) return router.push('/login');
      const data = await res.json();
      if (data.success) setProfile(data);
    } catch (_) {
      console.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchProfile(); }, []);
  useEffect(() => { if (!loading) setTimeout(() => setMounted(true), 60); }, [loading]);

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();
      if (data.success) { localStorage.clear(); router.replace('/login'); }
    } catch (_) { router.replace('/login'); }
  };

  if (loading) return <LoadingScreen />;

  const userKeys = (profile?.apiKeys || profile?.keys || profile?.ApiKeys || []) as ApiKeyType[];

  const tabs: Tab[] = [
    { id: 'keys',   label: 'API Licenses',           icon: <KeyIcon /> },
    { id: 'agent',  label: 'Agent Config',            icon: <AgentIcon /> },
    { id: 'wallet', label: 'Security & Wallet',       icon: <WalletIcon /> },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .db-root { min-height: 100vh; background: #080808; color: #d1d5db; font-family: 'DM Sans', sans-serif; }
        .db-root ::selection { background: #f7931a; color: #fff; }

        .db-reveal {
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
        }
        .db-reveal.show { opacity: 1; transform: translateY(0); }

        /* Tab button */
        .db-tab {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 1.1rem;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer; border: none; outline: none;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .db-tab.active {
          background: #f7931a18;
          color: #f7931a;
          box-shadow: inset 0 0 0 1px #f7931a30;
        }
        .db-tab.inactive {
          background: transparent;
          color: #4b5563;
        }
        .db-tab.inactive:hover { background: #111; color: #9ca3af; }

        /* Tab content transition */
        .db-tab-content {
          opacity: 0; transform: translateY(10px);
          animation: tabIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes tabIn {
          to { opacity: 1; transform: translateY(0); }
        }

        /* Upgrade card */
        .db-upgrade-card {
          background: linear-gradient(145deg, #111, #0d0d0d);
          border: 1px solid #1d1d1d;
          border-radius: 16px; padding: 1.5rem;
          position: relative; overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .db-upgrade-card:hover {
          border-color: #f7931a30;
          box-shadow: 0 0 30px #f7931a0c;
        }
        .db-upgrade-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #f7931a40, transparent);
        }
        .db-upgrade-btn {
          display: block; width: 100%; text-align: center;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700; font-size: 0.875rem;
          padding: 0.75rem; border-radius: 10px;
          background: linear-gradient(135deg, #f7931a, #e8750a);
          color: #fff; text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 12px #f7931a30;
        }
        .db-upgrade-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px #f7931a45; }

        /* Sign out btn */
        .db-signout-btn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          padding: 0.55rem 1rem; border-radius: 10px;
          background: #ef444410; border: 1px solid #ef444420;
          color: #ef4444; cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .db-signout-btn:hover { background: #ef444418; border-color: #ef444435; transform: translateY(-1px); }

        /* Stats row */
        .db-stat {
          background: #0d0d0d; border: 1px solid #181818;
          border-radius: 14px; padding: 1rem 1.25rem;
          display: flex; align-items: center; gap: 0.85rem;
          transition: border-color 0.25s;
        }
        .db-stat:hover { border-color: #2a2a2a; }

        @media (max-width: 640px) {
          .db-stats { flex-direction: column; }
        }
      `}</style>

      {showSignOut && (
        <SignOutModal onConfirm={handleSignOut} onCancel={() => setShowSignOut(false)} />
      )}

      <div className="db-root">
        {/* Ambient glow */}
        <div style={{
          position: 'fixed', top: '-15vh', left: '50%',
          transform: 'translateX(-50%)',
          width: '50vw', height: '40vh',
          background: 'radial-gradient(ellipse, #f7931a06 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem 5rem', position: 'relative', zIndex: 1 }}>

          {/* ── Header */}
          <div
            className={`db-reveal ${mounted ? 'show' : ''}`}
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', gap: '1rem' }}
          >
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4b5563', marginBottom: '0.4rem' }}>
                Control Panel
              </p>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', letterSpacing: '-0.04em', color: '#f0f0f0', marginBottom: '0.3rem' }}>
                Core Dashboard.
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: 300 }}>
                Manage licenses, security, and AI configurations.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {profile?.email && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.45rem 0.9rem', borderRadius: '10px',
                  background: '#0d0d0d', border: '1px solid #1a1a1a',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#6b7280' }}>
                    {profile.email}
                  </span>
                </div>
              )}
              <button className="db-signout-btn" onClick={() => setShowSignOut(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>

          {/* ── Stats row */}
          <div
            className={`db-reveal ${mounted ? 'show' : ''}`}
            style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap', transitionDelay: '0.08s' }}
          >
            {[
              { icon: '🔑', label: 'Active Licenses', value: userKeys.length },
              { icon: '⚡', label: 'Status', value: 'Online' },
              { icon: '₿', label: 'Payment Method', value: 'Bitcoin' },
            ].map((s) => (
              <div key={s.label} className="db-stat">
                <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', color: '#4b5563', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1px' }}>{s.label}</p>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#e5e7eb' }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Tabs */}
          <div
            className={`db-reveal ${mounted ? 'show' : ''}`}
            style={{
              display: 'flex', gap: '0.35rem', marginBottom: '1.75rem',
              padding: '0.4rem', background: '#0d0d0d',
              border: '1px solid #161616', borderRadius: '14px',
              width: 'fit-content', overflowX: 'auto',
              transitionDelay: '0.12s',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`db-tab ${activeTab === tab.id ? 'active' : 'inactive'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab content */}
          <div key={activeTab} className="db-tab-content">

            {activeTab === 'keys' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: '1.25rem', alignItems: 'start' }}>
                  <div>
                    <ApiKeysList keys={userKeys} />
                  </div>
                  <div className="db-upgrade-card">
                    <div style={{
                      width: 36, height: 36, borderRadius: '10px',
                      background: '#f7931a15', border: '1px solid #f7931a25',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '0.85rem',
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="#f7931a" strokeWidth="2" width="17" height="17" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                      </svg>
                    </div>
                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f0f0f0', marginBottom: '0.4rem' }}>
                      Need More Power?
                    </h2>
                    <p style={{ fontSize: '0.8rem', color: '#4b5563', marginBottom: '1.25rem', lineHeight: 1.6, fontWeight: 300 }}>
                      Upgrade for higher word limits, HD images, and priority queue access.
                    </p>
                    <Link href="/#pricing" className="db-upgrade-btn">
                      Buy New License
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agent' && profile && (
              <AgentSettings profile={profile} />
            )}

            {activeTab === 'wallet' && profile && (
              <div style={{ maxWidth: 480 }}>
                <WalletSettings profile={profile} onUpdate={fetchProfile} />
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}