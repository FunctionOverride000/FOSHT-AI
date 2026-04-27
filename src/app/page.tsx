'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import PricingSection from '../components/PricingSection';
import CheckoutProcess from '../components/CheckoutProcess';

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderData = {
  id: string;
  btcAmount?: number;
  btcAddress?: string;
  status?: string;
  [key: string]: unknown;
};

type ModalConfig = {
  type: 'info' | 'error' | 'warning' | 'success';
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
};

// ─── Custom Alert Modal ────────────────────────────────────────────────────────
function AlertModal({
  config,
  onClose,
}: {
  config: ModalConfig;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const icons = {
    info: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    success: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  };

  const colors = {
    info:    { bg: '#1a2744', border: '#3b82f6', icon: '#60a5fa', btn: '#3b82f6', btnHover: '#2563eb' },
    error:   { bg: '#2a1212', border: '#ef4444', icon: '#f87171', btn: '#ef4444', btnHover: '#dc2626' },
    warning: { bg: '#271f0a', border: '#f59e0b', icon: '#fbbf24', btn: '#f59e0b', btnHover: '#d97706' },
    success: { bg: '#0d2318', border: '#22c55e', icon: '#4ade80', btn: '#22c55e', btnHover: '#16a34a' },
  };

  const c = colors[config.type];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.18s ease' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: `linear-gradient(145deg, ${c.bg} 0%, #0d0d0d 100%)`,
          border: `1px solid ${c.border}30`,
          animation: 'slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${c.border}, transparent)` }} />

        <div className="p-7">
          {/* Icon + Title */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `${c.icon}18`, color: c.icon, border: `1px solid ${c.icon}30` }}
            >
              {icons[config.type]}
            </div>
            <div className="flex-1 pt-1">
              <h3
                className="text-lg font-bold tracking-tight mb-1"
                style={{ color: '#f0f0f0', fontFamily: "'Syne', sans-serif" }}
              >
                {config.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: '#9ca3af', fontFamily: "'DM Sans', sans-serif" }}
              >
                {config.message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 justify-end">
            {config.cancelLabel && (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: '#1f1f1f',
                  border: '1px solid #2f2f2f',
                  color: '#9ca3af',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#2a2a2a';
                  (e.currentTarget as HTMLButtonElement).style.color = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#1f1f1f';
                  (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af';
                }}
              >
                {config.cancelLabel}
              </button>
            )}
            <button
              onClick={() => {
                config.onConfirm?.();
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: c.btn,
                color: '#fff',
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: `0 0 20px ${c.btn}40`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = c.btnHover;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = c.btn;
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              {config.confirmLabel ?? 'OK'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}

// ─── Loading Overlay ───────────────────────────────────────────────────────────
function LoadingOverlay() {
  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.2s ease' }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Bitcoin spinner */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #f7931a22, #f7931a44)',
            border: '2px solid #f7931a40',
            boxShadow: '0 0 40px #f7931a30',
            animation: 'spin 1.2s linear infinite',
          }}
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8" style={{ color: '#f7931a' }} fill="currentColor">
            <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#f7931a', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', letterSpacing: '0.08em' }}>
            PROCESSING
          </p>
          <p style={{ color: '#6b7280', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', marginTop: 4 }}>
            Creating your order...
          </p>
        </div>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

// ─── Step Progress Indicator ───────────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  if (step === 1) return null;

  const steps = [
    { n: 1, label: 'Select Plan' },
    { n: 2, label: 'Payment' },
    { n: 3, label: 'Confirmed' },
  ];

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-4 px-6"
      style={{
        background: 'linear-gradient(180deg, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.85) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1f1f1f',
      }}
    >
      <div className="flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: step >= s.n
                    ? 'linear-gradient(135deg, #f7931a, #e8750a)'
                    : '#1a1a1a',
                  color: step >= s.n ? '#fff' : '#4b5563',
                  border: step >= s.n ? 'none' : '1px solid #2d2d2d',
                  boxShadow: step >= s.n ? '0 0 20px #f7931a50' : 'none',
                }}
              >
                {step > s.n ? (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : s.n}
              </div>
              <span
                className="text-xs mt-1.5 font-medium tracking-wide hidden sm:block"
                style={{
                  color: step >= s.n ? '#f7931a' : '#4b5563',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'color 0.3s',
                }}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-16 sm:w-24 h-px mx-1 transition-all duration-700"
                style={{
                  background: step > s.n
                    ? 'linear-gradient(90deg, #f7931a, #f7931a80)'
                    : '#222',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userWallet, setUserWallet] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalConfig | null>(null);
  const [pageVisible, setPageVisible] = useState(false);
  const router = useRouter();

  // ── Page entrance animation
  useEffect(() => {
    const t = setTimeout(() => setPageVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // ── Custom alert helper
  const showModal = useCallback((config: ModalConfig) => setModal(config), []);

  // ── Auth check
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.success) {
          setIsLoggedIn(true);
          setUserId(data.userId);
          setUserWallet(data.btcWallet);
        }
      } catch (_) {}
    };
    checkLogin();
  }, []);

  // ── Blockchain payment scanner
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (step === 2 && order?.id) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order.id }),
          });
          const data = await res.json();
          if (data.status === 'CONFIRMED') {
            setStep(3);
            clearInterval(interval);
          }
        } catch (_) {}
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [step, order]);

  // ── Purchase handler
  const handleBuy = async (plan: { id: string | number; [key: string]: unknown }) => {
    if (!isLoggedIn) {
      showModal({
        type: 'info',
        title: 'Sign In Required',
        message: 'You need to be logged in to purchase a plan. Please sign in to continue.',
        confirmLabel: 'Go to Login',
        cancelLabel: 'Cancel',
        onConfirm: () => router.push('/login'),
      });
      return;
    }

    if (!userWallet) {
      showModal({
        type: 'warning',
        title: 'Bitcoin Wallet Missing',
        message:
          'You haven\'t registered a Bitcoin wallet yet. Please add your BTC wallet address in your Dashboard before making a purchase.',
        confirmLabel: 'Go to Dashboard',
        cancelLabel: 'Cancel',
        onConfirm: () => router.push('/dashboard'),
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, planType: plan.id }),
      });
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
        setStep(2);
      } else {
        showModal({
          type: 'error',
          title: 'Order Failed',
          message: data.error ?? 'Something went wrong while creating your order. Please try again.',
          confirmLabel: 'Try Again',
        });
      }
    } catch (_) {
      showModal({
        type: 'error',
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        confirmLabel: 'OK',
      });
    }
    setLoading(false);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Global font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --btc: #f7931a;
          --btc-dim: #f7931a40;
          --bg: #080808;
          --surface: #111111;
          --border: #1d1d1d;
          --text: #f0f0f0;
          --muted: #6b7280;
        }

        body { background: var(--bg); }

        /* Grain overlay */
        .landing-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
          z-index: 0;
        }

        /* Ambient glow */
        .landing-root::after {
          content: '';
          position: fixed;
          top: -30vh;
          left: 50%;
          transform: translateX(-50%);
          width: 70vw;
          height: 60vh;
          background: radial-gradient(ellipse at center, #f7931a0d 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Page reveal */
        .page-reveal {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .page-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Checkout reveal with step offset */
        .checkout-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease 0.1s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s;
        }
        .checkout-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #f7931a60; }
      `}</style>

      <div
        className="landing-root w-full min-h-screen relative"
        style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Step progress bar (shown in checkout) */}
        <StepIndicator step={step} />

        {/* Loading overlay */}
        {loading && <LoadingOverlay />}

        {/* Custom modal */}
        {modal && <AlertModal config={modal} onClose={() => setModal(null)} />}

        {/* Main content */}
        {step > 1 ? (
          <div
            className={`checkout-reveal relative z-10 ${pageVisible ? 'visible' : ''}`}
            style={{ paddingTop: '80px' }}
          >
            <CheckoutProcess step={step} order={order} />
          </div>
        ) : (
          <div className={`page-reveal relative z-10 ${pageVisible ? 'visible' : ''}`}>
            <HeroSection />
            <FeatureSection />
            <PricingSection handleBuy={handleBuy} loading={loading} />
          </div>
        )}
      </div>
    </>
  );
}