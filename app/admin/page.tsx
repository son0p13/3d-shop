// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Clock, ArrowRight, Plus } from 'lucide-react';

export default function AdminDashboard() {
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
        
        {/* HEADER & NÚT BẤM */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Tổng quan cửa hàng</h1>
            <p className="text-gray-500 mt-1">Xin chào Sếp! Đây là tình hình kinh doanh hôm nay.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Nút Quản lý sản phẩm (Đã thêm) */}
            <Link href="/admin/products" className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition shadow-sm">
               Quản lý kho
            </Link>
            <Link href="/admin/products/new" className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition shadow-sm">
              <Plus className="w-4 h-4" /> Đăng sản phẩm
            </Link>
            <Link href="/admin/orders" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md">
              Duyệt đơn ngay
            </Link>
          </div>
        </div>

        {/* 3 THẺ THỐNG KÊ (Dynamic) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Thẻ Doanh Thu */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Tổng Doanh Thu</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.totalRevenue.toLocaleString('vi-VN')} đ</h3>
            </div>
          </div>

          {/* Thẻ Tổng Đơn */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Tổng Đơn Hàng</p>
              <h3 className="text-3xl font-black text-gray-900">{stats.totalOrders} <span className="text-lg text-gray-500 font-medium">đơn</span></h3>
            </div>
          </div>

          {/* Thẻ Chờ Xác Nhận */}
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

        {/* BẢNG ĐƠN HÀNG MỚI NHẤT (Dynamic) */}
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
    </main>
  );
}