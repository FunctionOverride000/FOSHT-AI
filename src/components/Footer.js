export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 border-t border-gray-800 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-white tracking-tighter mb-2">FOSHT<span className="text-orange-500">.AI</span></h3>
          <p className="text-gray-500 text-sm">Decentralized SEO Blog Automation Agent.</p>
        </div>
        <div className="mt-6 md:mt-0 text-sm text-gray-500">
          &copy; {new Date().getFullYear()} FOSHT AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}