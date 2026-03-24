'use client'; 

import Link from 'next/link';
import { ShoppingCart, Box, Menu, User, LogOut, LogIn, ShieldCheck, Package} from 'lucide-react'; 
import { useCartStore } from '@/store/cartStore'; 
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. KHU VỰC LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition">
              <Box className="w-8 h-8 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-gray-900">
              MIXI<span className="text-blue-600">3DS</span>
            </span>
          </Link>

          {/* 2. KHU VỰC NÚT BẤM BÊN PHẢI */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {status === "loading" ? (
              <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : session ? (
              // NHÓM 1: KHI ĐÃ ĐĂNG NHẬP (Admin + Hồ sơ + Đăng xuất)
              <div className="flex items-center gap-2 sm:gap-3 border-r border-gray-200 pr-4">
                
                {/* Nút Admin */}
                {(session.user as any)?.role === "admin" && (
                  <Link href="/admin" className="flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition mr-1">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="hidden md:inline">Quản Lý</span>
                  </Link>
                )}

                {/* Nút Hồ sơ cá nhân (MỚI THÊM VÀO ĐÂY) */}
                <Link 
                  href="/profile" 
                  className="p-2 text-gray-700 bg-gray-100 hover:bg-blue-100 hover:text-blue-600 rounded-full transition"
                  title="Thông tin tài khoản"
                >
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>

                {/* Nút Đăng xuất */}
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 text-gray-700 bg-red-50 hover:bg-red-100 hover:text-red-600 rounded-full transition"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            ) : (
              // NHÓM 2: KHI CHƯA ĐĂNG NHẬP (Chỉ hiện nút Đăng nhập)
              <div className="border-r border-gray-200 pr-4">
                <Link href="/login" className="flex items-center gap-2 p-2 text-gray-700 hover:text-blue-600 transition" title="Đăng nhập">
                  <div className="p-1 bg-gray-100 rounded-full hover:bg-blue-100 transition">
                    <User className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                </Link>
              </div>
            )}

            {/* LỊCH SỬ ĐƠN HÀNG */}
            <Link 
              href="/orders" 
              className="text-gray-600 hover:text-blue-600 transition-all flex items-center gap-1 group"
              title="Lịch sử đơn hàng"
            >
              <div className="relative p-2 bg-gray-100 rounded-full group-hover:bg-blue-100 transition">
                <Package className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="hidden sm:block font-semibold text-sm">Lịch sử</span>
            </Link>

            {/* GIỎ HÀNG */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition flex items-center gap-2 group">
              <div className="relative p-2 bg-gray-100 rounded-full group-hover:bg-blue-100 transition">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>

            {/* MENU ĐIỆN THOẠI */}
            <button className="md:hidden text-gray-700 p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}