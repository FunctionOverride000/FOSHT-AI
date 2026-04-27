'use client';
import { useEffect, useRef, useState } from 'react';

const features = [
  {
    id: 'seo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
        <path d="M12 20h9" strokeLinecap="round" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    tag: 'Content Engine',
    title: 'SEO Native Writer',
    desc: 'Our AI Agent is constrained to comply with the latest SEO guidelines. H2 and H3 structures, keyword density, and meta signals are automatically optimized for every article.',
    bullets: ['Automatic heading structure', 'Keyword density control', 'Meta description generation'],
    accent: '#f7931a',
  },
  {
    id: 'image',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    tag: 'Visual Pipeline',
    title: 'Auto Image Generation',
    desc: 'A single API call returns the complete package — high-quality articles alongside relevant, copyright-free exclusive imagery generated and embedded automatically.',
    bullets: ['Exclusive AI-generated visuals', 'Auto alt-text for accessibility', 'Copyright-free, zero licensing fees'],
    accent: '#fb923c',
  },
  {
    id: 'billing',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="26" height="26">
        <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002z" />
        <path d="M15.5 8.5c-.4-1.2-1.5-1.5-2.5-1.5s-2.5.5-2.5 2 1 1.8 2.5 2 2.5.8 2.5 2-1 2-2.5 2-2.2-.4-2.5-1.5M12 6v1.5M12 16.5V18" strokeLinecap="round" />
      </svg>
    ),
    tag: 'Peer-to-Peer',
    title: 'Decentralized Billing',
    desc: 'API license payments are 100% processed via the Bitcoin network — no intermediaries, no third-party cuts. Maximum privacy, instant settlement, borderless by design.',
    bullets: ['Bitcoin-native payments', 'Zero third-party processors', 'Borderless & permissionless'],
    accent: '#fbbf24',
  },
];

// ── Intersection-observer hook
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Single feature card
function FeatureCard({ feat, index }: { feat: typeof features[0]; index: number }) {
  const { ref, inView } = useInView(0.15);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s,
                     transform 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 0.12}s`,
        background: hovered
          ? 'linear-gradient(145deg, #141414, #111)'
          : 'linear-gradient(145deg, #0f0f0f, #0a0a0a)',
        border: `1px solid ${hovered ? feat.accent + '28' : '#191919'}`,
        borderRadius: '20px',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition2: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? `0 0 40px ${feat.accent}10, 0 20px 60px #00000040` : '0 4px 24px #00000030',
      } as React.CSSProperties}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${feat.accent}${hovered ? '80' : '30'}, transparent)`,
        transition: 'background 0.4s',
      }} />

      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '120px', height: '120px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${feat.accent}${hovered ? '12' : '06'} 0%, transparent 70%)`,
        transition: 'background 0.4s',
        pointerEvents: 'none',
      }} />

      {/* Tag */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.68rem', fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: feat.accent,
        background: `${feat.accent}12`,
        border: `1px solid ${feat.accent}25`,
        padding: '0.25rem 0.7rem',
        borderRadius: '999px',
        marginBottom: '1.25rem',
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: feat.accent, flexShrink: 0,
          boxShadow: `0 0 6px ${feat.accent}`,
        }} />
        {feat.tag}
      </div>

      {/* Icon */}
      <div style={{
        width: '52px', height: '52px',
        borderRadius: '14px',
        background: `linear-gradient(135deg, ${feat.accent}18, ${feat.accent}08)`,
        border: `1px solid ${feat.accent}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: feat.accent,
        marginBottom: '1.25rem',
        transition: 'transform 0.3s, box-shadow 0.3s',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        boxShadow: hovered ? `0 0 20px ${feat.accent}30` : 'none',
      }}>
        {feat.icon}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: '1.25rem',
        letterSpacing: '-0.02em',
        color: '#f0f0f0',
        marginBottom: '0.65rem',
        lineHeight: 1.2,
      }}>
        {feat.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.875rem',
        color: '#6b7280',
        lineHeight: 1.75,
        fontWeight: 300,
        marginBottom: '1.5rem',
      }}>
        {feat.desc}
      </p>

      {/* Divider */}
      <div style={{ height: '1px', background: '#181818', marginBottom: '1.25rem' }} />

      {/* Bullet list */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {feat.bullets.map((b) => (
          <li key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              width: 16, height: 16, borderRadius: '50%',
              background: `${feat.accent}15`,
              border: `1px solid ${feat.accent}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke={feat.accent} strokeWidth="2.5" width="9" height="9">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.8rem', color: '#9ca3af', fontWeight: 400,
            }}>
              {b}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Section header
function SectionHeader() {
  const { ref, inView } = useInView(0.2);
  return (
    <div
      ref={ref}
      style={{
        textAlign: 'center', marginBottom: '3.5rem',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.72rem', fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: '#4b5563', marginBottom: '1rem',
      }}>
        <span style={{ display: 'block', width: 24, height: 1, background: '#2d2d2d' }} />
        What&apos;s inside
        <span style={{ display: 'block', width: 24, height: 1, background: '#2d2d2d' }} />
      </div>
      <h2 style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
        letterSpacing: '-0.04em',
        color: '#f0f0f0',
        lineHeight: 1.1,
        marginBottom: '0.75rem',
      }}>
        Everything you need to{' '}
        <span style={{
          background: 'linear-gradient(110deg, #f7931a, #fbbf24)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          scale content.
        </span>
      </h2>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.95rem', color: '#4b5563',
        fontWeight: 300, maxWidth: '480px', margin: '0 auto',
        lineHeight: 1.7,
      }}>
        One API. Three core engines. Infinite content at the speed of your ambition.
      </p>
    </div>
  );
}

export default function FeatureSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .fs-root { position: relative; overflow: hidden; }
        .fs-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #f7931a20 40%, #f7931a40 50%, #f7931a20 60%, transparent);
        }
        .fs-root::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #1d1d1d 30%, #1d1d1d 70%, transparent);
        }
        .fs-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 900px) { .fs-card-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 580px) { .fs-card-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section
        className="fs-root"
        style={{ background: 'linear-gradient(180deg, #080808 0%, #050505 100%)', padding: '6rem 1.5rem' }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translateX(-50%)',
          width: '60vw', height: '300px',
          background: 'radial-gradient(ellipse, #f7931a06 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <SectionHeader />
          <div className="fs-card-grid">
            {features.map((feat, i) => (
              <FeatureCard key={feat.id} feat={feat} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}