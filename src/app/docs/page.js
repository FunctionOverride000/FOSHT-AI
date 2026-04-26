'use client';
import { useState } from 'react';
import Link from 'next/link';

// ==============================================================
// 1. KOMPONEN MINI (Dipecah agar tidak membuat lag halaman utama)
// ==============================================================

// Komponen Pembungkus Seksi
const DocSection = ({ title, children, id }: { title: string, children: React.ReactNode, id?: string }) => (
  <section id={id} className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 mb-8 shadow-lg hover:border-white/20 transition duration-300">
    <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4 text-white flex items-center gap-3">
      {title}
    </h2>
    {children}
  </section>
);

// Komponen Baris Tabel Parameter
const ParamRow = ({ name, type, req, desc }: { name: string, type: string, req: boolean, desc: React.ReactNode }) => (
  <tr className="border-b border-white/5 hover:bg-white/5 transition">
    <td className="py-4 px-4 font-mono text-orange-400 text-sm align-top">{name}</td>
    <td className="py-4 px-4 text-gray-400 text-sm align-top">{type}</td>
    <td className="py-4 px-4 text-sm align-top">
      {req 
        ? <span className="text-red-400 font-bold text-xs bg-red-400/10 px-2 py-1 rounded border border-red-500/20">Wajib</span> 
        : <span className="text-gray-500 text-xs bg-gray-800 px-2 py-1 rounded border border-gray-700">Opsional</span>
      }
    </td>
    <td className="py-4 px-4 text-gray-300 text-sm leading-relaxed">{desc}</td>
  </tr>
);

// Komponen Code Block yang Terisolasi (Hanya komponen ini yang re-render saat dicopy, bukan seluruh halaman)
const CodeBlock = ({ code, language = "json" }: { code: string, language?: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mt-4 mb-6">
      <div className="absolute right-3 top-3 z-10">
        <button 
          onClick={handleCopy}
          className={`text-xs font-bold py-1.5 px-3 rounded-md transition backdrop-blur-sm border ${
            copied 
              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
              : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
          }`}
        >
          {copied ? '✓ Tersalin!' : 'Copy Code'}
        </button>
      </div>
      <pre className="bg-[#0a0a0a] p-5 rounded-xl border border-white/10 overflow-x-auto text-sm text-gray-300 font-mono leading-loose relative">
        <code className={`language-${language}`}>{code.trim()}</code>
      </pre>
    </div>
  );
};


// ==============================================================
// 2. DATA STATIS (Ditaruh di luar komponen agar tidak membebani memori)
// ==============================================================

const SCRIPT_TEMPLATE = `
// ----------------------------------------------------
// FOSHT AI - SCRIPT INTEGRASI OTOMATIS (NODE.JS)
// ----------------------------------------------------

async function generateBlogArticle() {
  const API_KEY = "MASUKKAN_API_KEY_FOSHT_ANDA"; // Dapatkan dari Dashboard
  
  const payload = {
    topic: "Cara Mengalahkan Algoritma Google di 2026",
    keywords: "SEO, Algoritma Google, FOSHT AI",
    
    // Fitur Advanced: Bypass Otak AI & CSS dari Server Anda sendiri!
    // clientCustomPrompt: "Tulis dengan gaya bahasa santai dan gaul.",
    // clientCustomCss: "h1 { color: #f97316; font-family: 'Inter'; }"
  };

  try {
    console.log("Memulai koneksi ke mesin FOSHT AI...");
    
    const response = await fetch("https://fosht-ai.vercel.app/api/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${API_KEY}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {
      console.log("✅ ARTIKEL BERHASIL DIBUAT!");
      console.log("Lisensi Terpakai :", result.data.plan);
      console.log("URL Thumbnail    :", result.data.featuredImage);
      console.log("HTML Content     :", result.data.contentHtml.substring(0, 100) + "...");
      
      // -> Masukkan logika untuk menyimpan ke Database WordPress/CMS di sini <-
      
    } else {
      console.error("❌ Gagal:", result.error);
    }
  } catch (error) {
    console.error("⚠️ Koneksi jaringan terputus:", error);
  }
}

generateBlogArticle();
`;

const RESPONSE_TEMPLATE = `
{
  "success": true,
  "data": {
    "plan": "API Key Pro 1 Bulan",
    "featuredImage": "https://image.pollinations.ai/prompt/high%20resolution%20digital%20art...",
    "contentHtml": "<style>h1 { color: #f97316; }</style>\\n<div class='fosht-article'>\\n  <h1>Cara Mengalahkan Algoritma...</h1>\\n  <p>...</p>\\n</div>"
  }
}
`;


// ==============================================================
// 3. HALAMAN UTAMA (Sangat ringan karena logika UI sudah dipecah)
// ==============================================================

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-orange-500 selection:text-white pb-20 pt-10">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* NAVIGASI SAMPING (Sticky) */}
        <aside className="hidden lg:block col-span-1">
          <div className="sticky top-10 flex flex-col space-y-3 border-l border-white/10 pl-4">
            <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-xs">Daftar Isi</h3>
            <a href="#intro" className="text-sm text-gray-400 hover:text-orange-500 transition">Pengantar</a>
            <a href="#auth" className="text-sm text-gray-400 hover:text-orange-500 transition">1. Autentikasi</a>
            <a href="#endpoint" className="text-sm text-gray-400 hover:text-orange-500 transition">2. Endpoint & Parameter</a>
            <a href="#response" className="text-sm text-gray-400 hover:text-orange-500 transition">3. Format Balasan</a>
            <a href="#errors" className="text-sm text-gray-400 hover:text-orange-500 transition">4. Kode Kesalahan</a>
            <a href="#limits" className="text-sm text-gray-400 hover:text-orange-500 transition">5. Rate Limits</a>
            <a href="#snippet" className="text-sm font-bold text-orange-500 mt-4">Code Snippet Siap Pakai</a>
          </div>
        </aside>

        {/* KONTEN UTAMA */}
        <main className="col-span-1 lg:col-span-3">
          
          {/* HEADER & LOGO */}
          <div id="intro" className="flex flex-col items-start mb-12 border-b border-white/10 pb-8">
            <img src="/logo.png" alt="FOSHT AI Logo" className="h-12 mb-6 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Dokumentasi <span className="text-orange-500">Developer</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
              Panduan integrasi teknis <strong>FOSHT AI Headless Engine</strong>. Hubungkan kekuatan generasi artikel SEO otomatis dan gambar resolusi tinggi langsung ke dalam sistem Anda.
            </p>
          </div>

          <DocSection id="auth" title="🔑 1. Autentikasi (Authentication)">
            <p className="mb-4 leading-relaxed">
              FOSHT AI mengamankan akses menggunakan standar <strong>Bearer Token</strong>. Anda harus menyertakan API Key yang valid (didapatkan dari Dashboard) ke dalam Header setiap *request*.
            </p>
            <div className="bg-black p-4 rounded-xl border border-white/10 flex items-center gap-4 overflow-x-auto">
              <span className="text-gray-500 select-none font-mono text-sm">Headers</span>
              <code className="text-orange-400 font-mono text-sm whitespace-nowrap">Authorization: Bearer {'<'}API_KEY_ANDA{'>'}</code>
            </div>
            <p className="mt-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/20">
              <strong>Peringatan:</strong> Jangan pernah mempublikasikan API Key Anda di sisi klien (Frontend/Browser). Lakukan pemanggilan API selalu dari sisi Server (Node.js, PHP, Python) untuk mencegah pencurian kuota.
            </p>
          </DocSection>

          <DocSection id="endpoint" title="⚡ 2. Endpoint & Parameter Payload">
            <div className="flex items-center gap-4 mb-6 bg-black p-4 rounded-xl border border-white/10 overflow-x-auto">
              <span className="bg-green-500/20 text-green-400 font-bold px-3 py-1 rounded-md text-sm tracking-wider">POST</span>
              <code className="text-white font-mono font-bold whitespace-nowrap">https://fosht-ai.vercel.app/api/v1/generate</code>
            </div>
            
            <p className="mb-4 leading-relaxed">Kirimkan data konfigurasi konten dalam format JSON. Berikut adalah parameter yang didukung sistem kami:</p>
            
            <div className="overflow-x-auto border border-white/10 rounded-xl">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="py-3 px-4 text-white font-bold text-sm">Parameter</th>
                    <th className="py-3 px-4 text-white font-bold text-sm">Tipe</th>
                    <th className="py-3 px-4 text-white font-bold text-sm">Status</th>
                    <th className="py-3 px-4 text-white font-bold text-sm">Deskripsi & Penggunaan</th>
                  </tr>
                </thead>
                <tbody>
                  <ParamRow name="topic" type="string" req={true} desc="Topik utama atau judul artikel yang ingin ditulis oleh AI (Contoh: 'Strategi Marketing 2026')." />
                  <ParamRow name="keywords" type="string" req={false} desc="Kata kunci LSI/SEO yang dipisahkan dengan koma untuk disisipkan secara natural ke dalam artikel." />
                  <ParamRow name="clientCustomPrompt" type="string" req={false} desc={<span><strong>[Headless Mode]</strong> Timpa persona AI default. Berguna jika Anda ingin mengubah gaya bahasa (Misal: <i>"Tulis layaknya jurnalis Bloomberg"</i>). Jika kosong, sistem menggunakan pengaturan di Dashboard.</span>} />
                  <ParamRow name="clientCustomCss" type="string" req={false} desc={<span><strong>[Headless Mode]</strong> Masukkan kode CSS kustom murni (tanpa tag style) yang akan di-<i>inject</i> ke dalam hasil HTML.</span>} />
                </tbody>
              </table>
            </div>
          </DocSection>

          <DocSection id="response" title="📦 3. Format Balasan (Response)">
            <p className="mb-4 leading-relaxed">
              Respon dikembalikan dalam format JSON. Server secara otomatis membungkus artikel dalam div berkelas <code>fosht-article</code> dan menyuntikkan CSS Anda.
            </p>
            <CodeBlock code={RESPONSE_TEMPLATE} />
          </DocSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <DocSection id="errors" title="🛑 4. Kode Kesalahan">
              <ul className="space-y-4 mt-2">
                <li className="flex gap-4 items-start">
                  <span className="bg-red-500/20 text-red-400 font-bold px-2 py-1 rounded text-sm min-w-[3rem] text-center">400</span>
                  <p className="text-sm pt-0.5"><span className="text-white font-bold">Bad Request:</span> Parameter wajib (topic) kosong atau format JSON salah.</p>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="bg-orange-500/20 text-orange-400 font-bold px-2 py-1 rounded text-sm min-w-[3rem] text-center">401</span>
                  <p className="text-sm pt-0.5"><span className="text-white font-bold">Unauthorized:</span> API Key tidak terdaftar, diblokir, atau masa aktif lisensi telah habis.</p>
                </li>
                <li className="flex gap-4 items-start">
                  <span className="bg-gray-500/20 text-gray-400 font-bold px-2 py-1 rounded text-sm min-w-[3rem] text-center">500</span>
                  <p className="text-sm pt-0.5"><span className="text-white font-bold">Server Error:</span> Otak AI sedang sibuk atau sistem mengalami kelebihan beban.</p>
                </li>
              </ul>
            </DocSection>

            <DocSection id="limits" title="⏱️ 5. Rate Limits & Quota">
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-gray-400">Untuk menjaga stabilitas <i>Load Balancer</i> FOSHT, kami menerapkan pembatasan kecepatan pemrosesan:</p>
                <div className="bg-black border border-white/5 p-4 rounded-xl">
                  <h4 className="text-white font-bold mb-1">Standard Node</h4>
                  <p className="text-sm text-gray-400">Max 10 Request / Menit / IP</p>
                </div>
                <p className="text-sm text-orange-400">Panjang artikel (Word Limit) ditentukan otomatis berdasarkan jenis lisensi aktif (Plan) yang terikat pada API Key Anda (800 - 2000 kata).</p>
              </div>
            </DocSection>
          </div>

          <DocSection id="snippet" title="🚀 Template Script Siap Pakai (Node.js)">
            <p className="mb-4 leading-relaxed">
              Anda bisa langsung menyalin script <i>fetch</i> di bawah ini ke dalam sistem <i>backend</i> Anda (seperti Next.js API Routes, Express.js, atau sistem <i>Cron Job</i> WordPress).
            </p>
            <CodeBlock code={SCRIPT_TEMPLATE} language="javascript" />
          </DocSection>
          
          {/* FOOTER LINK */}
          <div className="text-center mt-16 mb-8 border-t border-white/10 pt-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-full font-bold transition">
              ← Kembali ke Control Dashboard
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}