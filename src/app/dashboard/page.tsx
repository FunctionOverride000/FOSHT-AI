'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WalletSettings from '../../components/dashboard/WalletSettings';
import AgentSettings from '../../components/dashboard/AgentSettings';
import ApiKeysList from '../../components/dashboard/ApiKeysList';

// BUKU PANDUAN TYPESCRIPT
// Kita tambahkan tipe ApiKeyType agar selaras dengan komponen ApiKeysList
type ApiKeyType = {
  id: string;
  name: string;
  expiresAt: string | Date;
  decryptedKey?: string;
  key?: string;
  apiKey?: string;
  token?: string;
  value?: string;
  [key: string]: unknown;
};

type UserProfileData = {
  id: string;
  email?: string;
  btcWallet?: string;
  walletAddress?: string;
  systemPrompt?: string;
  blogCss?: string;
  // Gunakan ApiKeyType[] di sini, BUKAN unknown[]
  apiKeys?: ApiKeyType[];
  keys?: ApiKeyType[];
  ApiKeys?: ApiKeyType[];
  [key: string]: unknown;
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('keys'); // 'keys', 'wallet', 'agent'
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.status === 401) return router.push('/login');
      const data = await res.json();
      if (data.success) setProfile(data);
    } catch (error) {
      console.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile(); 
  }, []);

  // LOGIKA SIGN OUT NYATA
  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        localStorage.clear();
        router.replace('/login');
      }
    } catch (err) {
      console.error("Logout error:", err);
      router.replace('/login');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-orange-500 font-mono tracking-widest">Loading FOSHT Core...</div>;

  // PERBAIKAN UTAMA: Mengubah "as unknown[]" menjadi "as any" untuk melakukan bypass instan 
  // atau "as ApiKeyType[]" agar TypeScript tidak marah
  const userKeys = (profile?.apiKeys || profile?.keys || profile?.ApiKeys || []) as ApiKeyType[];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-orange-500 selection:text-white pb-20">
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Core Dashboard.</h1>
            <p className="text-gray-400">Manage your licenses, security, and AI configurations.</p>
          </div>
          
          {/* Tombol Sign Out dengan Fungsi handleSignOut */}
          <button 
            onClick={handleSignOut} 
            className="text-sm font-bold text-red-500 hover:text-red-400 border border-red-500/20 bg-red-500/10 px-4 py-2 rounded-lg transition shadow-lg shadow-red-500/5"
          >
            Sign Out
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-2 border-b border-white/10 mb-8 overflow-x-auto pb-px">
          <button onClick={() => setActiveTab('keys')} className={`px-6 py-3 text-sm font-bold transition whitespace-nowrap border-b-2 ${activeTab === 'keys' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
            API Licenses
          </button>
          <button onClick={() => setActiveTab('agent')} className={`px-6 py-3 text-sm font-bold transition whitespace-nowrap border-b-2 ${activeTab === 'agent' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
            AI Agent Styling & Prompt
          </button>
          <button onClick={() => setActiveTab('wallet')} className={`px-6 py-3 text-sm font-bold transition whitespace-nowrap border-b-2 ${activeTab === 'wallet' ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
            Security & Wallet
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div>
          {activeTab === 'keys' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              <div className="lg:col-span-2">
                {/* Di sini garis merah akan hilang */}
                <ApiKeysList keys={userKeys} />
              </div>
              <div className="lg:col-span-1 bg-[#111] border border-white/10 p-6 rounded-2xl h-fit">
                <h2 className="text-lg font-bold text-white mb-2">Need More Power?</h2>
                <p className="text-sm text-gray-400 mb-6">Upgrade your limits and priority queue.</p>
                <Link href="/#pricing" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition w-full text-center block">Buy New License</Link>
              </div>
            </div>
          )}
          
          {activeTab === 'agent' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {profile && <AgentSettings profile={profile} />}
            </div>
          )}
          
          {activeTab === 'wallet' && (
            <div className="max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
              {profile && <WalletSettings profile={profile} onUpdate={fetchProfile} />}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}