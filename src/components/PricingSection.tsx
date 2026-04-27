'use client';
import { useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Plan = {
  id: string;
  name: string;
  duration: string;
  price: number | string;
  features: string[];
  popular?: boolean;
};

type Props = {
  handleBuy: (plan: Plan) => void;
  loading: boolean;
};

// ─── Intersection-observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Feature row ──────────────────────────────────────────────────────────────
function FeatureRow({ text, popular }: { text: string; popular?: boolean }) {
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        background: popular ? '#f7931a18' : '#ffffff0a',
        border: `1px solid ${popular ? '#f7931a40' : '#2d2d2d'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke={popular ? '#f7931a' : '#6b7280'}
          strokeWidth="2.5" width="10" height="10" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.85rem',
        color: popular ? '#d1d5db' : '#6b7280',
        lineHeight: 1.5, fontWeight: 400,
      }}>
        {text}
      </span>
    </li>
  );
}

// ─── Single pricing card ───────────────────────────────────────────────────────
function PricingCard({
  plan, index, handleBuy, loading,
}: {
  plan: Plan; index: number; handleBuy: Props['handleBuy']; loading: boolean;
}) {
  const { ref, inView } = useInView(0.1);
  const [hovered, setHovered] = useState(false);

  const isPopular = !!plan.popular;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '22px',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        background: isPopular
          ? 'linear-gradient(160deg, #1a1008 0%, #110c04 50%, #0a0a0a 100%)'
          : 'linear-gradient(160deg, #111 0%, #0a0a0a 100%)',
        border: `1px solid ${isPopular
          ? hovered ? '#f7931a60' : '#f7931a30'
          : hovered ? '#2a2a2a' : '#191919'}`,
        boxShadow: isPopular
          ? `0 0 ${hovered ? '60px' : '30px'} #f7931a${hovered ? '18' : '0c'}, 0 20px 60px #00000050`
          : `0 ${hovered ? '20px' : '8px'} ${hovered ? '50px' : '24px'} #00000040`,
        transform: inView
          ? (isPopular ? 'translateY(-8px)' : 'translateY(0)')
          : 'translateY(36px)',
        opacity: inView ? 1 : 0,
        transition: [
          `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s`,
          `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 0.1}s`,
          'border-color 0.3s ease',
          'box-shadow 0.3s ease',
        ].join(', '),
      }}
    >
      {/* Popular glow bar */}
      {isPopular && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, #f7931a, transparent)',
        }} />
      )}

      {/* Popular badge */}
      {isPopular && (
        <div style={{
          position: 'absolute', top: 16, right: -28,
          background: 'linear-gradient(135deg, #f7931a, #e8750a)',
          color: '#fff',
          fontFamily: "'Syne', sans-serif",
          fontSize: '0.62rem', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '0.28rem 2.5rem',
          transform: 'rotate(35deg)',
          boxShadow: '0 4px 12px #f7931a40',
        }}>
          Popular
        </div>
      )}

      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>

        {/* Plan name tag */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: isPopular ? '#f7931a' : '#4b5563',
            background: isPopular ? '#f7931a12' : '#ffffff06',
            border: `1px solid ${isPopular ? '#f7931a25' : '#1d1d1d'}`,
            padding: '0.25rem 0.7rem', borderRadius: '999px',
          }}>
            {isPopular && (
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#f7931a',
                boxShadow: '0 0 6px #f7931a',
                flexShrink: 0,
              }} />
            )}
            {plan.name}
          </span>
        </div>

        {/* Price */}
        <div style={{ marginBottom: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2px' }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1rem', fontWeight: 500,
              color: isPopular ? '#f7931a90' : '#4b5563',
              marginTop: '0.45rem',
            }}>$</span>
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2.8rem, 5vw, 3.5rem)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: isPopular ? '#f0f0f0' : '#9ca3af',
            }}>
              {plan.price}
            </span>
          </div>
        </div>

        {/* Duration */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.8rem', color: '#4b5563', fontWeight: 300,
          marginBottom: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: `1px solid ${isPopular ? '#f7931a15' : '#161616'}`,
        }}>
          {plan.duration} Full Access
        </div>

        {/* Per-month indicator */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.73rem', color: '#374151', fontWeight: 400,
          marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" width="12" height="12">
            <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            <path d="M12 6v6l4 2" strokeLinecap="round" />
          </svg>
          One-time payment · No recurring fees
        </div>

        {/* Features */}
        <ul style={{
          listStyle: 'none', padding: 0, margin: 0,
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
          flexGrow: 1, marginBottom: '1.75rem',
        }}>
          {plan.features.map((f) => (
            <FeatureRow key={f} text={f} popular={isPopular} />
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={() => handleBuy(plan)}
          disabled={loading}
          style={{
            width: '100%',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: '0.9rem',
            padding: '0.9rem',
            borderRadius: '12px',
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            opacity: loading ? 0.6 : 1,
            transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
            ...(isPopular ? {
              background: loading ? '#555' : 'linear-gradient(135deg, #f7931a, #e8750a)',
              color: '#fff',
              boxShadow: hovered && !loading ? '0 6px 24px #f7931a50' : '0 2px 12px #f7931a30',
              transform: hovered && !loading ? 'translateY(-1px)' : 'translateY(0)',
            } : {
              background: hovered && !loading ? '#1a1a1a' : '#111',
              color: '#9ca3af',
              border: '1px solid #222',
              boxShadow: 'none',
            }),
          }}
        >
          {loading ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                width="14" height="14" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 11-6.22-8.56" strokeLinecap="round" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              {`Get ${plan.name}`}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                width="14" height="14" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader() {
  const { ref, inView } = useInView(0.2);
  return (
    <div ref={ref} style={{
      textAlign: 'center', marginBottom: '4rem',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.72rem', fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: '#4b5563', marginBottom: '1rem',
      }}>
        <span style={{ display: 'block', width: 24, height: 1, background: '#2d2d2d' }} />
        Pricing
        <span style={{ display: 'block', width: 24, height: 1, background: '#2d2d2d' }} />
      </div>

      <h2 style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        letterSpacing: '-0.04em',
        color: '#f0f0f0',
        lineHeight: 1.05,
        marginBottom: '1rem',
      }}>
        Transparent{' '}
        <span style={{
          background: 'linear-gradient(110deg, #f7931a, #fbbf24)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Pricing.
        </span>
      </h2>

      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '1rem', color: '#4b5563',
        fontWeight: 300, maxWidth: '420px',
        margin: '0 auto', lineHeight: 1.7,
      }}>
        One-time Bitcoin payment. No subscriptions, no middlemen, no surprises.
      </p>

      {/* BTC badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        marginTop: '1.25rem',
        background: '#f7931a0c', border: '1px solid #f7931a20',
        borderRadius: '999px', padding: '0.4rem 1rem',
      }}>
        <svg viewBox="0 0 24 24" fill="#f7931a" width="13" height="13">
          <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
        </svg>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.75rem', color: '#f7931a', fontWeight: 500,
        }}>
          Paid exclusively via Bitcoin
        </span>
      </div>
    </div>
  );
}

// ─── Guarantee bar ────────────────────────────────────────────────────────────
function GuaranteeBar() {
  const { ref, inView } = useInView(0.2);
  const items = [
    { icon: '🔒', label: 'Privacy-first' },
    { icon: '⚡', label: 'Instant activation' },
    { icon: '🌐', label: 'Borderless access' },
    { icon: '🔑', label: 'API key in seconds' },
  ];
  return (
    <div ref={ref} style={{
      marginTop: '3rem',
      display: 'flex', flexWrap: 'wrap',
      justifyContent: 'center', gap: '1rem 2rem',
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
    }}>
      {items.map((item) => (
        <div key={item.label} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.78rem', color: '#4b5563', fontWeight: 400,
        }}>
          <span style={{ fontSize: '0.95rem' }}>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function PricingSection({ handleBuy, loading }: Props) {
  const plans: Plan[] = [
    {
      id: '1_MONTH', name: 'Starter', duration: '1 Month',
      price: process.env.NEXT_PUBLIC_PRICE_1_MONTH || 10,
      features: [
        'Short Articles (Max 800 words)',
        'SD Image Resolution (512×512)',
        'Standard API Queue',
        'Community Support',
      ],
    },
    {
      id: '3_MONTHS', name: 'Pro', duration: '3 Months',
      price: process.env.NEXT_PUBLIC_PRICE_3_MONTHS || 25,
      popular: true,
      features: [
        'SEO Articles up to 2,000 words',
        'HD Image Resolution (1024×1024)',
        'Priority Rendering Queue',
        'Priority Email Support',
      ],
    },
    {
      id: '1_YEAR', name: 'Enterprise', duration: '1 Year',
      price: process.env.NEXT_PUBLIC_PRICE_1_YEAR || 80,
      features: [
        'Pillar Articles up to 4,000 words',
        'Ultra HD Images (1024×1024)',
        'Zero Queue — Instant Rendering',
        'Dedicated VIP 24/7 Support',
      ],
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .ps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          align-items: start;
        }
        @media (max-width: 860px) { .ps-grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; } }
      `}</style>

      <section
        id="pricing"
        style={{
          padding: '6rem 1.5rem',
          background: 'linear-gradient(180deg, #050505 0%, #080808 100%)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%',
          transform: 'translateX(-50%)',
          width: '55vw', height: '350px',
          background: 'radial-gradient(ellipse, #f7931a07 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <SectionHeader />
          <div className="ps-grid">
            {plans.map((plan, i) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                index={i}
                handleBuy={handleBuy}
                loading={loading}
              />
            ))}
          </div>
          <GuaranteeBar />
        </div>
      </section>
    </>
  );
}