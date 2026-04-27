'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // State baru khusus untuk mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  // ── Auth check
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        setIsLoggedIn(!!data.success);
      } catch (_) {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, [pathname]);

  // ── Scroll detection for dynamic blur/border intensity
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // ── Track page change for button re-animation & auto-close mobile menu
  useEffect(() => {
    prevPathRef.current = pathname;
    // Tutup menu mobile otomatis setiap kali pindah halaman
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [pathname]);

  const showDashboard = isLoggedIn && pathname !== '/dashboard';
  const showLogin     = !isLoggedIn && pathname !== '/login';

  const navLinks = [
    { href: '/', label: 'Features' },
    { href: '/#pricing',  label: 'Pricing'  },
    { href: '/docs',      label: 'Docs'     },
    { href: 'https://fosht.vercel.app/blog',      label: 'Blog'     },
    { href: '/about',      label: 'About'     },
    { href: '/contact',      label: 'Contact'     },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .nb-root {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .nb-root.scrolled {
          background: rgba(6,6,6,0.92) !important;
          border-color: #1d1d1d !important;
          box-shadow: 0 1px 40px rgba(0,0,0,0.6), 0 0 0 0 transparent;
        }
        .nb-root.top {
          background: rgba(6,6,6,0.60);
          border-color: #141414;
        }

        /* Slide-down entrance */
        .nb-inner {
          opacity: 0;
          transform: translateY(-14px);
          transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .nb-inner.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        /* Logo */
        .nb-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.35rem;
          letter-spacing: -0.04em;
          color: #f0f0f0;
          text-decoration: none;
          position: relative;
          transition: opacity 0.2s;
        }
        .nb-logo:hover { opacity: 0.85; }
        .nb-logo .accent { color: #f7931a; }

        /* Dot pulse on logo */
        .nb-logo-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f7931a;
          margin-left: 2px;
          vertical-align: super;
          animation: dotPulse 2.4s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 0 0 #f7931a60; opacity: 1; }
          50%       { box-shadow: 0 0 0 5px transparent; opacity: 0.7; }
        }

        /* Nav links (center) */
        .nb-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .nb-link {
          color: #6b7280;
          text-decoration: none;
          position: relative;
          padding-bottom: 2px;
          transition: color 0.2s;
          letter-spacing: 0.01em;
        }
        .nb-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 1px;
          background: #f7931a;
          transition: width 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .nb-link:hover { color: #e5e7eb; }
        .nb-link:hover::after { width: 100%; }
        .nb-link.active { color: #f0f0f0; }
        .nb-link.active::after { width: 100%; background: #f7931a; }

        /* CTA Button — Dashboard */
        .nb-btn-dashboard {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.55rem 1.35rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #f7931a, #e8750a);
          color: #fff;
          text-decoration: none;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 0 0 #f7931a00;
          animation: btnAppear 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
          letter-spacing: 0.01em;
        }
        .nb-btn-dashboard::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #fff2, transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .nb-btn-dashboard:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px #f7931a55;
        }
        .nb-btn-dashboard:hover::before { opacity: 1; }
        .nb-btn-dashboard:active { transform: translateY(0); }

        /* CTA Button — Login */
        .nb-btn-login {
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.55rem 1.35rem;
          border-radius: 999px;
          background: transparent;
          color: #e5e7eb;
          text-decoration: none;
          border: 1px solid #2d2d2d;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: color 0.2s, border-color 0.2s, transform 0.2s, background 0.2s;
          animation: btnAppear 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
          letter-spacing: 0.01em;
        }
        .nb-btn-login:hover {
          background: #1a1a1a;
          border-color: #f7931a60;
          color: #f7931a;
          transform: translateY(-2px);
        }
        .nb-btn-login:active { transform: translateY(0); }

        @keyframes btnAppear {
          from { opacity: 0; transform: scale(0.88) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* Right section */
        .nb-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Status indicator when logged in */
        .nb-status {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          color: #4b5563;
          letter-spacing: 0.02em;
        }
        .nb-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 0 #22c55e60;
          animation: greenPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes greenPulse {
          0%, 100% { box-shadow: 0 0 0 0 #22c55e60; }
          50%       { box-shadow: 0 0 0 4px transparent; }
        }

        /* Separator */
        .nb-sep {
          width: 1px;
          height: 16px;
          background: #222;
          margin: 0 0.25rem;
        }

        /* TAMPILAN HAMBURGER & MOBILE MENU (KHUSUS MOBILE) */
        .nb-hamburger {
          display: none;
          background: none;
          border: none;
          color: #e5e7eb;
          cursor: pointer;
          padding: 0.25rem;
          margin-left: 0.5rem;
          transition: color 0.2s;
        }
        .nb-hamburger:hover { color: #f7931a; }
        
        .nb-mobile-menu {
          display: none; /* Sembunyikan default */
        }

        /* Mobile: hide nav links below md */
        @media (max-width: 640px) {
          .nb-links { display: none; }
          .nb-logo  { font-size: 1.15rem; }
          .nb-hamburger { display: flex; align-items: center; justify-content: center; }
          
          /* Dropdown menu styling saat dibuka */
          .nb-mobile-menu {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 68px; /* Tepat di bawah navbar */
            left: 0;
            width: 100%;
            background: rgba(6, 6, 6, 0.98);
            border-bottom: 1px solid #141414;
            padding: 1.5rem;
            gap: 1.25rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.8);
            transform-origin: top;
            animation: slideDown 0.3s ease-out forwards;
          }
          .nb-mobile-link {
            font-family: 'DM Sans', sans-serif;
            font-size: 1.1rem;
            font-weight: 600;
            color: #9ca3af;
            text-decoration: none;
            transition: color 0.2s;
          }
          .nb-mobile-link:hover, .nb-mobile-link.active {
            color: #f7931a;
          }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: scaleY(0.95); }
          to { opacity: 1; transform: scaleY(1); }
        }
      `}</style>

      <nav
        className={`nb-root ${scrolled || mobileMenuOpen ? 'scrolled' : 'top'}`}
        style={{ backdropFilter: 'blur(16px)', borderBottom: '1px solid' }}
      >
        <div className={`nb-inner ${mounted ? 'mounted' : ''}`}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '0 1.5rem',
              height: '68px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* ── Logo */}
            <Link href="/" className="nb-logo">
              FOSHT<span className="accent">.AI</span>
              <span className="nb-logo-dot" />
            </Link>

            {/* ── Center nav links (Desktop Only) */}
            <div className="nb-links">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nb-link ${pathname === href ? 'active' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* ── Right section */}
            <div className="nb-right">
              {isLoggedIn && (
                <>
                  <div className="nb-status">
                    <span className="nb-status-dot" />
                    
                  </div>
                  <div className="nb-sep" />
                </>
              )}

              {showDashboard && (
                <Link href="/dashboard" className="nb-btn-dashboard">
                  Dashboard
                </Link>
              )}

              {showLogin && (
                <Link href="/login" className="nb-btn-login">
                  Sign In
                </Link>
              )}

              {/* ── Hamburger Menu Button (Mobile Only) */}
              <button 
                className="nb-hamburger" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  // Icon X (Close)
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="24" height="24" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                ) : (
                  // Icon Menu (Hamburger)
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="24" height="24" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* ── Mobile Menu Dropdown (Membuka ke bawah hanya di Mobile) */}
        {mobileMenuOpen && (
          <div className="nb-mobile-menu">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nb-mobile-link ${pathname === href ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}