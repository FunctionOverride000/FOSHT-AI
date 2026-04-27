import Link from 'next/link';

export const metadata = {
  title: 'Changelog | FOSHT AI',
  description: 'Track the latest updates, improvements, and fixes to the FOSHT AI Engine and API.',
};

// Data Dummy Pembaruan (Anda bisa menambahkannya nanti dengan mudah di sini)
const updates = [
  {
    version: "v1.2.0",
    date: "April 24, 2026",
    title: "Headless CSS Injection & High-Res Images",
    changes: [
      { type: "New", text: "Added 'clientCustomCss' parameter to the API payload, allowing developers to inject pure CSS directly into the generated HTML." },
      { type: "Improved", text: "Upgraded the AI Image Engine to generate 4K resolution featured images by default for Pro and Enterprise tiers." },
      { type: "Fixed", text: "Resolved an issue where certain long-tail keywords were not naturally embedded in the concluding paragraphs." }
    ]
  },
  {
    version: "v1.1.0",
    date: "March 15, 2026",
    title: "Dynamic Persona Prompts",
    changes: [
      { type: "New", text: "Introduced 'clientCustomPrompt' parameter. You can now override the default AI persona per API request." },
      { type: "Improved", text: "Reduced average API response time from 12 seconds to 8 seconds through better load balancing." }
    ]
  },
  {
    version: "v1.0.0",
    date: "February 01, 2026",
    title: "Initial Public Launch",
    changes: [
      { type: "New", text: "FOSHT AI V1 API Engine is now live and available to the public." },
      { type: "New", text: "Launched the Developer Dashboard for API Key generation, Wallet management, and AI styling configuration." },
      { type: "New", text: "Integrated automated crypto payment verification via the blockchain." }
    ]
  }
];

// Komponen Badge Warna Warni untuk Jenis Pembaruan
const ChangeBadge = ({ type }: { type: string }) => {
  let colorClass = "bg-gray-500/20 text-gray-400 border-gray-500/20"; // Default
  if (type === "New") colorClass = "bg-green-500/20 text-green-400 border-green-500/20";
  if (type === "Improved") colorClass = "bg-blue-500/20 text-blue-400 border-blue-500/20";
  if (type === "Fixed") colorClass = "bg-yellow-500/20 text-yellow-400 border-yellow-500/20";

  return (
    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded border ${colorClass}`}>
      {type}
    </span>
  );
};

export default function ChangelogPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-orange-500 selection:text-white pb-24 overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute top-[5%] left-[50%] -translate-x-1/2 w-[60%] h-[30%] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32">
        
        {/* HEADER */}
        <div className="text-center mb-24 border-b border-white/10 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold mb-6 tracking-widest uppercase shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            Product Updates
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            Changelog.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            New features, API upgrades, and bug fixes. See what is new in the FOSHT AI ecosystem.
          </p>
        </div>

        {/* TIMELINE CONTENT */}
        <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-20 pb-12">
          
          {updates.map((update, index) => (
            <div key={index} className="relative pl-8 md:pl-16">
              
              {/* Timeline Dot (Glowing) */}
              <div className="absolute top-1 -left-[9px] w-4 h-4 rounded-full bg-[#050505] border-2 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
              
              {/* Date & Version */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                <span className="text-sm font-mono text-gray-500">{update.date}</span>
                <span className="hidden md:block w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="inline-flex items-center bg-white/5 border border-white/10 px-3 py-1 rounded-full text-orange-400 text-xs font-bold font-mono w-fit">
                  {update.version}
                </span>
              </div>
              
              {/* Update Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">{update.title}</h2>
              
              {/* List of Changes */}
              <div className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl hover:border-white/20 transition duration-300">
                <ul className="space-y-6">
                  {update.changes.map((change, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="mt-0.5 shrink-0">
                        <ChangeBadge type={change.type} />
                      </div>
                      <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                        {change.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              
            </div>
          ))}
          
        </div>

        {/* FOOTER ACTION */}
        <div className="mt-16 pt-12 border-t border-white/10 text-center">
          <Link href="/docs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition font-bold">
            ← View API Documentation
          </Link>
        </div>

      </div>
    </div>
  );
}