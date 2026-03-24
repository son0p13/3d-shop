'use client';

import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCartStore();

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <ShoppingBag className="w-16 h-16 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="text-gray-500 mb-8 max-w-md">Hãy quay lại trang chủ để khám phá thêm nhiều mô hình 3D độc đáo nhé!</p>
        <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-10">Giỏ Hàng Của Bạn</h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
          <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item._id} className="py-6 flex flex-col sm:flex-row gap-6">
                  {/* Thay vì load lại 3D nặng máy, ta dùng Icon hộp làm ảnh đại diện */}
                  <div className="w-24 h-24 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-8 h-8 text-blue-300" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-2">Chất liệu: <span className="font-medium text-gray-700">{item.material}</span></p>
                        <p className="text-sm text-gray-500">Kích thước: <span className="font-medium text-gray-700">{item.size}</span></p>
                      </div>
                      <p className="text-xl font-bold text-blue-600">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    
                    {/* Hàng nút bấm chức năng */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-2 text-gray-500 hover:text-blue-600 transition bg-gray-50 rounded-l-lg">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-gray-900">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2 text-gray-500 hover:text-blue-600 transition bg-gray-50 rounded-r-lg">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-white hover:bg-red-500 transition flex items-center gap-2 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg">
                        <Trash2 className="w-4 h-4" /> Bỏ sản phẩm
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* --- CỘT PHẢI: TÓM TẮT ĐƠN HÀNG --- */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Tóm tắt thanh toán</h2>
              
              <div className="space-y-4 mb-6 text-gray-600">
                <div className="flex justify-between">
                  <span>Tạm tính ({cart.reduce((acc, item) => acc + item.quantity, 0)} sản phẩm)</span>
                  <span className="font-medium text-gray-900">{totalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-bold text-green-500">Miễn phí</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-3xl font-extrabold text-blue-600">{totalAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <Link href="/checkout" className="w-full block text-center bg-gray-900 text-white font-bold rounded-xl text-lg px-5 py-4 mt-6 hover:bg-gray-800 transition-all shadow-md hover:shadow-lg">
  Thanh toán </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}