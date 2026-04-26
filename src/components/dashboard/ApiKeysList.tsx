export default function ApiKeysList({ keys }: { keys: any[] }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('API Key copied to clipboard!');
  };

  if (!keys || keys.length === 0) {
    return (
      <div className="border border-dashed border-white/10 rounded-xl p-10 text-center flex flex-col items-center justify-center">
        <span className="text-4xl mb-3 opacity-50">🔑</span>
        <p className="text-gray-500">You don't have any active API Keys yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {keys.map((keyObj: unknown) => {
        const isExpired = new Date(keyObj.expiresAt) < new Date();
        // Jaring penangkap nama variabel dari database agar tidak kosong
        const rawKey = keyObj.decryptedKey || keyObj.key || keyObj.apiKey || keyObj.token || keyObj.value;

        return (
          <div key={keyObj.id} className={`p-5 rounded-xl border ${isExpired ? 'bg-red-500/5 border-red-500/20' : 'bg-[#111] border-white/10 shadow-lg'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white text-lg">{keyObj.name}</h3>
                  {isExpired ? (
                    <span className="bg-red-500/20 text-red-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Expired</span>
                  ) : (
                    <span className="bg-green-500/20 text-green-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Active</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Expires: {new Date(keyObj.expiresAt).toLocaleDateString('en-US')}
                </p>
              </div>
              
              <button 
                onClick={() => copyToClipboard(rawKey)}
                disabled={isExpired}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                Copy Key
              </button>
            </div>
            
            <div className="bg-black p-3 rounded-lg border border-white/5">
              <code className={`font-mono text-sm break-all ${isExpired ? 'text-gray-600' : 'text-orange-400'}`}>
                {isExpired ? '************************ (Key Expired)' : (rawKey || "Menunggu Sinkronisasi...")}
              </code>
            </div>
          </div>
        );
      })}
    </div>
  );
}