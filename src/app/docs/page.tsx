'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
type DocSectionProps = { title: string; children: React.ReactNode; id?: string; tag?: string };
type ParamRowProps   = { name: string; type: string; req: boolean; desc: React.ReactNode };
type CodeBlockProps  = { code: string; language?: string; fileName?: string };

// ─── Static data ──────────────────────────────────────────────────────────────
const SCRIPT_TEMPLATE = `// ─────────────────────────────────────────────────────────
// FOSHT AI — Automated Integration Script (Node.js)
// ─────────────────────────────────────────────────────────

async function generateBlogArticle() {
  const API_KEY = "ENTER_YOUR_FOSHT_API_KEY_HERE";

  const payload = {
    topic: "How to Beat the Google Algorithm in 2026",
    keywords: "SEO, Google Algorithm, FOSHT AI",

    // clientCustomPrompt: "Write in a casual tone for Gen Z audiences.",
    // clientCustomCss: "h1 { color: #f97316; font-family: 'Inter', sans-serif; }"
  };

  try {
    console.log("Connecting to FOSHT AI Engine...");

    const response = await fetch("https://fosht-ai.vercel.app/api/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${API_KEY}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {
      console.log("✅ Article generated successfully!");
      console.log("License Plan  :", result.data.plan);
      console.log("Thumbnail URL :", result.data.featuredImage);
      console.log("HTML Preview  :", result.data.contentHtml.substring(0, 120) + "...");
    } else {
      console.error("❌ Generation failed:", result.error);
    }
  } catch (error) {
    console.error("⚠️ Network error:", error);
  }
}

generateBlogArticle();`;

const RESPONSE_TEMPLATE = `{
  "success": true,
  "data": {
    "plan": "API Key Pro — 1 Month",
    "featuredImage": "https://image.pollinations.ai/prompt/high%20resolution...",
    "contentHtml": "<style>h1 { color: #f97316; }</style>\\n<div class='fosht-article'>\\n  <h1>How to Beat the Google Algorithm...</h1>\\n  <p>...</p>\\n</div>"
  }
}`;

const AUTH_HEADER = `Authorization: Bearer <YOUR_API_KEY>`;

const ENDPOINT_URL = `POST  https://fosht-ai.vercel.app/api/v1/generate`;

// ─── Intersection-observer hook ───────────────────────────────────────────────
function useInView() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

// ─── Code block ───────────────────────────────────────────────────────────────
function CodeBlock({ code, language = 'json', fileName = 'Terminal' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      borderRadius: '16px', overflow: 'hidden',
      border: '1px solid #1d1d1d',
      boxShadow: '0 8px 32px #00000040',
      margin: '1.25rem 0',
    }}>
      {/* Window bar */}
      <div style={{
        background: '#111', padding: '0.65rem 1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #181818',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.85 }} />
            ))}
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#4b5563' }}>
            {fileName}
          </span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.72rem', fontWeight: 600,
            padding: '0.28rem 0.7rem', borderRadius: '7px',
            background: copied ? '#22c55e18' : '#ffffff0a',
            border: `1px solid ${copied ? '#22c55e30' : '#1f1f1f'}`,
            color: copied ? '#4ade80' : '#9ca3af',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      {/* Code */}
      <pre style={{
        background: '#070707', padding: '1.25rem 1.5rem',
        overflowX: 'auto', margin: 0,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.8rem', color: '#d1d5db',
        lineHeight: 1.8,
      }}>
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

// ─── Inline code chip ─────────────────────────────────────────────────────────
function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.8em', color: '#f7931a',
      background: '#f7931a10', border: '1px solid #f7931a20',
      padding: '0.1em 0.4em', borderRadius: '5px',
    }}>
      {children}
    </code>
  );
}

// ─── Doc section card ─────────────────────────────────────────────────────────
function DocSection({ title, children, id, tag }: DocSectionProps) {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      id={id}
      style={{
        background: 'linear-gradient(145deg, #0f0f0f, #0a0a0a)',
        border: '1px solid #191919',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '1.25rem',
        position: 'relative', overflow: 'hidden',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1), border-color 0.3s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#f7931a20')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#191919')}
    >
      {/* Top glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, #f7931a20, transparent)',
        pointerEvents: 'none',
      }} />

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #141414' }}>
        {tag && (
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#f7931a',
            background: '#f7931a12', border: '1px solid #f7931a25',
            padding: '0.22rem 0.65rem', borderRadius: '999px',
          }}>
            {tag}
          </span>
        )}
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700, fontSize: '1.1rem',
          letterSpacing: '-0.02em', color: '#f0f0f0', margin: 0,
        }}>
          {title}
        </h2>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </section>
  );
}

// ─── Param table row ──────────────────────────────────────────────────────────
function ParamRow({ name, type, req, desc }: ParamRowProps) {
  return (
    <tr style={{ borderBottom: '1px solid #111', transition: 'background 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#ffffff04')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <td style={{ padding: '1rem 1.25rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#f7931a', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
        {name}
      </td>
      <td style={{ padding: '1rem 1.25rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#6b7280', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
        {type}
      </td>
      <td style={{ padding: '1rem 1.25rem', verticalAlign: 'top' }}>
        {req ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem', fontWeight: 700,
            color: '#f87171', background: '#ef444412',
            border: '1px solid #ef444425',
            padding: '0.2rem 0.6rem', borderRadius: '999px',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }} />
            Required
          </span>
        ) : (
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem', color: '#4b5563',
            background: '#1a1a1a', border: '1px solid #222',
            padding: '0.2rem 0.6rem', borderRadius: '999px',
          }}>
            Optional
          </span>
        )}
      </td>
      <td style={{ padding: '1rem 1.25rem', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.7, verticalAlign: 'top' }}>
        {desc}
      </td>
    </tr>
  );
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────
const navItems = [
  { href: '#intro',    label: 'Introduction' },
  { href: '#auth',     label: '1. Authentication' },
  { href: '#endpoint', label: '2. Endpoint & Payload' },
  { href: '#response', label: '3. Response Format' },
  { href: '#errors',   label: '4. Error Codes' },
  { href: '#limits',   label: '5. Rate Limits' },
  { href: '#snippet',  label: 'Code Snippet', highlight: true },
];

function Sidebar({ activeSection }: { activeSection: string }) {
  return (
    <aside style={{ position: 'sticky', top: '6rem' }}>
      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '0.65rem', fontWeight: 700,
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: '#4b5563', marginBottom: '1.25rem',
      }}>
        Table of Contents
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: '1px solid #1a1a1a', paddingLeft: '1rem' }}>
        {navItems.map((item) => {
          const isActive = activeSection === item.href.slice(1);
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'block',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.82rem', fontWeight: item.highlight ? 600 : 400,
                color: isActive ? '#f7931a' : item.highlight ? '#9ca3af' : '#4b5563',
                textDecoration: 'none',
                padding: '0.3rem 0',
                borderLeft: isActive ? '2px solid #f7931a' : '2px solid transparent',
                marginLeft: '-1.0625rem',
                paddingLeft: isActive ? '0.9rem' : '0.875rem',
                transition: 'color 0.2s, padding-left 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#9ca3af'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = item.highlight ? '#9ca3af' : '#4b5563'; }}
            >
              {item.label}
            </a>
          );
        })}
      </div>

      {/* Quick-access box */}
      <div style={{
        marginTop: '2rem',
        background: '#0d0d0d', border: '1px solid #1a1a1a',
        borderRadius: '14px', padding: '1rem',
      }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#4b5563', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>
          Need your API key?
        </p>
        <Link href="/dashboard" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.78rem', fontWeight: 600,
          padding: '0.55rem', borderRadius: '9px',
          background: '#f7931a15', border: '1px solid #f7931a25',
          color: '#f7931a', textDecoration: 'none',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f7931a22')}
          onMouseLeave={e => (e.currentTarget.style.background = '#f7931a15')}
        >
          Open Dashboard →
        </Link>
      </div>
    </aside>
  );
}

// ─── Main docs page ───────────────────────────────────────────────────────────
export default function DocsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  // Track scroll position for sidebar highlight
  useEffect(() => {
    const sections = navItems.map(n => n.href.slice(1));
    const onScroll = () => {
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) { setActiveSection(sections[i]); break; }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .docs-root {
          min-height: 100vh;
          background: #080808;
          color: #d1d5db;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }
        .docs-root ::selection { background: #f7931a; color: #fff; }

        .docs-reveal {
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .docs-reveal.show { opacity: 1; transform: translateY(0); }

        .docs-grid {
          display: grid;
          grid-template-columns: 200px minmax(0, 1fr);
          gap: 3rem;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.5rem 6rem;
        }
        .docs-grid > main { min-width: 0; overflow-x: hidden; }
        @media (max-width: 900px) { .docs-grid { grid-template-columns: minmax(0, 1fr); } .docs-sidebar { display: none; } }

        .docs-error-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }
        @media (max-width: 640px) { .docs-error-grid { grid-template-columns: 1fr; } }

        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 #ef444460; }
          50%      { box-shadow: 0 0 0 3px transparent; }
        }
      `}</style>

      <div className="docs-root">
        {/* Ambient orbs */}
        <div style={{ position: 'fixed', top: '-10vh', left: '-10vw', width: '40vw', height: '40vh', background: 'radial-gradient(ellipse, #f7931a08 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '-10vh', right: '-10vw', width: '35vw', height: '35vh', background: 'radial-gradient(ellipse, #f7931a05 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, paddingTop: '3rem' }}>
          <div className="docs-grid">

            {/* Sidebar */}
            <div className="docs-sidebar">
              <Sidebar activeSection={activeSection} />
            </div>

            {/* Content */}
            <main>

              {/* ── Hero header */}
              <div
                id="intro"
                className={`docs-reveal ${mounted ? 'show' : ''}`}
                style={{ marginBottom: '3rem', paddingBottom: '2.5rem', borderBottom: '1px solid #141414' }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.7rem', fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: '#f7931a', background: '#f7931a10',
                  border: '1px solid #f7931a25',
                  padding: '0.3rem 0.8rem', borderRadius: '999px',
                  marginBottom: '1.5rem',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f7931a', animation: 'pulse 2s infinite', flexShrink: 0 }} />
                  V1 API Engine
                </div>

                <h1 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                  letterSpacing: '-0.04em',
                  color: '#f0f0f0',
                  lineHeight: 1.05,
                  marginBottom: '1rem',
                  wordBreak: 'break-word',
                }}>
                  Developer{' '}
                  <span style={{
                    background: 'linear-gradient(110deg, #f7931a, #fbbf24)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Documentation.
                  </span>
                </h1>

                <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.75, fontWeight: 300, maxWidth: '580px' }}>
                  Complete integration guide for the <strong style={{ color: '#9ca3af', fontWeight: 500 }}>FOSHT AI Headless Engine</strong>.
                  Inject automated SEO articles and high-resolution imagery directly into any application via a single API call.
                </p>
              </div>

              {/* ── Auth */}
              <DocSection id="auth" title="Authentication" tag="Step 1">
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.75, marginBottom: '1.25rem', fontWeight: 300 }}>
                  FOSHT AI uses standard <strong style={{ color: '#9ca3af', fontWeight: 500 }}>Bearer Token</strong> authentication.
                  Include your API Key in every request header, obtained from your Dashboard.
                </p>
                <div style={{
                  background: '#070707', border: '1px solid #1d1d1d',
                  borderRadius: '12px', padding: '1rem 1.25rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  overflowX: 'auto',
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#4b5563', flexShrink: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Header
                  </span>
                  <div style={{ width: 1, height: 18, background: '#222', flexShrink: 0 }} />
                  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', color: '#f7931a', whiteSpace: 'nowrap' }}>
                    {AUTH_HEADER}
                  </code>
                </div>
              </DocSection>

              {/* ── Endpoint */}
              <DocSection id="endpoint" title="Endpoint & Payload" tag="Step 2">
                <div style={{
                  background: '#070707', border: '1px solid #1d1d1d',
                  borderRadius: '12px', padding: '0.9rem 1.25rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  marginBottom: '1.25rem', overflowX: 'auto',
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.75rem', fontWeight: 700,
                    color: '#4ade80', background: '#22c55e12',
                    border: '1px solid #22c55e25',
                    padding: '0.25rem 0.65rem', borderRadius: '7px',
                    flexShrink: 0,
                  }}>
                    POST
                  </span>
                  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', color: '#e5e7eb', whiteSpace: 'nowrap' }}>
                    https://fosht-ai.vercel.app/api/v1/generate
                  </code>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.75, marginBottom: '1.25rem', fontWeight: 300 }}>
                  Submit configuration as JSON. The following parameters are supported:
                </p>

                <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #141414' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                    <thead>
                      <tr style={{ background: '#0d0d0d', borderBottom: '1px solid #181818' }}>
                        {['Parameter', 'Type', 'Status', 'Description'].map(h => (
                          <th key={h} style={{ padding: '0.85rem 1.25rem', fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4b5563', textAlign: 'left' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <ParamRow name="topic" type="string" req={true} desc="Main topic or title for the AI-generated article — e.g., 'Digital Marketing in 2026'." />
                      <ParamRow name="keywords" type="string" req={false} desc="Comma-separated LSI/SEO keywords to embed naturally throughout the article body." />
                      <ParamRow name="clientCustomPrompt" type="string" req={false} desc={<><strong style={{ color: '#d1d5db' }}>Headless mode.</strong> Overrides the default AI persona — useful for dynamically changing tone per request.</>} />
                      <ParamRow name="clientCustomCss" type="string" req={false} desc={<><strong style={{ color: '#d1d5db' }}>Headless mode.</strong> Inject custom CSS directly into the generated HTML output.</>} />
                    </tbody>
                  </table>
                </div>
              </DocSection>

              {/* ── Response */}
              <DocSection id="response" title="Response Format" tag="Step 3">
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.75, marginBottom: '0.25rem', fontWeight: 300 }}>
                  All responses are JSON. The article is wrapped in a <InlineCode>fosht-article</InlineCode> div class, with any custom CSS injected inline.
                </p>
                <CodeBlock code={RESPONSE_TEMPLATE} fileName="response.json" />
              </DocSection>

              {/* ── Errors + Limits side by side */}
              <div className="docs-error-grid">
                <DocSection id="errors" title="Error Codes" tag="Reference">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[
                      { code: '400', label: 'Bad Request',     color: '#f87171', bg: '#ef444412', border: '#ef444425', desc: 'Missing required params or invalid JSON body.' },
                      { code: '401', label: 'Unauthorized',    color: '#fb923c', bg: '#f7931a12', border: '#f7931a25', desc: 'API Key invalid or subscription expired.' },
                      { code: '500', label: 'Server Error',    color: '#9ca3af', bg: '#ffffff08', border: '#1f1f1f',   desc: 'AI Engine under high load. Retry in seconds.' },
                    ].map((e) => (
                      <div key={e.code} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: '#0a0a0a', border: '1px solid #141414', borderRadius: '12px', padding: '0.85rem' }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', fontWeight: 700, color: e.color, background: e.bg, border: `1px solid ${e.border}`, padding: '0.2rem 0.55rem', borderRadius: '7px', flexShrink: 0 }}>
                          {e.code}
                        </span>
                        <div>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb', marginBottom: '2px' }}>{e.label}</p>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.77rem', color: '#6b7280', lineHeight: 1.5 }}>{e.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DocSection>

                <DocSection id="limits" title="Rate Limits" tag="Quota">
                  <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '1.25rem', fontWeight: 300 }}>
                    Rate throttling is enforced per IP to protect the FOSHT Load Balancer.
                  </p>
                  <div style={{ background: '#0a0a0a', border: '1px solid #f7931a20', borderRadius: '14px', padding: '1.25rem', textAlign: 'center', marginBottom: '1rem' }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Standard Node</p>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', fontWeight: 500, color: '#f7931a' }}>
                      10 req / min / IP
                    </p>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#374151', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.6 }}>
                    Article word limits are set automatically based on your active license plan.
                  </p>
                </DocSection>
              </div>

              {/* ── Code snippet */}
              <DocSection id="snippet" title="Integration Snippet" tag="Quick Start">
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.75, marginBottom: '0.25rem', fontWeight: 300 }}>
                  Copy the script below directly into your backend (Next.js, Express, Bun, etc). Replace <InlineCode>ENTER_YOUR_FOSHT_API_KEY_HERE</InlineCode> with your key.
                </p>
                <CodeBlock code={SCRIPT_TEMPLATE} language="javascript" fileName="generate.js" />
              </DocSection>

              {/* ── Footer CTA */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid #141414' }}>
                <Link
                  href="/dashboard"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600, fontSize: '0.875rem',
                    padding: '0.75rem 1.75rem', borderRadius: '999px',
                    background: 'transparent', border: '1px solid #222',
                    color: '#9ca3af', textDecoration: 'none',
                    transition: 'border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#f7931a30'; e.currentTarget.style.color = '#f7931a'; e.currentTarget.style.background = '#f7931a08'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                  Return to Dashboard
                </Link>
              </div>

            </main>
          </div>
        </div>
      </div>
    </>
  );
}