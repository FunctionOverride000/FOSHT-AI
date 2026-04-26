import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 md:pt-20 md:pb-24 text-center">
      <div className="inline-block border border-orange-500/30 bg-orange-500/10 text-orange-500 font-semibold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6">
        SaaS Agent AI v1.0
      </div>
      <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 text-white leading-[1.1]">
        Build Thousands of Blogs <br className="hidden md:block" />
        With Just <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">One API.</span>
      </h1>
      <p className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10">
        The FOSHT Proprietary AI Engine researches, writes, and generates SEO images automatically for your website in seconds.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="#pricing" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition text-lg">
          Start Automating
        </Link>
        <Link href="/docs" className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-full transition border border-gray-700 text-lg">
          Read Documentation
        </Link>
      </div>
    </section>
  );
}