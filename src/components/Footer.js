import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  // PERUBAHAN DI SINI: Mengubah teks menjadi objek agar punya URL tujuan
  const links = {
    Product:  [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Roadmap', href: '/roadmap' }
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/docs#endpoint' },
      { label: 'Blog', href: 'https://fosht.vercel.app/blog/fosht-blog' },
      { label: 'Status', href: '/status' }
    ],
    Company:  [
      { label: 'About', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Contact', href: '/contact' }
    ],
  };

  const socials = [
    {
      label: 'X / Twitter',
      href: 'https://x.com/babyybossssss',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.636L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      ),
    },
    {
      label: 'GitHub',
      href: 'https://github.com/FunctionOverride000',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      label: 'Telegram',
      href: 'https://t.me/functionoverride',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .ft-root {
          position: relative;
          width: 100%;
          background: #080808;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Top glow line */
        .ft-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #f7931a30 30%, #f7931a60 50%, #f7931a30 70%, transparent 100%);
        }

        /* Ambient glow */
        .ft-root::after {
          content: '';
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%);
          width: 50vw;
          height: 200px;
          background: radial-gradient(ellipse at center, #f7931a08 0%, transparent 70%);
          pointer-events: none;
        }

        .ft-inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 1.5rem 2rem;
        }

        /* ── Top grid */
        .ft-grid {
          display: grid;
          grid-template-columns: 1.8fr repeat(3, 1fr);
          gap: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid #141414;
        }
        @media (max-width: 900px) {
          .ft-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        @media (max-width: 560px) {
          .ft-grid { grid-template-columns: 1fr; }
        }

        /* Brand column */
        .ft-brand-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: -0.04em;
          color: #f0f0f0;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 0.75rem;
          transition: opacity 0.2s;
        }
        .ft-brand-logo:hover { opacity: 0.8; }
        .ft-brand-logo .acc { color: #f7931a; }

        .ft-tagline {
          font-size: 0.82rem;
          color: #4b5563;
          line-height: 1.6;
          max-width: 220px;
          margin-bottom: 1.5rem;
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        /* Social icons */
        .ft-socials {
          display: flex;
          gap: 0.6rem;
        }
        .ft-social-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #111;
          border: 1px solid #1d1d1d;
          color: #4b5563;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
        }
        .ft-social-btn:hover {
          background: #1a1a1a;
          border-color: #f7931a50;
          color: #f7931a;
          transform: translateY(-2px);
        }

        /* Link columns */
        .ft-col-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #f0f0f0;
          margin-bottom: 1rem;
        }
        .ft-col-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .ft-col-link {
          font-size: 0.83rem;
          color: #4b5563;
          text-decoration: none;
          font-weight: 400;
          transition: color 0.18s, padding-left 0.18s;
          display: inline-block;
          letter-spacing: 0.01em;
        }
        .ft-col-link:hover {
          color: #d1d5db;
          padding-left: 4px;
        }

        /* ── Bottom bar */
        .ft-bottom {
          padding-top: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .ft-copy {
          font-size: 0.78rem;
          color: #374151;
          font-weight: 400;
          letter-spacing: 0.02em;
        }
        .ft-copy span { color: #4b5563; }

        /* Status badge */
        .ft-status {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #374151;
          letter-spacing: 0.03em;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          background: #0d0d0d;
          border: 1px solid #1a1a1a;
          font-family: 'DM Sans', sans-serif;
        }
        .ft-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: greenPulse 2.2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes greenPulse {
          0%, 100% { box-shadow: 0 0 0 0 #22c55e50; }
          50%       { box-shadow: 0 0 0 3px transparent; }
        }

        /* Bottom links */
        .ft-bottom-links {
          display: flex;
          gap: 1.5rem;
        }
        .ft-bottom-link {
          font-size: 0.75rem;
          color: #374151;
          text-decoration: none;
          transition: color 0.18s;
          letter-spacing: 0.02em;
        }
        .ft-bottom-link:hover { color: #6b7280; }

        @media (max-width: 600px) {
          .ft-bottom { flex-direction: column; align-items: flex-start; }
          .ft-bottom-links { display: none; }
        }
      `}</style>

      <footer className="ft-root">
        <div className="ft-inner">

          {/* ── Top grid */}
          <div className="ft-grid">

            {/* Brand */}
            <div>
              {/* PERUBAHAN: Logo FOSHT diarahkan kembali ke Home (/) */}
              <Link href="/" className="ft-brand-logo">
                FOSHT<span className="acc">.AI</span>
              </Link>
              <p className="ft-tagline">
                Decentralized SEO blog automation powered by AI — write less, rank more.
              </p>
              <div className="ft-socials">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="ft-social-btn"
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {/* PERUBAHAN: Menggunakan item.href dan item.label */}
            {Object.entries(links).map(([group, items]) => (
              <div key={group}>
                <p className="ft-col-title">{group}</p>
                <ul className="ft-col-links">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="ft-col-link">{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Bottom bar */}
          <div className="ft-bottom">
            <p className="ft-copy">
              &copy; {year} <span>FOSHT AI</span> — All rights reserved.
            </p>

            <div className="ft-status">
              <span className="ft-status-dot" />
              All systems operational
            </div>

            {/* PERUBAHAN: Menggunakan Link dari Next.js agar perpindahan mulus */}
            <div className="ft-bottom-links">
              <Link href="/privacy-policy" className="ft-bottom-link">Privacy</Link>
              <Link href="/terms-of-service" className="ft-bottom-link">Terms</Link>
              <Link href="/cookie-policy" className="ft-bottom-link">Cookies</Link>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}