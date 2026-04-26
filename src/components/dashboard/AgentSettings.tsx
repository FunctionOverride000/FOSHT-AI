import { useState } from 'react';

export default function AgentSettings({ profile }: { profile: any }) {
  const defaultPrompt = "You are an expert Tech Journalist. Write highly engaging, factual, and professional SEO content.";
  const defaultCss = "h1 { color: #f97316; font-size: 2.2em; font-weight: 900; margin-bottom: 0.5em; }\nh2 { color: #ffffff; font-size: 1.5em; margin-top: 1.5em; border-bottom: 2px solid #f97316; padding-bottom: 0.2em; }\np { color: #d1d5db; line-height: 1.8; margin-bottom: 1em; }\nul { color: #d1d5db; margin-left: 1.5em; list-style-type: disc; }";

  const [prompt, setPrompt] = useState(profile?.systemPrompt || defaultPrompt);
  const [cssCode, setCssCode] = useState(profile?.blogCss || defaultCss);
  const [saving, setSaving] = useState(false);
  
  // State untuk Input Topik Preview yang baru
  const [previewTopic, setPreviewTopic] = useState("Cara Budidaya Ikan Cupang"); 
  const [previewHtml, setPreviewHtml] = useState("<h1>Preview Mode</h1><p>Ketik topik uji coba di bawah, lalu klik 'Generate Live Preview'.</p>");
  const [generating, setGenerating] = useState(false);

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile/update-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id, systemPrompt: prompt, blogCss: cssCode })
      });
      const data = await res.json();
      if (data.success) alert('Success: AI Agent configurations permanently saved to Database!');
      else alert('Error saving configurations.');
    } catch (e) { alert('Network Error'); }
    setSaving(false);
  };

  const handleTestPreview = async () => {
    setGenerating(true);
    setPreviewHtml("<p class='animate-pulse text-orange-500 font-sans'>FOSHT Agent sedang meriset topik Anda...</p>");
    try {
      const res = await fetch('/api/profile/test-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Kirim Topik ke Mesin API!
        body: JSON.stringify({ systemPrompt: prompt, testTopic: previewTopic }) 
      });
      
      const textResponse = await res.text(); 
      try {
        const data = JSON.parse(textResponse);
        if (data.success) setPreviewHtml(data.html);
        else setPreviewHtml(`<p class='text-red-500 font-sans'>API Error: ${data.error}</p>`);
      } catch (parseError) {
        setPreviewHtml(`<p class='text-red-500 font-sans'>Server Crash (Status: ${res.status}). Cek Terminal.</p>`);
      }
    } catch (e) {
      setPreviewHtml("<p class='text-red-500 font-sans'>Koneksi Internet Terputus.</p>");
    }
    setGenerating(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Kolom Kiri */}
      <div className="bg-[#111] border border-white/10 p-6 rounded-2xl shadow-lg space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">AI Agent Persona</h2>
          <textarea 
            value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={4}
            className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-orange-500 outline-none font-mono transition"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">Custom HTML/CSS Styling</h2>
          <textarea 
            value={cssCode} onChange={(e) => setCssCode(e.target.value)} rows={6}
            className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-green-400 focus:border-orange-500 outline-none font-mono transition"
          />
        </div>

        {/* KOLOM INPUT TOPIK UJI COBA BARU */}
        <div className="bg-black/50 p-4 rounded-xl border border-white/5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Topik Uji Coba</label>
          <input 
            type="text" 
            value={previewTopic} 
            onChange={(e) => setPreviewTopic(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-orange-500 outline-none transition mb-4"
            placeholder="Misal: Mobil Listrik, Bisnis Kopi..."
          />
          
          <div className="flex gap-4">
            <button 
              onClick={handleTestPreview} disabled={generating || !previewTopic}
              className="w-1/2 bg-transparent border border-orange-500 text-orange-500 hover:bg-orange-500/10 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generating ? 'Menganalisis...' : '⚡ Generate Preview'}
            </button>
            
            <button 
              onClick={handleSaveConfig} disabled={saving}
              className="w-1/2 bg-white hover:bg-gray-200 text-black font-bold py-3.5 rounded-xl transition"
            >
              {saving ? 'Menyimpan...' : 'Save Agent Config'}
            </button>
          </div>
        </div>
      </div>

      {/* Kolom Kanan */}
      <div className="bg-black border border-dashed border-white/20 p-6 rounded-2xl relative overflow-hidden flex flex-col h-full min-h-[500px]">
        <div className="absolute top-0 right-0 bg-white/10 text-white text-[10px] uppercase px-3 py-1 rounded-bl-xl font-bold tracking-widest z-10">
          Live Render Preview
        </div>
        
        <div className="preview-container bg-[#0a0a0a] border border-white/5 p-6 rounded-xl overflow-y-auto flex-grow relative">
          <style dangerouslySetInnerHTML={{ __html: `.preview-wrapper { ${cssCode} }` }} />
          <div 
            className="preview-wrapper text-gray-300" 
            dangerouslySetInnerHTML={{ __html: previewHtml }} 
          />
        </div>
      </div>
    </div>
  );
}