import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | FOSHT AI',
  description: 'Read the Terms of Service governing your use of the FOSHT AI Headless Content Engine and API.',
};

export default function TermsOfServicePage() {
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
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Service.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Effective Date: <span className="text-gray-200 font-bold">{lastUpdated}</span>
          </p>
        </div>

        {/* CONTENT DOCUMENT (GLASSMORPHISM CARD) */}
        <div className="legal-card p-8 md:p-14">
          
          <div className="policy-section">
            <h2 className="policy-h2">1. Acceptance of Terms</h2>
            <p className="policy-p">
              By accessing, registering, or utilizing the <strong className="text-gray-200">FOSHT AI</strong> website, dashboard, or API endpoints (collectively referred to as the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using our Service.
            </p>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">2. Description of Service</h2>
            <p className="policy-p">
              FOSHT AI provides an API-first &quot;Headless Content Engine&quot; that allows developers and businesses to programmatically generate SEO-optimized articles and accompanying digital imagery using artificial intelligence. We reserve the right to modify, suspend, or discontinue any part of the Service at any time without prior notice.
            </p>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">3. Accounts & API Key Security</h2>
            <p className="policy-p mb-4">
              To use the Service, you must obtain an API Key. You are solely responsible for maintaining the confidentiality of your account credentials, Security PIN, and API Keys.
            </p>
            <ul className="policy-ul">
              <li>You must not expose your API Key in public repositories, client-side code (browsers), or unsecured environments.</li>
              <li>You are financially responsible for all API requests made using your API Key, regardless of whether the requests were authorized by you.</li>
              <li>FOSHT AI reserves the right to instantly revoke any API Key suspected of being compromised or used maliciously.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">4. Acceptable Use Policy</h2>
            <p className="policy-p mb-4">
              You agree not to use the FOSHT AI Service to generate content that:
            </p>
            <ul className="policy-ul">
              <li>Violates any applicable local, state, national, or international law.</li>
              <li>Promotes hate speech, violence, illegal acts, or discrimination.</li>
              <li>Involves malware, phishing, or the generation of deceptive/fraudulent material.</li>
              <li>Attempts to reverse-engineer, scrape, or attack the FOSHT AI infrastructure.</li>
            </ul>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">5. Payments & Refunds</h2>
            <p className="policy-p">
              FOSHT AI operates on a pre-paid or subscription basis, utilizing Cryptocurrency (Bitcoin) networks for transactions. Due to the immutable nature of blockchain transactions and the immediate computational cost of AI generation, <strong className="text-orange-400">all payments are final and non-refundable</strong>.
            </p>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">6. Intellectual Property & Content Ownership</h2>
            <p className="policy-p">
              FOSHT AI retains all intellectual property rights to the underlying technology, engine, and API infrastructure. However, <strong className="text-gray-200">you retain all ownership rights</strong> to the text and image content generated via your API requests, subject to your compliance with these Terms. You are free to publish, sell, and distribute the generated content.
            </p>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">7. Limitation of Liability</h2>
            <p className="policy-p">
              The Service utilizes generative AI models, which can occasionally produce inaccurate, biased, or hallucinated information. FOSHT AI makes no guarantees regarding the factual accuracy of the generated content or its performance on search engines (SEO rankings).
            </p>
            <p className="policy-p text-gray-500 uppercase text-sm tracking-wider mt-4">
              IN NO EVENT SHALL FOSHT AI BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR SEO RANKINGS, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
            </p>
          </div>

          <div className="policy-section">
            <h2 className="policy-h2">8. Account Termination</h2>
            <p className="policy-p">
              We reserve the right to terminate or suspend your account and API access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms of Service.
            </p>
          </div>

          {/* CONTACT BOX INSIDE THE DOCUMENT */}
          <div className="mt-14 bg-[#080808] border border-[#1d1d1d] p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[40px] pointer-events-none" />
            <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Legal Inquiries</h3>
            <p className="text-gray-400 mb-4" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
              For any legal inquiries, reports of abuse, or questions regarding these Terms of Service, please reach out to our legal department.
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