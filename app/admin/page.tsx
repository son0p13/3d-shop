'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Clock, ArrowRight, Plus, Tag, LayoutDashboard } from 'lucide-react';
import CouponManager from '@/components/CouponManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: [] as any[]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        }
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center bg-gray-50"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <main className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & NÚT HÀNH ĐỘNG */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Trung tâm quản lý</h1>
            <p className="text-gray-500 mt-1">Xin chào Sếp! Đây là tình hình kinh doanh hôm nay.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/admin/products" className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition shadow-sm">
               Quản lý kho
            </Link>
            <Link href="/admin/products/new" className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition shadow-sm">
              <Plus className="w-4 h-4" /> Đăng sản phẩm
            </Link>
            <button onClick={() => setActiveTab('coupons')} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-100 transition shadow-sm">
              <Tag className="w-4 h-4" /> Tạo Mã Giảm Giá
            </button>
            <Link href="/admin/orders" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md">
              Duyệt đơn ngay
            </Link>
          </div>
        </div>

        {/* 👉 THANH CHUYỂN TAB (TỔNG QUAN / MÃ GIẢM GIÁ) */}
        <div className="flex gap-2 border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'overview' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> TỔNG QUAN DOANH THU
          </button>
          <button 
            onClick={() => setActiveTab('coupons')}
            className={`px-6 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'coupons' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Tag className="w-4 h-4" /> QUẢN LÝ MÃ GIẢM GIÁ
          </button>
        </div>

        {/* ================= NỘI DUNG HIỂN THỊ DỰA TRÊN TAB ĐANG CHỌN ================= */}

        {/* TAB 1: TỔNG QUAN (GIỮ NGUYÊN CODE CŨ CỦA SẾP) */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
                  <DollarSign className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Tổng Doanh Thu</p>
                  <h3 className="text-3xl font-black text-gray-900">{stats.totalRevenue.toLocaleString('vi-VN')} đ</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Tổng Đơn Hàng</p>
                  <h3 className="text-3xl font-black text-gray-900">{stats.totalOrders} <span className="text-lg text-gray-500 font-medium">đơn</span></h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Chờ Xác Nhận</p>
                  <h3 className="text-3xl font-black text-gray-900">{stats.pendingOrders} <span className="text-lg text-gray-500 font-medium">đơn</span></h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                <h2 className="text-xl font-extrabold text-gray-900">Đơn hàng mới nhất</h2>
                <Link href="/admin/orders" className="text-blue-600 font-bold flex items-center gap-1 hover:underline">
                  Xem tất cả <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-400 text-sm border-b border-gray-50">
                      <th className="pb-4 font-bold">Mã Đơn</th>
                      <th className="pb-4 font-bold">Khách Hàng</th>
                      <th className="pb-4 font-bold">Thành Tiền</th>
                      <th className="pb-4 font-bold">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentOrders.length === 0 ? (
                      <tr><td colSpan={4} className="py-6 text-center text-gray-500">Chưa có đơn hàng nào</td></tr>
                    ) : (
                      stats.recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition">
                          <td className="py-4 font-bold text-gray-900">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="py-4">
                            <p className="font-bold text-gray-800">{order.customerInfo?.fullName || 'Khách'}</p>
                            <p className="text-xs text-gray-500">{order.customerInfo?.phone || ''}</p>
                          </td>
                          <td className="py-4 font-bold text-blue-600">{order.totalAmount?.toLocaleString('vi-VN')} đ</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              order.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
                              order.status === 'Đã hủy' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <CouponManager />
             </div>
          </div>
        )}

      </div>
    </main>
  );
}