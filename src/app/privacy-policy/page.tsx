import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | FOSHT AI',
  description: 'Learn how FOSHT AI collects, uses, and protects your enterprise data and API keys.',
};

export default function PrivacyPolicyPage() {
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
          margin-bottom: 0.75rem;
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
      <div className="absolute top-[-5%] left-[10%] w-[40%] h-[30%] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[40%] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32" style={{ animation: 'fadeSlideIn 0.6s ease-out' }}>
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-6 tracking-widest uppercase shadow-[0_0_15px_rgba(249,115,22,0.2)]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Policy.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Effective Date: <span className="text-gray-200 font-bold">{lastUpdated}</span>
          </p>
        </div>

        {/* CONTENT DOCUMENT (GLASSMORPHISM CARD) */}
        <div className="legal-card p-8 md:p-14">
          
          <div className="policy-section">
            <h2 className="policy-h2">1. Introduction</h2>
            <p className="policy-p">
              Welcome to <strong className="text-gray-200">FOSHT AI</strong>. We are committed to protecting your privacy and ensuring that your personal information, API keys, and business data are handled securely. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website, API, and headless content engine services.
            </p>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">2. Information We Collect</h2>
            <p className="policy-p">
              We only collect information strictly necessary to provide and improve our enterprise-grade B2B services:
            </p>
            <ul className="policy-ul">
              <li><strong className="text-gray-200">Account Information:</strong> Email address, hashed passwords, security PINs, and profile configurations.</li>
              <li><strong className="text-gray-200">Billing & Wallet Data:</strong> Cryptocurrency wallet addresses used for transactions. We do not process or store private keys.</li>
              <li><strong className="text-gray-200">API Usage Data:</strong> Request logs, timestamps, IP addresses, and payload configurations (such as topics and custom prompts) processed through our endpoints.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">3. How We Use Your Information</h2>
            <ul className="policy-ul">
              <li>To authorize and authenticate your API Keys for headless content generation.</li>
              <li>To process crypto payments and verify blockchain transactions automatically.</li>
              <li>To monitor server loads, enforce rate limits, and prevent malicious API abuse.</li>
              <li>To communicate important updates regarding your subscription, system downtime, or security notices.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">4. Data Sharing & External AI Models</h2>
            <p className="policy-p">
              FOSHT AI acts as a routing intelligence engine. To generate high-fidelity content, the payloads (topics, keywords, custom prompts) you send via our API may be securely transmitted to our trusted third-party Large Language Model (LLM) and Image Generation partners. <strong className="text-orange-400">We do not sell your personal or corporate data to advertisers.</strong> Your data is solely utilized to fulfill the API requests you trigger.
            </p>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">5. Infrastructure Security</h2>
            <p className="policy-p">
              We implement industry-standard encryption protocols to protect your data. API keys are encrypted at rest and in transit. However, please remember that you hold the responsibility for keeping your API keys, security PIN, and account passwords confidential. Never expose your API keys in client-side code (Frontend) or public repositories.
            </p>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">6. Your Data Rights</h2>
            <p className="policy-p">
              Depending on your jurisdiction, you maintain the right to access, correct, or permanently delete your personal data. You can update your credentials and wallet address directly from your FOSHT Dashboard. If you require full account deletion and purging of associated API logs, please initiate a request with our support team.
            </p>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">7. Policy Modifications</h2>
            <p className="policy-p">
              We may update this Privacy Policy periodically to reflect advancements in our technology ecosystem or shifting legal requirements. We will notify you of any structural changes via your registered email or through a broadcast announcement on your Developer Dashboard.
            </p>
          </div>

          {/* CONTACT BOX INSIDE THE DOCUMENT */}
          <div className="mt-14 bg-[#080808] border border-[#1d1d1d] p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[40px] pointer-events-none" />
            <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Questions regarding privacy?</h3>
            <p className="text-gray-400 mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
              If you require clarification regarding this Privacy Policy, our data practices, or security protocols, please reach out to our compliance team.
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