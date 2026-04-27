import Link from 'next/link';

export const metadata = {
  title: 'Product Roadmap | FOSHT AI',
  description: 'Explore the future of FOSHT AI. See what we are building next for our headless content engine.',
};

// Data Dummy Roadmap (Hanya sebagai background yang akan di-blur)
const roadmapData = [
  {
    quarter: "Q2 2026",
    title: "Advanced Visual Engine",
    status: "In Progress",
    description: "Giving developers more granular control over the AI image generation process.",
    features: ["Custom aspect ratio parameters", "Style prompting", "Multi-image generation"]
  },
  {
    quarter: "Q3 2026",
    title: "Multilingual Expansion",
    status: "Planned",
    description: "Scaling the SEO engine to dominate non-English search markets.",
    features: ["Native support for 15+ new languages", "Localized LSI keyword", "Cultural nuances"]
  },
  {
    quarter: "Q4 2026",
    title: "CMS Auto-Sync Webhooks",
    status: "Exploring",
    description: "Eliminating the need for manual database insertion scripts.",
    features: ["Direct integration webhooks", "Auto-publishing scheduling", "Draft vs. Publish control"]
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  let colorClass = "bg-gray-500/10 text-gray-400 border-gray-500/20";
  let pulse = false;

  if (status === "In Progress") {
    colorClass = "bg-orange-500/10 text-orange-400 border-orange-500/20";
    pulse = true;
  }
  if (status === "Planned") colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (status === "Exploring") colorClass = "bg-purple-500/10 text-purple-400 border-purple-500/20";

  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full border ${colorClass}`}>
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>}
      {status}
    </span>
  );
};

export default function RoadmapPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-orange-500 selection:text-white pb-24 overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute top-[10%] left-[20%] w-[50%] h-[40%] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32">
        
        {/* HEADER */}
        <div className="text-center mb-20 border-b border-white/10 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-6 tracking-widest uppercase shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            The Future of FOSHT
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Roadmap.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Take a look at what we are building next. Our vision is to make FOSHT AI the absolute standard for headless SEO automation.
          </p>
        </div>

        {/* ROADMAP SECTION (BLURRED WITH OVERLAY) */}
        <div className="relative">
          
          {/* PESAN OVERLAY DI TENGAH */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl text-center shadow-2xl max-w-md mx-auto transform hover:scale-105 transition-transform duration-500">
              <span className="text-5xl mb-6 block">🚧</span>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Planning the Future</h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Our engineering team is currently mapping out the next major breakthroughs for the FOSHT Engine. Exciting updates are coming soon!
              </p>
              <div className="inline-flex items-center gap-2 text-orange-500 font-bold text-sm tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                Stay Tuned
              </div>
            </div>
          </div>

          {/* GRID ROADMAP YANG DI-BLUR */}
          {/* Tambahan class: blur-md, opacity-30, pointer-events-none, select-none */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 blur-md opacity-30 pointer-events-none select-none grayscale">
            {roadmapData.map((phase, index) => (
              <div key={index} className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-2xl font-black text-white/20 tracking-tighter">{phase.quarter}</span>
                  <StatusBadge status={phase.status} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">{phase.title}</h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-8 flex-grow">
                  {phase.description}
                </p>
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Key Deliverables</h4>
                  <ul className="space-y-3">
                    {phase.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="text-orange-500 shrink-0 mt-0.5">✦</span>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* CALL TO ACTION */}
        <div className="mt-32 bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-orange-500/5 blur-3xl" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">Have a Feature Request?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">
            We build FOSHT AI for developers like you. If there is a specific feature you need for your enterprise integration, let us know!
          </p>
          <Link href="/contact" className="relative z-10 bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition shadow-lg inline-block">
            Contact Engineering Team
          </Link>
        </div>

      </div>
    </div>
  );
}