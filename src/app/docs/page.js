'use client';
import { useState } from 'react';

export default function DocsPage() {
  const [copied, setCopied] = useState(false);

  const templateCode = `
// ----------------------------------------------------
// FOSHT AI - SCRIPT INTEGRASI OTOMATIS (NODE.JS)
// ----------------------------------------------------

async function generateBlogArticle() {
  const API_KEY = "MASUKKAN_API_KEY_ANDA_DI_SINI"; // Dapatkan dari FOSHT Dashboard
  
  const payload = {
    topic: "Cara Mudah Investasi Kripto untuk Pemula di 2026",
    language: "Indonesia",
    keywords: "Investasi Kripto, Pemula, Bitcoin, FOSHT"
  };

  try {
    const response = await fetch("https://swakarsadigital.com/api/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${API_KEY}\`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {
      console.log("=== ARTIKEL BERHASIL DIBUAT ===");
      console.log("Gambar Thumbnail URL:", result.data.featuredImage);
      console.log("Isi HTML Artikel:", result.data.contentHtml);
      
      // Di sini Anda bisa mengarahkan data HTML ini langsung 
      // ke database WordPress atau CMS Anda menggunakan API mereka.
    } else {
      console.error("Gagal:", result.error);
    }
  } catch (error) {
    console.error("Terjadi masalah jaringan:", error);
  }
}

generateBlogArticle();
`;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black mb-4">Dokumentasi <span className="text-orange-500">API Agent</span></h1>
      <p className="text-gray-400 mb-12 text-lg">Panduan lengkap mengintegrasikan FOSHT AI ke dalam sistem manajemen konten (CMS) Anda.</p>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 mb-10">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-4">1. Autentikasi</h2>
        <p className="text-gray-400 mb-4 leading-relaxed">
          Semua permintaan ke API FOSHT memerlukan lisensi aktif. Anda harus menyertakan API Key yang valid dalam <i>Header</i> HTTP permintaan Anda menggunakan skema otorisasi Bearer.
        </p>
        <code className="block bg-black p-4 rounded-xl border border-gray-800 text-orange-400 font-mono text-sm">
          Authorization: Bearer {'<'}API_KEY_ANDA{'>'}
        </code>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 mb-10">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-4">2. Endpoint Utama</h2>
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-green-500/20 text-green-500 font-bold px-3 py-1 rounded-md text-sm">POST</span>
          <code className="text-gray-300 font-mono">/api/v1/generate</code>
        </div>
        <p className="text-gray-400 leading-relaxed">
          Endpoint ini akan memicu AI Engine kami untuk menulis artikel SEO secara penuh dan membuat gambar ilustrasi berkualitas tinggi berdasarkan parameter (Topik dan Keyword) yang Anda kirimkan.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
        <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-4">
          <h2 className="text-2xl font-bold">3. Template Script Siap Pakai</h2>
          <button 
            onClick={() => { navigator.clipboard.writeText(templateCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {copied ? 'Tersalin!' : 'Copy Script'}
          </button>
        </div>
        <p className="text-gray-400 mb-4 leading-relaxed">
          Gunakan script JavaScript/Node.js di bawah ini di server Anda. Cukup ganti variabel <code>API_KEY</code> dan sesuaikan data yang ingin di-<i>inject</i> ke WordPress/sistem Anda.
        </p>
        <pre className="bg-black p-6 rounded-xl border border-gray-800 overflow-x-auto text-sm text-gray-300 font-mono leading-loose">
          <code>{templateCode}</code>
        </pre>
      </div>
    </div>
  );
}