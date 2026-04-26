'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import komponen yang sudah kita pecah tadi
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import PricingSection from '../components/PricingSection';
import CheckoutProcess from '../components/CheckoutProcess';

// BUKU PANDUAN TYPESCRIPT (Menggantikan <any>)
type OrderData = {
  id: string;
  btcAmount?: number;
  btcAddress?: string;
  status?: string;
  [key: string]: unknown; // Mengizinkan properti tambahan jika ada
};

export default function LandingPage() {
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  
  // PERBAIKAN DI SINI: Mengganti <any> menjadi <OrderData | null>
  const [order, setOrder] = useState<OrderData | null>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userWallet, setUserWallet] = useState<string | null>(null); 
  const router = useRouter();

  // Logika Cek Login
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.success) { 
          setIsLoggedIn(true); 
          setUserId(data.userId); 
          setUserWallet(data.btcWallet); 
        }
      } catch (e) {}
    };
    checkLogin();
  }, []);

  // Logika Scanner Blockchain
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (step === 2 && order && order.id) {
      interval = setInterval(async () => {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id })
        });
        const data = await res.json();
        if (data.status === 'CONFIRMED') { 
          setStep(3); 
          clearInterval(interval); 
        }
      }, 15000); 
    }
    return () => clearInterval(interval);
  }, [step, order]);

  // Logika Tombol Beli
  // PERBAIKAN DI SINI: Memberi tipe yang lebih aman untuk parameter 'plan'
  const handleBuy = async (plan: { id: string | number; [key: string]: unknown }) => {
    if (!isLoggedIn) { 
      router.push('/login'); 
      return; 
    }
    if (!userWallet) { 
      alert("IMPORTANT: Please register your Bitcoin Wallet in the Dashboard first!"); 
      router.push('/dashboard'); 
      return; 
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, planType: plan.id })
      });
      const data = await res.json();
      
      if (data.success) { 
        setOrder(data.order); 
        setStep(2); 
      } else { 
        alert('Error: ' + data.error); 
      }
    } catch (err) { 
      alert('Network error.'); 
    }
    setLoading(false);
  };

  // RENDER UI
  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen text-white font-sans">
      {/* Tampilkan Proses Checkout jika step > 1 */}
      {step > 1 ? (
        <CheckoutProcess step={step} order={order} />
      ) : (
        /* Tampilkan Landing Page Normal jika step === 1 */
        <>
          <HeroSection />
          <FeatureSection />
          <PricingSection handleBuy={handleBuy} loading={loading} />
        </>
      )}
    </div>
  );
}