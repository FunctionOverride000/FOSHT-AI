import { QRCodeSVG } from 'qrcode.react'; 
import Link from 'next/link';

export default function CheckoutProcess({ step, order }) {
  if (step === 2 && order) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 w-full animate-in fade-in duration-500">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Complete Payment</h2>
          <p className="text-sm text-gray-400 mb-6 relative z-10">
            Please send exactly <strong className="text-orange-400 text-lg">{order.btcAmount} BTC</strong> to the address below:
          </p>
          
          <div className="bg-white p-4 rounded-2xl inline-block mb-6 relative z-10 shadow-lg">
            <QRCodeSVG value={`bitcoin:${order.btcAddress}?amount=${order.btcAmount}`}
              size={220}
              level={"H"} 
              imageSettings={{ src: "/fosht-logo.png", height: 48, width: 48, excavate: true }}
            />
          </div>
          
          <div className="bg-black/50 p-4 rounded-xl border border-gray-800 mb-6 relative z-10">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Bitcoin Address</p>
            <p className="font-mono text-sm text-orange-400 break-all select-all cursor-pointer">
              {order.btcAddress}
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-400 bg-gray-800/30 p-3 rounded-lg relative z-10 border border-gray-800">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-orange-500"></div>
            <p className="font-medium">Waiting for funds on the Blockchain...</p>
          </div>
          
          <p className="mt-6 text-[11px] text-gray-600 relative z-10">
            The system scans the network every 15 seconds. If successful, this page will update automatically.
          </p>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 w-full animate-in zoom-in duration-500">
        <div className="max-w-md w-full bg-gray-900 border border-green-500/30 rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 border border-green-500/50">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 relative z-10">Payment Verified!</h2>
          <p className="text-gray-400 mb-8 relative z-10 leading-relaxed">
            Your Bitcoin transaction has been validated. Your subscription license is now active.
          </p>
          
          <Link href="/dashboard" className="block w-full bg-white hover:bg-gray-200 text-black font-bold py-4 px-4 rounded-xl transition duration-200 relative z-10 shadow-lg shadow-white/10">
            View API Key in Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return null;
}