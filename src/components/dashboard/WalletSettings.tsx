'use client';
import { useState } from 'react';

// INI ADALAH BAGIAN YANG KURANG SEBELUMNYA (Buku Panduan TypeScript)
// Tanpa ini, kata 'UserProfile' di bawah akan tetap bergaris merah.
type UserProfile = {
  email?: string;
  btcWallet?: string;
  walletAddress?: string;
  [key: string]: unknown;
};

// FUNGSI UTAMA KOMPONEN
export default function WalletSettings({ profile, onUpdate }: { profile: UserProfile, onUpdate: () => void }) {
  const [wallet, setWallet] = useState(profile?.btcWallet || profile?.walletAddress || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!wallet || !password) {
      alert('Error: Wallet address and Password are required.');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/profile/update-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Pastikan kurir mengirimkan nama payload 'wallet', bukan 'newWallet'
        body: JSON.stringify({ wallet: wallet, password: password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert('✅ Success: Bitcoin wallet securely updated.');
        setPassword(''); // Kosongkan password demi keamanan
        onUpdate(); // Panggil ulang data profil terbaru
      } else {
        alert('Security Error: ' + data.error);
      }
    } catch (err) {
      alert('Network Error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111] border border-white/10 p-6 md:p-8 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Account & Security</h2>
      
      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Registered Email</label>
        <div className="bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-gray-300 font-medium">
          {profile?.email || 'Loading...'}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bitcoin Payout Wallet</label>
        <input 
          type="text" 
          value={wallet} 
          onChange={(e) => setWallet(e.target.value)}
          placeholder="bc1q..."
          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-orange-500 transition"
        />
      </div>

      <div className="mb-8">
        <label className="block text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">Current Password (Required)</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password to authorize changes"
          className="w-full bg-black border border-orange-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition"
        />
      </div>

      <button 
        onClick={handleSave}
        disabled={loading || !wallet || !password}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition disabled:opacity-50"
      >
        {loading ? 'Verifying & Saving...' : 'Securely Update Wallet'}
      </button>
    </div>
  );
}