import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | FOSHT AI',
  description: 'Understand how FOSHT AI uses cookies and similar tracking technologies to improve your experience.',
};

export default function CookiePolicyPage() {
  const lastUpdated = "April 2026";

  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-orange-500 selection:text-white pb-24 overflow-hidden">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .legal-card {
          background: linear-gradient(145deg, #0a0a0a, #050505);
          border: 1px solid #1d1d1d;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px #00000080;
          position: relative;
        }
        .legal-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #f7931a40, transparent);
        }

        .policy-section {
          margin-bottom: 2.5rem;
        }
        .policy-section:last-child {
          margin-bottom: 0;
        }
        
        .policy-h2 {
          font-family: 'Syne', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #f0f0f0;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .policy-h2::before {
          content: '';
          display: block;
          width: 6px;
          height: 20px;
          background: #f7931a;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(247,147,26,0.5);
        }
        
        .policy-p {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #9ca3af;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .policy-ul {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #9ca3af;
          line-height: 1.8;
          list-style: none;
          padding-left: 0.5rem;
        }
        .policy-ul li {
          position: relative;
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .policy-ul li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: #f7931a;
          font-weight: bold;
          font-size: 1.2rem;
          line-height: 1.4;
        }
      `}</style>

      {/* Ambient Glows */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32" style={{ animation: 'fadeSlideIn 0.6s ease-out' }}>
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-6 tracking-widest uppercase shadow-[0_0_15px_rgba(249,115,22,0.2)]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Data Privacy & Tracking
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Cookie <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Policy.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Last Updated: <span className="text-gray-200 font-bold">{lastUpdated}</span>
          </p>
        </div>

        {/* CONTENT DOCUMENT (GLASSMORPHISM CARD) */}
        <div className="legal-card p-8 md:p-14">
          
          <div className="policy-section">
            <h2 className="policy-h2">1. What Are Cookies?</h2>
            <p className="policy-p">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used by online service providers to make websites work, or work more efficiently, as well as to provide reporting information and personalized experiences.
            </p>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">2. How We Use Cookies</h2>
            <p className="policy-p mb-4">
              As an API-first SaaS platform, FOSHT AI uses cookies primarily to maintain the security and functionality of your Developer Dashboard. We use cookies for the following critical purposes:
            </p>
            <ul className="policy-ul">
              <li>
                <strong className="text-gray-200 block mb-1">Strictly Necessary Cookies:</strong> 
                These are essential for you to browse our website and use its core features. For example, we use secure session cookies to keep you authenticated in your FOSHT Dashboard, allowing you to manage your API Keys and Wallet securely without needing to log in on every single action.
              </li>
              <li>
                <strong className="text-gray-200 block mb-1">Security Cookies:</strong> 
                We utilize security-focused cookies to authenticate users, prevent fraudulent use of login credentials, and protect sensitive user data (like wallet addresses and private configurations) from unauthorized third parties.
              </li>
              <li>
                <strong className="text-gray-200 block mb-1">Performance & Analytics Cookies:</strong> 
                These cookies collect anonymized information about how you interact with our website. We use this data strictly to monitor server health, optimize API response times, and improve the overall user experience.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">3. Browser Local Storage</h2>
            <p className="policy-p">
              In addition to cookies, we utilize HTML5 Local Storage to store your dashboard UI preferences locally on your device. This ensures a faster, state-persistent experience (such as remembering your active tab choices) without sending redundant data to our servers.
            </p>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">4. Third-Party Infrastructure</h2>
            <p className="policy-p">
              We may utilize trusted infrastructure partners (such as Vercel Analytics or secure payment verification nodes) that may also place technical cookies on your device. These third parties maintain their own strict privacy standards. <strong className="text-orange-400">FOSHT AI does not utilize third-party advertising tracking or marketing cookies.</strong>
            </p>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">5. Managing Your Preferences</h2>
            <p className="policy-p">
              You maintain the right to accept or reject cookies through your browser settings. However, please be advised that if you choose to block strictly necessary cookies, <strong className="text-orange-400">access to the FOSHT AI Dashboard and API management functions will be disabled or broken</strong>, as session authentication requires these secure tokens to function.
            </p>
            <p className="policy-p mt-4">
              To manage cookies on your specific browser, please refer to the official documentation for Google Chrome, Mozilla Firefox, Apple Safari, or Microsoft Edge.
            </p>
          </div>

          {/* QUESTIONS BOX */}
          <div className="mt-14 bg-[#080808] border border-[#1d1d1d] p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[40px] pointer-events-none" />
            <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Questions?</h3>
            <p className="text-gray-400 mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
              If you have any questions regarding our use of cookies or other persistent storage technologies, please contact our privacy department.
            </p>
            <div className="inline-flex items-center gap-3 bg-[#111] border border-[#141414] px-4 py-3 rounded-xl">
              <svg viewBox="0 0 24 24" fill="none" stroke="#f7931a" strokeWidth="2" width="18" height="18" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span className="text-orange-400 font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem' }}>
                functionoverride000@gmail.com
              </span>
            </div>
          </div>

        </div>

        {/* FOOTER ACTION */}
        <div className="mt-16 pt-8 border-t border-[#141414] text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            ← Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}