'use client';
import { useState } from 'react';

type AgentProfile = {
  id: string;
  systemPrompt?: string;
  blogCss?: string;
  [key: string]: unknown;
};

// ─── Toast notification ───────────────────────────────────────────────────────
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
      maxWidth: 340,
    }}>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(12px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
      <div style={{ width: 32, height: 32, borderRadius: '9px', flexShrink: 0, background: type === 'success' ? '#22c55e15' : '#ef444415', border: `1px solid ${type === 'success' ? '#22c55e25' : '#ef444425'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {type === 'success'
          ? <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" width="14" height="14" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" width="14" height="14" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        }
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#e5e7eb', lineHeight: 1.5, flex: 1 }}>{message}</p>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: '2px', lineHeight: 0 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function FieldLabel({ children, tag }: { children: React.ReactNode; tag?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
      {tag && (
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f7931a', background: '#f7931a12', border: '1px solid #f7931a25', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
          {tag}
        </span>
      )}
      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4b5563' }}>
        {children}
      </label>
    </div>
  );
}

export default function AgentSettings({ profile }: { profile: AgentProfile }) {
  const defaultPrompt = 'You are an expert Tech Journalist. Write highly engaging, factual, and professional SEO content.';
  const defaultCss    = 'h1 { color: #f97316; font-size: 2.2em; font-weight: 900; margin-bottom: 0.5em; }\nh2 { color: #ffffff; font-size: 1.5em; margin-top: 1.5em; border-bottom: 2px solid #f97316; padding-bottom: 0.2em; }\np { color: #d1d5db; line-height: 1.8; margin-bottom: 1em; }\nul { color: #d1d5db; margin-left: 1.5em; list-style-type: disc; }';

  const [prompt,       setPrompt]       = useState(profile?.systemPrompt || defaultPrompt);
  const [cssCode,      setCssCode]      = useState(profile?.blogCss      || defaultCss);
  const [saving,       setSaving]       = useState(false);
  const [previewTopic, setPreviewTopic] = useState('How AI is Changing SEO in 2026');
  const [previewHtml,  setPreviewHtml]  = useState('');
  const [generating,   setGenerating]   = useState(false);
  const [toast,        setToast]        = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab,    setActiveTab]    = useState<'prompt' | 'css'>('prompt');

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res  = await fetch('/api/profile/update-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id, systemPrompt: prompt, blogCss: cssCode }),
      });
      const data = await res.json();
      if (data.success) showToast('success', 'AI Agent configuration saved to database.');
      else showToast('error', 'Failed to save configuration.');
    } catch (_) { showToast('error', 'Network error. Please try again.'); }
    setSaving(false);
  };

  const handleTestPreview = async () => {
    setGenerating(true);
    setPreviewHtml('');
    try {
      const res  = await fetch('/api/profile/test-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt: prompt, testTopic: previewTopic }),
      });
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data.success) setPreviewHtml(data.html);
        else setPreviewHtml(`<p style="color:#f87171;font-family:sans-serif">API Error: ${data.error}</p>`);
      } catch (_) {
        setPreviewHtml(`<p style="color:#f87171;font-family:sans-serif">Server error (${res.status}). Check terminal.</p>`);
      }
    } catch (_) {
      setPreviewHtml('<p style="color:#f87171;font-family:sans-serif">Network connection lost.</p>');
    }
    setGenerating(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .as-root { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        @media (max-width: 900px) { .as-root { grid-template-columns: 1fr; } }

        .as-panel {
          background: linear-gradient(145deg, #111, #0d0d0d);
          border: 1px solid #1d1d1d;
          border-radius: '20px';
          overflow: hidden;
        }

        .as-textarea {
          width: 100%; box-sizing: border-box;
          background: #080808;
          border: 1px solid #1d1d1d;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem; line-height: 1.75;
          color: #d1d5db;
          outline: none; resize: vertical;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .as-textarea:focus {
          border-color: #f7931a50;
          box-shadow: 0 0 0 3px #f7931a0c;
        }
        .as-textarea.css-mode { color: #86efac; }

        .as-input {
          width: 100%; box-sizing: border-box;
          background: #080808;
          border: 1px solid #1d1d1d;
          border-radius: 10px;
          padding: 0.7rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; color: #e5e7eb;
          outline: none;
          transition: border-color 0.2s;
        }
        .as-input:focus { border-color: #f7931a50; }
        .as-input::placeholder { color: '#374151'; }

        .as-tab {
          padding: 0.5rem 0.9rem;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem; font-weight: 600;
          cursor: pointer; border: none;
          transition: background 0.15s, color 0.15s;
        }
        .as-tab.active { background: #f7931a18; color: #f7931a; box-shadow: inset 0 0 0 1px #f7931a30; }
        .as-tab.inactive { background: transparent; color: #4b5563; }
        .as-tab.inactive:hover { background: #111; color: #9ca3af; }

        /* Preview dots bounce */
        .as-dot { width: 7px; height: 7px; border-radius: 50%; background: #f7931a; opacity: 0.3; animation: dotB 1.4s ease-in-out infinite; }
        .as-dot:nth-child(2) { animation-delay: 0.2s; }
        .as-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dotB { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1.2)} }

        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 #f7931a50} 50%{box-shadow:0 0 0 4px transparent} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      `}</style>

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="as-root">

        {/* ── Left panel: config */}
        <div style={{ background: 'linear-gradient(145deg, #111, #0d0d0d)', border: '1px solid #1d1d1d', borderRadius: '20px', overflow: 'hidden' }}>
          {/* Top accent */}
          <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #f7931a40, transparent)' }} />

          <div style={{ padding: '1.5rem' }}>
            {/* Panel header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid #141414' }}>
              <div style={{ width: 34, height: 34, borderRadius: '9px', background: '#f7931a12', border: '1px solid #f7931a25', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#f7931a" strokeWidth="1.8" width="16" height="16" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
                </svg>
              </div>
              <div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#f0f0f0', letterSpacing: '-0.02em' }}>
                  Agent Configuration
                </h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#4b5563', fontWeight: 300 }}>
                  Persona, tone, and styling
                </p>
              </div>
            </div>

            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: '0.3rem', padding: '0.35rem', background: '#0a0a0a', border: '1px solid #141414', borderRadius: '11px', marginBottom: '1.25rem', width: 'fit-content' }}>
              <button className={`as-tab ${activeTab === 'prompt' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('prompt')}>
                AI Persona
              </button>
              <button className={`as-tab ${activeTab === 'css' ? 'active' : 'inactive'}`} onClick={() => setActiveTab('css')}>
                HTML / CSS
              </button>
            </div>

            {activeTab === 'prompt' && (
              <div style={{ animation: 'fadeIn 0.25s ease' }}>
                <FieldLabel tag="Prompt">System Prompt</FieldLabel>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#4b5563', marginBottom: '0.65rem', lineHeight: 1.6, fontWeight: 300 }}>
                  Define your AI agent&apos;s persona, writing style, and tone. This is injected as the system prompt on every generation request.
                </p>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  rows={7}
                  className="as-textarea"
                  spellCheck={false}
                />
              </div>
            )}

            {activeTab === 'css' && (
              <div style={{ animation: 'fadeIn 0.25s ease' }}>
                <FieldLabel tag="Style">Custom CSS</FieldLabel>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#4b5563', marginBottom: '0.65rem', lineHeight: 1.6, fontWeight: 300 }}>
                  CSS injected directly into the generated HTML output. Styles the article headings, paragraphs, and lists.
                </p>
                <textarea
                  value={cssCode}
                  onChange={e => setCssCode(e.target.value)}
                  rows={7}
                  className="as-textarea css-mode"
                  spellCheck={false}
                />
              </div>
            )}

            {/* Test topic */}
            <div style={{ marginTop: '1.25rem', background: '#0a0a0a', border: '1px solid #141414', borderRadius: '14px', padding: '1rem' }}>
              <FieldLabel>Test Topic</FieldLabel>
              <input
                type="text"
                value={previewTopic}
                onChange={e => setPreviewTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !generating && previewTopic && handleTestPreview()}
                placeholder="e.g. Electric Vehicles, Coffee Business…"
                className="as-input"
                style={{ marginBottom: '0.85rem' }}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                <button
                  onClick={handleTestPreview}
                  disabled={generating || !previewTopic}
                  style={{
                    padding: '0.75rem', borderRadius: '10px',
                    background: 'transparent',
                    border: '1px solid #f7931a40',
                    color: '#f7931a',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600, fontSize: '0.82rem',
                    cursor: generating || !previewTopic ? 'not-allowed' : 'pointer',
                    opacity: generating || !previewTopic ? 0.5 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { if (!generating && previewTopic) e.currentTarget.style.background = '#f7931a10'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {generating ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" style={{ animation: 'spin 0.9s linear infinite' }} strokeLinecap="round"><path d="M21 12a9 9 0 11-6.22-8.56"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  )}
                  {generating ? 'Generating…' : 'Live Preview'}
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: '0.75rem', borderRadius: '10px',
                    background: saving ? '#555' : 'linear-gradient(135deg, #f7931a, #e8750a)',
                    border: 'none', color: '#fff',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 700, fontSize: '0.82rem',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 2px 12px #f7931a30',
                  }}
                  onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 5px 20px #f7931a45'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px #f7931a30'; }}
                >
                  {saving ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" style={{ animation: 'spin 0.9s linear infinite' }} strokeLinecap="round"><path d="M21 12a9 9 0 11-6.22-8.56"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  )}
                  {saving ? 'Saving…' : 'Save Config'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right panel: live preview */}
        <div style={{
          background: '#080808',
          border: '1px dashed #1d1d1d',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          minHeight: 520,
          position: 'relative',
        }}>
          {/* Preview header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            background: '#0d0d0d', borderBottom: '1px solid #141414',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                  <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
                ))}
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#4b5563', marginLeft: '0.25rem' }}>
                Live Render Preview
              </span>
            </div>

            {generating && (
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div className="as-dot" />
                <div className="as-dot" />
                <div className="as-dot" />
              </div>
            )}
          </div>

          {/* Preview content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', position: 'relative' }}>
            {!previewHtml && !generating ? (
              /* Empty state */
              <div style={{
                height: '100%', minHeight: 320,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                textAlign: 'center',
              }}>
                <div style={{ width: 48, height: 48, borderRadius: '13px', background: '#111', border: '1px solid #1d1d1d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" width="22" height="22" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#4b5563' }}>
                  No preview yet
                </p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#374151', fontWeight: 300, maxWidth: 220 }}>
                  Enter a topic and click Live Preview to render a real article here.
                </p>
              </div>
            ) : generating ? (
              /* Generating placeholder */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeIn 0.3s ease' }}>
                {[80, 55, 95, 40, 70, 60, 85].map((w, i) => (
                  <div key={i} style={{
                    height: i === 0 ? 28 : 14,
                    width: `${w}%`,
                    background: 'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)',
                    backgroundSize: '200% auto',
                    borderRadius: 6,
                    animation: `shimmer 1.5s linear infinite ${i * 0.08}s`,
                  }} />
                ))}
                <style>{`@keyframes shimmer{from{background-position:200% center}to{background-position:0% center}}`}</style>
              </div>
            ) : (
              /* Rendered article */
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                <style dangerouslySetInnerHTML={{ __html: `.preview-wrapper { ${cssCode} }` }} />
                <div
                  className="preview-wrapper"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}