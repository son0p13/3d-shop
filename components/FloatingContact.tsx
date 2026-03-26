'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, Facebook } from 'lucide-react';
import Link from 'next/link';

export default function FloatingContact() {
  const [showPhone, setShowPhone] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      <div className="relative flex items-center justify-end">
        {showPhone && (
          <div className="absolute right-16 bg-white text-gray-900 font-black text-lg px-5 py-2.5 rounded-2xl shadow-xl border border-gray-100 whitespace-nowrap animate-in slide-in-from-right-4 fade-in duration-200">
            0912.382.282
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-y-8 border-y-transparent border-l-8 border-l-white"></div>
          </div>
        )}
        
        <button
          onClick={() => setShowPhone(!showPhone)}
          className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all hover:scale-110 relative"
        >
          <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-20"></div>
          <Phone className="w-6 h-6 animate-pulse" />
        </button>
      </div>
      <Link
        href="https://zalo.me/0836958396"
        target="_blank"
        className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-transform hover:scale-110 font-black text-sm"
      >
        Zalo
      </Link>
      <Link
        href="https://www.facebook.com/son.hoangtuan.1042" 
        target="_blank"
        className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-transform hover:scale-110"
      >
        <Facebook className="w-7 h-7" />
      </Link>

    </div>
  );
}