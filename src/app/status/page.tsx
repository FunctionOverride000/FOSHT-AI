import Link from 'next/link';

export const metadata = {
  title: 'System Status | FOSHT AI',
  description: 'Real-time operational status, uptime monitoring, and incident history for the FOSHT AI Engine API.',
};

// Data Dummy Layanan (Microservices)
const services = [
  { name: "Core API Engine", status: "Operational", uptime: "99.99%" },
  { name: "Image Generation Node", status: "Operational", uptime: "99.95%" },
  { name: "Developer Dashboard", status: "Operational", uptime: "99.98%" },
  { name: "Crypto Payment Gateway", status: "Operational", uptime: "100%" },
];

// Data Dummy Riwayat Insiden
const pastIncidents = [
  {
    date: "April 18, 2026",
    title: "Elevated API Latency",
    status: "Resolved",
    description: "We identified and resolved an issue causing delayed response times (up to 15s) in the Image Generation Node due to an upstream provider spike. All queues have returned to normal."
  },
  {
    date: "April 02, 2026",
    title: "Scheduled Database Maintenance",
    status: "Completed",
    description: "Successfully upgraded the primary database cluster to support higher write throughput. No downtime was observed."
  }
];

export default function StatusPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-orange-500 selection:text-white pb-24 overflow-hidden">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); } 50% { box-shadow: 0 0 0 10px transparent; } }
        
        .status-btn {
          font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.85rem; padding: 0.85rem 1.5rem; 
          border-radius: 12px; border: 1px solid #1d1d1d; background: #080808; color: #e5e7eb; 
          display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; 
          transition: all 0.2s; text-decoration: none;
        }
        .status-btn:hover { background: #111; border-color: #f7931a50; color: #f7931a; transform: translateY(-2px); }
        
        .status-btn-primary {
          background: linear-gradient(135deg, #f7931a, #e8750a); border: none; box-shadow: 0 4px 20px #f7931a30; color: #fff;
        }
        .status-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 25px #f7931a45; color: #fff; }
      `}</style>

      {/* Ambient Glow - Warna Hijau untuk merepresentasikan status normal */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32" style={{ animation: 'fadeSlideIn 0.5s ease-out' }}>
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold mb-6 tracking-widest uppercase shadow-[0_0_15px_rgba(34,197,94,0.2)]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Real-Time Network Status
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            FOSHT AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Status.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Transparency first. Real-time performance metrics and historical incident reports.
          </p>
        </div>

        {/* BIG STATUS INDICATOR (GLASSMORPHISM) */}
        <div style={{ background: 'linear-gradient(145deg, #111, #0d0d0d)', border: '1px solid #1d1d1d', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px #00000060' }} className="mb-16 relative">
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #22c55e60, transparent)' }} />
          
          <div className="p-10 md:p-14 text-center flex flex-col items-center justify-center relative overflow-hidden">
            {/* Subtle glow behind the icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-500/5 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="w-20 h-20 bg-[#050505] border border-[#1d1d1d] rounded-2xl flex items-center justify-center mb-6 relative z-10">
              <span style={{ animation: 'pulse-glow 2s infinite' }} className="w-6 h-6 rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]"></span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>
              All Systems <span className="text-green-400">Operational</span>
            </h2>
            <p className="text-gray-500 text-sm relative z-10" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Last updated: {new Date().toLocaleTimeString('en-US')}
            </p>
          </div>
        </div>

        {/* SERVICES BREAKDOWN */}
        <div className="mb-20">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-[#141414] pb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            Uptime per Service
          </h3>
          
          <div style={{ background: '#0a0a0a', border: '1px solid #1d1d1d', borderRadius: '20px', overflow: 'hidden' }}>
            {services.map((service, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-5 md:p-6 border-b border-[#141414] last:border-b-0 hover:bg-[#111] transition-colors"
              >
                <div>
                  <h4 className="text-gray-200 font-bold text-md md:text-lg mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{service.name}</h4>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Target Uptime: 99.9%</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 text-green-400 font-bold mb-1" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {service.status}
                  </div>
                  <span className="text-xs text-gray-400 bg-[#050505] border border-[#1d1d1d] px-2.5 py-1 rounded-md" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {service.uptime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAST INCIDENTS */}
        <div className="mb-16">
          <h3 className="text-xl font-bold text-white mb-8 border-b border-[#141414] pb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            Incident History
          </h3>
          
          <div className="space-y-8 pl-2">
            {pastIncidents.map((incident, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12 border-l border-[#1d1d1d]">
                
                {/* Timeline Dot */}
                <div className="absolute top-1.5 -left-[7px] w-3 h-3 rounded-full bg-[#f7931a] shadow-[0_0_10px_rgba(247,147,26,0.5)]" />
                
                <h4 className="text-lg font-bold text-gray-200 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{incident.title}</h4>
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs text-gray-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {incident.date}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded bg-[#111] border border-[#1d1d1d] text-gray-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {incident.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-400 leading-relaxed bg-[#0a0a0a] p-5 rounded-xl border border-[#141414]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {incident.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="mt-24 pt-10 border-t border-[#141414] text-center">
          <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Experiencing an issue not listed here?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="status-btn status-btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Contact Support
            </Link>
            <Link href="/" className="status-btn">
              ← Back to Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}