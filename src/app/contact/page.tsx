'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// ─── Custom Modal Toast ───────────────────────────────────────────────────────
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

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  
  // Anti-Spam States
  const [honeypot, setHoneypot] = useState('');
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [mountTime, setMountTime] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Inisialisasi Captcha & Timer di sisi klien
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setMountTime(Date.now());
  }, []);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, message: msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Hitung waktu pengisian
    const timeElapsed = Date.now() - mountTime;
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, email, subject, message,
          honeypot, num1, num2, captchaAnswer, timeElapsed // Kirim data anti-spam
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        showToast('success', 'Your message has been sent successfully. We will get back to you soon!');
        setName(''); setEmail(''); setSubject('General Inquiry'); setMessage(''); setCaptchaAnswer('');
        // Refresh Captcha
        setNum1(Math.floor(Math.random() * 10) + 1);
        setNum2(Math.floor(Math.random() * 10) + 1);
        setMountTime(Date.now());
      } else {
        showToast('error', data.error || 'Failed to send message.');
      }
    } catch (_) {
      showToast('error', 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-orange-500 selection:text-white pb-24 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        .contact-input { width: 100%; box-sizing: border-box; background: #080808; border: 1px solid #1d1d1d; border-radius: 12px; padding: 0.85rem 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: #e5e7eb; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .contact-input:focus { border-color: #f7931a50; box-shadow: 0 0 0 3px #f7931a10; }
        .contact-input::placeholder { color: #374151; }
        
        .contact-btn { width: 100%; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.9rem; padding: 1rem; border-radius: 12px; border: none; background: linear-gradient(135deg, #f7931a, #e8750a); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s; box-shadow: 0 4px 20px #f7931a30; }
        .contact-btn:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 6px 25px #f7931a45; }
        .contact-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Ambient Glow */}
      <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32">
        
        {/* HEADER */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-6 tracking-widest uppercase shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            24/7 Support
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif" }} className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Touch.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Have questions about our API limits, enterprise pricing, or custom integrations? Our engineering and support teams are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
          
          {/* LEFT COLUMN: Contact Info */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h3 className="text-white font-bold text-2xl mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Direct Communication</h3>
              <p className="text-gray-400 leading-relaxed mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                We prefer async communication to keep our engineering team focused on building the best API engine. Send us a message, and we will get back to you within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-[#111] border border-white/10 p-6 rounded-2xl hover:border-orange-500/30 transition-colors duration-300">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Technical Support</h4>
                <a href="mailto:functionoverride000@gmail.com" className="text-lg font-bold text-orange-400 hover:text-orange-300 transition" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  functionoverride000@gmail.com
                </a>
              </div>
              
              <div className="bg-[#111] border border-white/10 p-6 rounded-2xl hover:border-orange-500/30 transition-colors duration-300">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Enterprise Sales</h4>
                <a href="mailto:babyybossssss@gmail.com" className="text-lg font-bold text-white hover:text-orange-400 transition" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  babyybossssss@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl">
              <h4 className="text-orange-500 font-bold mb-2 flex items-center gap-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                System Status
              </h4>
              <p className="text-sm text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                All FOSHT AI Engine nodes are currently operational. <Link href="/docs" className="text-white underline hover:text-orange-400">Check API Docs</Link>.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-3">
            <div style={{ background: 'linear-gradient(145deg, #111, #0d0d0d)', border: '1px solid #1d1d1d', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px #00000060' }} className="p-8 md:p-10 relative">
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #f7931a60, transparent)' }} />
              
              {/* Form subtle glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none" />
              
              <h2 className="text-2xl font-bold text-white mb-8 relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                {/* 🍯 LAYER 1: HONEYPOT (TERSEMBUNYI) 🍯 */}
                <div style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1, overflow: 'hidden' }}>
                  <label>Leave this field empty if you are human</label>
                  <input type="text" name="bot_honey" value={honeypot} onChange={e => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>Full Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="contact-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>Email Address</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" className="contact-input" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>Subject</label>
                  <select value={subject} onChange={(e) => setSubject(e.target.value)} className="contact-input appearance-none" style={{ cursor: 'pointer' }}>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="API Technical Support">API Technical Support</option>
                    <option value="Billing & Payment">Billing & Payment</option>
                    <option value="Custom Enterprise Plan">Custom Enterprise Plan</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>Message</label>
                  <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="How can we help you accelerate your SEO automation?" className="contact-input resize-none"></textarea>
                </div>

                {/* 🤖 LAYER 3: MATH CAPTCHA (Estetik) 🤖 */}
                {num1 > 0 && (
                  <div className="space-y-2 bg-[#111] p-4 rounded-xl border border-white/5">
                    <label className="text-xs font-bold text-fuchsia-500 uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Human Verification
                    </label>
                    <div className="flex gap-4 items-center">
                      <div className="bg-[#050505] border border-[#1d1d1d] px-4 py-2.5 rounded-lg text-orange-400 font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {num1} + {num2} = ?
                      </div>
                      <input 
                        type="text" 
                        required 
                        value={captchaAnswer} 
                        onChange={(e) => setCaptchaAnswer(e.target.value)} 
                        placeholder="Answer" 
                        className="contact-input flex-1" 
                        style={{ fontFamily: "'JetBrains Mono', monospace", padding: '0.65rem 1rem' }}
                      />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading} className="contact-btn mt-2">
                  {loading ? (
                    <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-6.22-8.56"/></svg> Authenticating...</>
                  ) : (
                    'Secure Send Message'
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>

        {/* FOOTER ACTION */}
        <div className="mt-24 pt-8 border-t border-white/10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            ← Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}