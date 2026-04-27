'use client';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderData = {
  id: string;
  btcAmount?: number;
  btcAddress?: string;
  status?: string;
  [key: string]: unknown;
};

// ─── Copy-to-clipboard button ─────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.72rem', fontWeight: 600,
        letterSpacing: '0.06em', textTransform: 'uppercase',
        color: copied ? '#4ade80' : '#f7931a',
        background: copied ? '#4ade8015' : '#f7931a15',
        border: `1px solid ${copied ? '#4ade8030' : '#f7931a30'}`,
        borderRadius: '8px',
        padding: '0.3rem 0.65rem',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        flexShrink: 0,
      }}
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

// ─── Countdown timer (15s scan cycle) ────────────────────────────────────────
function ScanTimer() {
  const [secs, setSecs] = useState(15);
  useEffect(() => {
    const t = setInterval(() => {
      setSecs((s) => (s <= 1 ? 15 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pct = ((15 - secs) / 15) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#6b7280', letterSpacing: '0.04em' }}>
          Next blockchain scan
        </span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.78rem', fontWeight: 700, color: '#f7931a' }}>
          {secs}s
        </span>
      </div>
      {/* Progress bar */}
      <div style={{ height: '3px', background: '#1a1a1a', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #f7931a, #fbbf24)',
          borderRadius: '99px',
          transition: 'width 1s linear',
          boxShadow: '0 0 8px #f7931a60',
        }} />
      </div>
    </div>
  );
}

// ─── Step 2 — Payment panel ────────────────────────────────────────────────────
function PaymentPanel({ order }: { order: OrderData }) {
  const [mounted, setMounted] = useState(false);
  const btcUri = `bitcoin:${order.btcAddress}?amount=${order.btcAmount}`;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .cp-panel {
          opacity: 0;
          transform: translateY(20px) scale(0.98);
          transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .cp-panel.show { opacity: 1; transform: translateY(0) scale(1); }

        /* Pulse ring on QR */
        .cp-qr-ring {
          animation: ringPulse 2.5s ease-in-out infinite;
        }
        @keyframes ringPulse {
          0%,100% { box-shadow: 0 0 0 0 #f7931a20; }
          50%      { box-shadow: 0 0 0 10px transparent; }
        }

        /* Spinner dots */
        .cp-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #f7931a;
          animation: dotBounce 1.4s ease-in-out infinite;
          opacity: 0.3;
        }
        .cp-dot:nth-child(1) { animation-delay: 0s; }
        .cp-dot:nth-child(2) { animation-delay: 0.2s; }
        .cp-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotBounce {
          0%,80%,100% { opacity: 0.2; transform: scale(0.8); }
          40%          { opacity: 1;   transform: scale(1.2); }
        }

        /* Amount shine */
        .cp-amount {
          background: linear-gradient(110deg, #f7931a 30%, #fbbf24 50%, #f7931a 70%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shine 3s linear infinite;
        }
        @keyframes shine {
          from { background-position: 200% center; }
          to   { background-position:   0% center; }
        }
      `}</style>

      <div
        className={`cp-panel ${mounted ? 'show' : ''}`}
        style={{
          width: '100%', maxWidth: '460px', margin: '0 auto',
          background: 'linear-gradient(160deg, #111 0%, #0a0a0a 100%)',
          border: '1px solid #1d1d1d',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 40px 80px #00000060, 0 0 0 0 transparent',
        }}
      >
        {/* Top accent */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #f7931a80, transparent)' }} />

        <div style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#4b5563', marginBottom: '0.5rem',
            }}>
              Awaiting Payment
            </p>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800, fontSize: '1.5rem',
              letterSpacing: '-0.03em', color: '#f0f0f0',
              marginBottom: '0.4rem',
            }}>
              Complete Your Purchase
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: '#6b7280', fontWeight: 300 }}>
              Send exactly{' '}
              <span className="cp-amount" style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                {order.btcAmount} BTC
              </span>
              {' '}to the address below
            </p>
          </div>

          {/* QR Code */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div
              className="cp-qr-ring"
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '14px',
                border: '1px solid #f7931a20',
              }}
            >
              <QRCodeSVG
                value={btcUri}
                size={200}
                level="H"
                imageSettings={{ src: '/fosht-logo.png', height: 44, width: 44, excavate: true }}
              />
            </div>
          </div>

          {/* Amount chip */}
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: '1.25rem',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: '#f7931a10', border: '1px solid #f7931a25',
              borderRadius: '999px', padding: '0.45rem 1.1rem',
            }}>
              <svg viewBox="0 0 24 24" fill="#f7931a" width="14" height="14">
                <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
              </svg>
              <span style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: '0.95rem', color: '#f7931a',
              }}>
                {order.btcAmount} BTC
              </span>
            </div>
          </div>

          {/* Address box */}
          <div style={{
            background: '#0d0d0d',
            border: '1px solid #1d1d1d',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.25rem',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '0.5rem',
            }}>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.68rem', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#4b5563',
              }}>
                Bitcoin Address
              </span>
              <CopyButton text={order.btcAddress ?? ''} />
            </div>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.78rem', color: '#d97706',
              wordBreak: 'break-all', lineHeight: 1.7,
              userSelect: 'all', cursor: 'text', margin: 0,
            }}>
              {order.btcAddress}
            </p>
          </div>

          {/* Scan timer */}
          <div style={{
            background: '#0d0d0d', border: '1px solid #1a1a1a',
            borderRadius: '12px', padding: '0.9rem 1rem',
            marginBottom: '1.25rem',
          }}>
            <ScanTimer />
          </div>

          {/* Waiting indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.65rem',
            background: '#f7931a08', border: '1px solid #f7931a18',
            borderRadius: '12px', padding: '0.85rem',
          }}>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div className="cp-dot" />
              <div className="cp-dot" />
              <div className="cp-dot" />
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.82rem', color: '#9ca3af', fontWeight: 400, margin: 0,
            }}>
              Listening on the Bitcoin network...
            </p>
          </div>

          {/* Fine print */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem', color: '#374151',
            textAlign: 'center', marginTop: '1.25rem',
            lineHeight: 1.6, fontWeight: 300,
          }}>
            The blockchain scanner polls every 15 seconds. This page updates automatically once your transaction is confirmed.
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Step 3 — Success panel ───────────────────────────────────────────────────
function SuccessPanel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .cp-success-panel {
          opacity: 0;
          transform: scale(0.95) translateY(16px);
          transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
        }
        .cp-success-panel.show { opacity: 1; transform: scale(1) translateY(0); }

        /* Check icon */
        .cp-check-wrap {
          animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
        .cp-check-ring {
          animation: ringExpand 2.5s ease-in-out infinite;
        }
        @keyframes ringExpand {
          0%,100% { box-shadow: 0 0 0 0 #22c55e20; }
          50%      { box-shadow: 0 0 0 14px transparent; }
        }

        /* Confetti dots */
        .cp-confetti-dot {
          position: absolute;
          border-radius: 50%;
          animation: confettiFly var(--dur) ease-out var(--delay) forwards;
          opacity: 0;
        }
        @keyframes confettiFly {
          0%   { opacity: 1; transform: translate(0,0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }

        /* Dashboard button */
        .cp-dash-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700; font-size: 0.95rem;
          padding: 0.95rem 1.5rem;
          border-radius: 14px;
          background: linear-gradient(135deg, #f7931a, #e8750a);
          color: #fff;
          text-decoration: none;
          position: relative; overflow: hidden;
          transition: transform 0.22s, box-shadow 0.22s;
          box-shadow: 0 4px 20px #f7931a40;
          letter-spacing: 0.01em;
        }
        .cp-dash-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #ffffff22, transparent 60%);
          opacity: 0; transition: opacity 0.2s;
        }
        .cp-dash-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px #f7931a55; }
        .cp-dash-btn:hover::before { opacity: 1; }
      `}</style>

      <div
        className={`cp-success-panel ${mounted ? 'show' : ''}`}
        style={{
          width: '100%', maxWidth: '420px', margin: '0 auto',
          background: 'linear-gradient(160deg, #0f1a0f 0%, #0a0a0a 100%)',
          border: '1px solid #22c55e20',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 40px 80px #00000060, 0 0 60px #22c55e08',
        }}
      >
        {/* Top accent */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #22c55e60, transparent)' }} />

        <div style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>

          {/* Icon with confetti */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.75rem' }}>
            {/* Confetti dots */}
            {[
              { color: '#f7931a', tx: '-40px', ty: '-30px', dur: '0.7s', delay: '0.3s', size: 8 },
              { color: '#22c55e', tx:  '40px', ty: '-35px', dur: '0.8s', delay: '0.35s', size: 6 },
              { color: '#fbbf24', tx: '-50px', ty:  '10px', dur: '0.75s', delay: '0.25s', size: 7 },
              { color: '#60a5fa', tx:  '45px', ty:  '15px', dur: '0.9s', delay: '0.4s', size: 5 },
              { color: '#f7931a', tx:   '0px', ty: '-50px', dur: '0.85s', delay: '0.3s', size: 6 },
              { color: '#22c55e', tx: '-20px', ty:  '45px', dur: '0.7s', delay: '0.45s', size: 5 },
              { color: '#fbbf24', tx:  '25px', ty:  '40px', dur: '0.8s', delay: '0.2s', size: 7 },
            ].map((dot, i) => (
              <div
                key={i}
                className="cp-confetti-dot"
                style={{
                  width: dot.size, height: dot.size,
                  background: dot.color,
                  top: '50%', left: '50%',
                  '--tx': dot.tx, '--ty': dot.ty,
                  '--dur': dot.dur, '--delay': dot.delay,
                } as React.CSSProperties}
              />
            ))}

            {/* Icon ring */}
            <div
              className="cp-check-wrap cp-check-ring"
              style={{
                width: 80, height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22c55e20, #22c55e10)',
                border: '1px solid #22c55e40',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" width="36" height="36"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#22c55e', marginBottom: '0.5rem',
            }}>
              Transaction Confirmed
            </p>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800, fontSize: '1.75rem',
              letterSpacing: '-0.04em', color: '#f0f0f0',
              marginBottom: '0.75rem',
            }}>
              Payment Verified!
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.875rem', color: '#6b7280',
              lineHeight: 1.75, fontWeight: 300,
              maxWidth: '320px', margin: '0 auto',
            }}>
              Your Bitcoin transaction has been validated on-chain. Your subscription license is now active and your API key is ready.
            </p>
          </div>

          {/* Info row */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            {[
              { icon: '🔑', label: 'API Key Ready' },
              { icon: '⚡', label: 'Instant Access' },
            ].map((item) => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.78rem', color: '#4b5563', fontWeight: 400,
              }}>
                <span>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link href="/dashboard" className="cp-dash-btn">
            View API Key in Dashboard
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem', color: '#374151',
            marginTop: '1rem', fontWeight: 300,
          }}>
            A confirmation email has been sent to your registered address.
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function CheckoutProcess({
  step,
  order,
}: {
  step: number;
  order: OrderData | null;
}) {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
    }}>
      {step === 2 && order && <PaymentPanel order={order} />}
      {step === 3 && <SuccessPanel />}
    </div>
  );
}