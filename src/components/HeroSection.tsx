'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// ── Animated counter for the stats row
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 60);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(start);
    }, 18);
    return () => clearInterval(t);
  }, [to]);
  return <>{val.toLocaleString()}{suffix}</>;
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { value: 12000, suffix: '+', label: 'Blogs generated' },
    { value: 98,    suffix: '%', label: 'SEO score avg.'  },
    { value: 3,     suffix: 's', label: 'Per article'     },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* ── Stagger reveal */
        .hr-item {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1),
                      transform 0.65s cubic-bezier(0.22,1,0.36,1);
        }
        .hr-item.show { opacity: 1; transform: translateY(0); }
        .hr-item.d1 { transition-delay: 0.05s; }
        .hr-item.d2 { transition-delay: 0.15s; }
        .hr-item.d3 { transition-delay: 0.25s; }
        .hr-item.d4 { transition-delay: 0.38s; }
        .hr-item.d5 { transition-delay: 0.50s; }

        /* ── Badge */
        .hr-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          border: 1px solid #f7931a30;
          background: linear-gradient(135deg, #f7931a12, #f7931a06);
          color: #f7931a;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 999px;
          backdrop-filter: blur(4px);
        }
        .hr-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #f7931a;
          animation: blink 1.8s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes blink {
          0%,100% { opacity: 1; box-shadow: 0 0 0 0 #f7931a60; }
          50%      { opacity: 0.5; box-shadow: 0 0 0 4px transparent; }
        }

        /* ── Headline */
        .hr-h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          line-height: 1.02;
          letter-spacing: -0.04em;
          color: #f0f0f0;
        }
        .hr-gradient {
          background: linear-gradient(110deg, #f7931a 20%, #fbbf24 55%, #f7931a 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer {
          from { background-position: 200% center; }
          to   { background-position:   0% center; }
        }

        /* ── Sub */
        .hr-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          color: #6b7280;
          line-height: 1.7;
          letter-spacing: 0.01em;
        }

        /* ── Buttons */
        .hr-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.9rem 2rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #f7931a, #e8750a);
          color: #fff;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.22s, box-shadow 0.22s;
          box-shadow: 0 0 0 0 #f7931a00;
          letter-spacing: 0.01em;
        }
        .hr-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #ffffff22, transparent 60%);
          opacity: 0;
          transition: opacity 0.22s;
        }
        .hr-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px #f7931a50;
        }
        .hr-btn-primary:hover::before { opacity: 1; }
        .hr-btn-primary:active { transform: translateY(-1px); }

        .hr-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.9rem 2rem;
          border-radius: 999px;
          background: transparent;
          color: #9ca3af;
          text-decoration: none;
          border: 1px solid #222;
          transition: transform 0.22s, border-color 0.22s, color 0.22s, background 0.22s;
          letter-spacing: 0.01em;
        }
        .hr-btn-secondary:hover {
          transform: translateY(-3px);
          border-color: #3d3d3d;
          color: #e5e7eb;
          background: #111;
        }

        /* ── Divider */
        .hr-divider {
          width: 1px;
          height: 36px;
          background: #1d1d1d;
          flex-shrink: 0;
        }

        /* ── Stats */
        .hr-stat-val {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.6rem;
          color: #f0f0f0;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .hr-stat-val .hi { color: #f7931a; }
        .hr-stat-lbl {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          color: #4b5563;
          font-weight: 400;
          letter-spacing: 0.04em;
          margin-top: 4px;
          text-transform: uppercase;
        }

        /* ── Grid visual */
        .hr-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(247,147,26,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(247,147,26,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%);
          pointer-events: none;
        }

        /* ── Glow orbs */
        .hr-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .hr-orb-l {
          width: 500px; height: 400px;
          top: -120px; left: -100px;
          background: radial-gradient(circle, #f7931a0d 0%, transparent 70%);
        }
        .hr-orb-r {
          width: 400px; height: 350px;
          top: -80px; right: -80px;
          background: radial-gradient(circle, #fbbf240a 0%, transparent 70%);
        }
        .hr-orb-c {
          width: 600px; height: 300px;
          bottom: -50px; left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(circle, #f7931a06 0%, transparent 70%);
        }

        /* ── Floating particles */
        .hr-particle {
          position: absolute;
          width: 2px; height: 2px;
          border-radius: 50%;
          background: #f7931a;
          opacity: 0;
          animation: float var(--dur) ease-in-out var(--delay) infinite;
          pointer-events: none;
        }
        @keyframes float {
          0%   { opacity: 0; transform: translateY(0) scale(1); }
          20%  { opacity: 0.6; }
          80%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-80px) scale(0.4); }
        }

        /* ── Scroll hint */
        .hr-scroll {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          opacity: 0;
          animation: fadeIn 0.5s ease 1.2s forwards;
          margin-top: 1rem;
        }
        .hr-scroll-line {
          width: 1px;
          height: 36px;
          background: linear-gradient(180deg, #f7931a50, transparent);
          animation: scrollDrop 1.8s ease-in-out infinite;
        }
        @keyframes scrollDrop {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 0; }
          40%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          60%  { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }
        @keyframes fadeIn { to { opacity: 1; } }

        @media (max-width: 640px) {
          .hr-stats-row { flex-direction: column; gap: 1.5rem !important; align-items: center; }
          .hr-divider { display: none; }
          .hr-btns { flex-direction: column; align-items: center; }
        }
      `}</style>

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '100%',
          padding: '6rem 1.5rem 5rem',
          textAlign: 'center',
        }}
      >
        {/* Background effects */}
        <div className="hr-grid-bg" />
        <div className="hr-orb hr-orb-l" />
        <div className="hr-orb hr-orb-r" />
        <div className="hr-orb hr-orb-c" />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="hr-particle"
            style={{
              left: `${8 + i * 8}%`,
              bottom: `${15 + (i % 4) * 12}%`,
              '--dur':   `${3 + (i % 3)}s`,
              '--delay': `${i * 0.4}s`,
            } as React.CSSProperties}
          />
        ))}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>

          {/* Badge */}
          <div className={`hr-item d1 ${mounted ? 'show' : ''}`} style={{ marginBottom: '1.75rem' }}>
            <span className="hr-badge">
              <span className="hr-badge-dot" />
              FOSHT Agent AI — Now Live
            </span>
          </div>

          {/* Headline */}
          <div className={`hr-item d2 ${mounted ? 'show' : ''}`} style={{ marginBottom: '1.5rem' }}>
            <h1
              className="hr-h1"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)' }}
            >
              Build Thousands of Blogs
              <br />
              With Just{' '}
              <span className="hr-gradient">One API.</span>
            </h1>
          </div>

          {/* Subheading */}
          <div className={`hr-item d3 ${mounted ? 'show' : ''}`} style={{ marginBottom: '2.5rem' }}>
            <p
              className="hr-sub"
              style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', maxWidth: '620px', margin: '0 auto' }}
            >
              The FOSHT Proprietary AI Engine researches, writes, and generates
              SEO-optimized images automatically — turning a single API call into
              a full content pipeline.
            </p>
          </div>

          {/* Buttons */}
          <div
            className={`hr-item d4 hr-btns ${mounted ? 'show' : ''}`}
            style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}
          >
            <Link href="#pricing" className="hr-btn-primary">
              Start Automating
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/docs" className="hr-btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Read the Docs
            </Link>
          </div>

          {/* Stats row */}
          <div
            className={`hr-item d5 hr-stats-row ${mounted ? 'show' : ''}`}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2.5rem' }}
          >
            {stats.map((s, i) => (
              <React.Fragment key={s.label}>
                <div style={{ textAlign: 'center' }}>
                  <div className="hr-stat-val">
                    {mounted ? <Counter to={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
                  </div>
                  <div className="hr-stat-lbl">{s.label}</div>
                </div>
                {i < stats.length - 1 && <div className="hr-divider" />}
              </React.Fragment>
            ))}
          </div>

          {/* Scroll hint */}
          <div className="hr-scroll">
            <div className="hr-scroll-line" />
          </div>

        </div>
      </section>
    </>
  );
}