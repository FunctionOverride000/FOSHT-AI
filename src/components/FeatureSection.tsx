export default function FeatureSection() {
  return (
    <section className="border-y border-gray-800 bg-gray-900/50 py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="w-14 h-14 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-6">✍️</div>
          <h3 className="text-2xl font-bold mb-3 text-white">SEO Native Writer</h3>
          <p className="text-gray-400 leading-relaxed">Our AI Agent is heavily constrained to comply with the latest SEO guidelines. H2, H3 structures, and keyword distributions are automatically optimized.</p>
        </div>
        <div>
          <div className="w-14 h-14 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-6">🖼️</div>
          <h3 className="text-2xl font-bold mb-3 text-white">Auto Image Generation</h3>
          <p className="text-gray-400 leading-relaxed">A single API request returns the complete package: high-quality articles alongside relevant, copyright-free exclusive imagery.</p>
        </div>
        <div>
          <div className="w-14 h-14 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-6">⛓️</div>
          <h3 className="text-2xl font-bold mb-3 text-white">Decentralized Billing</h3>
          <p className="text-gray-400 leading-relaxed">API license payments are 100% processed via the Peer-to-Peer Bitcoin network. Maximum privacy, instant, and free from third-party cuts.</p>
        </div>
      </div>
    </section>
  );
}