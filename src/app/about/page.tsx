import Link from 'next/link';

export const metadata = {
  title: 'About Us | FOSHT AI',
  description: 'Learn more about FOSHT AI, the ultimate API-first SEO content engine built for digital scaling.',
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-orange-500 selection:text-white pb-24 overflow-hidden">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        
        .glass-card {
          background: linear-gradient(145deg, #111, #0d0d0d);
          border: 1px solid #1d1d1d;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px #00000060;
          transition: border-color 0.4s, transform 0.4s;
          position: relative;
        }
        .glass-card:hover {
          border-color: #f7931a30;
          transform: translateY(-5px);
        }
        .glass-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #f7931a40, transparent);
        }

        .cta-btn-primary {
          font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.95rem;
          padding: 1rem 2rem; border-radius: 12px; border: none;
          background: linear-gradient(135deg, #f7931a, #e8750a);
          color: #fff; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: all 0.2s; box-shadow: 0 4px 20px #f7931a30; text-decoration: none;
        }
        .cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 25px #f7931a45; }

        .cta-btn-secondary {
          font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.95rem;
          padding: 1rem 2rem; border-radius: 12px; border: 1px solid #1d1d1d;
          background: #080808; color: #e5e7eb; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
          transition: all 0.2s; text-decoration: none;
        }
        .cta-btn-secondary:hover { background: #111; border-color: #f7931a50; color: #f7931a; }
      `}</style>

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] left-[20%] w-[50%] h-[40%] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32" style={{ animation: 'fadeSlideIn 0.6s ease-out' }}>
        
        {/* HEADER / HERO SECTION */}
        <div className="text-center mb-28">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-6 tracking-widest uppercase shadow-[0_0_15px_rgba(249,115,22,0.2)]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            The FOSHT AI Vision
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Scaling the Future of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Digital Real Estate.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            We believe that high-quality, SEO-driven content shouldn&apos;t be a manual bottleneck. FOSHT AI is an enterprise-grade engine engineered to help digital agencies and businesses automate their organic growth at unprecedented scale.
          </p>
        </div>

        {/* THE STORY & VALUE PROPOSITION */}
        <div className="grid md:grid-cols-2 gap-8 mb-28">
          
          <div className="glass-card p-10 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-[60px] group-hover:bg-orange-500/10 transition-colors duration-500" />
            
            <div className="w-14 h-14 rounded-2xl bg-[#111] border border-[#1d1d1d] flex items-center justify-center mb-8 relative z-10 shadow-[0_0_20px_rgba(247,147,26,0.1)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="#f7931a" strokeWidth="2" width="24" height="24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4 relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>Infinite Scalability</h2>
            <p className="text-gray-400 leading-relaxed relative z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Managing content for multiple luxury B2B clients or operating a network of niche sites requires immense resources. FOSHT AI eliminates this friction. By delivering complete, high-ranking SEO articles on autopilot, we empower you to multiply your digital footprint without expanding your overhead.
            </p>
          </div>

          <div className="glass-card p-10 md:p-12 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-[60px] group-hover:bg-white/10 transition-colors duration-500" />
            
            <div className="w-14 h-14 rounded-2xl bg-[#111] border border-[#1d1d1d] flex items-center justify-center mb-8 relative z-10">
              <svg viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" strokeWidth="2" width="24" height="24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4 relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>Seamless Architecture</h2>
            <p className="text-gray-400 leading-relaxed relative z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              We do not constrain your business to a restrictive platform or rigid CMS. Our API-first infrastructure is designed to integrate silently into your existing ecosystem. You retain absolute control over your brand’s presentation, user experience, and deployment strategy—we simply provide the intelligence.
            </p>
          </div>
          
        </div>

        {/* CORE PILLARS */}
        <div className="mb-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>The FOSHT Standard</h2>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6">
            
            <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-[#141414] hover:bg-[#111] transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="#f7931a" strokeWidth="2" width="20" height="20" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-200 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Hyper-Optimized SEO</h3>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Content isn&apos;t just generated; it is architected for search visibility. Every output is structurally sound and keyword-focused to capture high-intent organic traffic.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-[#141414] hover:bg-[#111] transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="#f7931a" strokeWidth="2" width="20" height="20" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-200 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Visual Brilliance</h3>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Text alone is no longer enough. Our engine seamlessly weaves bespoke, high-resolution imagery into your articles, elevating your brand&apos;s aesthetic value automatically.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-[#141414] hover:bg-[#111] transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="#f7931a" strokeWidth="2" width="20" height="20" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-200 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Enterprise Reliability</h3>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Built on a decentralized network with robust security protocols. We guarantee maximum uptime, secure API transactions, and zero-friction content delivery.
              </p>
            </div>

          </div>
        </div>

        {/* CTA SECTION (MENGGUNAKAN GLASSMORPHISM) */}
        <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
          {/* Internal Glow for CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-600/10 rounded-full blur-[80px] pointer-events-none z-0" style={{ animation: 'pulse-glow 4s infinite alternate' }} />
          
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>
            Ready to Automate Your Empire?
          </h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto relative z-10 text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Join forward-thinking agencies and digital entrepreneurs who have stopped writing manually. Secure your API License today.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link href="/dashboard" className="cta-btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
              Deploy Your Engine
            </Link>
            <Link href="/contact" className="cta-btn-secondary">
              Contact Sales
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}