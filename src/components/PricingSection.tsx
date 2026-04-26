export default function PricingSection({ handleBuy, loading }) {
  const plans = [
    { 
      id: '1_MONTH', name: 'Starter', duration: '1 Month', price: process.env.NEXT_PUBLIC_PRICE_1_MONTH || 10,
      features: ['Short Articles (Max 800 Words)', 'SD Image Resolution (512x512)', 'Standard API Queue', 'Community Support']
    },
    { 
      id: '3_MONTHS', name: 'Pro', duration: '3 Months', price: process.env.NEXT_PUBLIC_PRICE_3_MONTHS || 25, popular: true,
      features: ['Mid-length SEO Articles (Max 2000 Words)', 'HD Image Resolution (1024x1024)', 'Priority Rendering', 'Priority Email Support']
    },
    { 
      id: '1_YEAR', name: 'Enterprise', duration: '1 Year', price: process.env.NEXT_PUBLIC_PRICE_1_YEAR || 80,
      features: ['In-depth Pillar Articles (Max 4000 Words)', 'Ultra HD Images (1024x1024)', 'Zero Server Queue', 'Dedicated VIP 24/7 Support']
    },
  ];

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-24 text-center">
      <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">Transparent Pricing.</h2>
      <p className="text-gray-400 text-lg mb-16">Choose an API license plan tailored to your volume requirements.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
           <div key={plan.id} className={`bg-gray-900 p-8 rounded-3xl border flex flex-col ${plan.popular ? 'border-orange-500' : 'border-gray-800'} relative overflow-hidden group text-left`}>
             {plan.popular && <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">Most Popular</div>}
             
             <h3 className="text-xl font-bold text-gray-400 mb-2">{plan.name}</h3>
             <div className="text-5xl font-black text-white mb-1">${plan.price}</div>
             <div className="text-sm text-gray-500 mb-8 border-b border-gray-800 pb-6">{plan.duration} Full Access</div>
             
             <ul className="space-y-4 mb-8 flex-grow">
               {plan.features.map((feature, index) => (
                 <li key={index} className="flex items-center text-sm text-gray-300">
                   <span className="text-orange-500 mr-3">✓</span> {feature}
                 </li>
               ))}
             </ul>

             <button onClick={() => handleBuy(plan)} disabled={loading} className={`w-full py-4 rounded-2xl font-bold transition mt-auto ${plan.popular ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}>
                {loading ? 'Processing...' : `Select ${plan.name} Plan`}
             </button>
           </div>
        ))}
      </div>
    </section>
  );
}