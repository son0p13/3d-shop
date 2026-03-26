'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom'; 

export default function AddToCartButton({ product }: { product: any }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false); 
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    addToCart({
      _id: product._id?.toString() || product._id,
      name: product.name,
      price: product.basePrice || 0, 
      image: product.image || "https://placehold.co/400x400/png?text=No+Image",
      quantity: 1
    });
    
    setShowModal(true);

    setTimeout(() => {
      setShowModal(false);
    }, 3000);
  };

  const closeModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
  };

  const goToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/cart');
  };

  return (
    <>
      <button 
        onClick={handleAdd}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-lg transition-all shadow-md flex items-center gap-1.5 transform hover:-translate-y-1"
      >
        <ShoppingCart className="w-4 h-4" />
        <span className="text-sm">Thêm ngay</span>
      </button>

      {showModal && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={closeModal} 
        >
          <div 
            className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 transform animate-in fade-in zoom-in duration-200" 
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex flex-col items-center text-center">
              
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thành công!</h3>
              <p className="text-gray-600 mb-6">
                Đã thêm <span className="font-bold text-blue-600">"{product.name}"</span> vào giỏ hàng.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
                >
                  Tiếp tục mua
                </button>
                
                <button 
                  onClick={goToCart}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center"
                >
                  Xem giỏ hàng
                </button>
              </div>

            </div>
          </div>
        </div>,
        document.body 
      )}
    </>
  );
}