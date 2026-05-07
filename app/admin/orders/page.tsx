'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ArrowLeft, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

// 👉 BƯỚC A: IMPORT MẢNH GHÉP VÀO ĐÂY
import OrderDetailsModal from '@/components/OrderDetailsModal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 👉 BƯỚC B: STATE LƯU ĐƠN HÀNG ĐANG CHỌN (ĐÃ CÓ SẴN)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) {
        console.error("Lỗi tải dữ liệu từ Server");
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        alert('Cập nhật trạng thái thành công!');
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (error) {
      alert('Lỗi kết nối đến máy chủ!');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle className="w-4 h-4"/> Hoàn thành</span>;
      case 'Đang giao hàng': return <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold"><Truck className="w-4 h-4"/> Đang giao</span>;
      case 'Đã hủy': return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold"><XCircle className="w-4 h-4"/> Đã hủy</span>;
      default: return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold"><Clock className="w-4 h-4"/> Chờ xác nhận</span>;
    }
  };

  if (isLoading) return <div className="min-h-screen flex justify-center items-center bg-gray-50"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <main className="p-4 sm:p-8 bg-gray-50 min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-gray-50 rounded-full hover:bg-gray-200 transition">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Package className="text-blue-600" /> Quản Lý Đơn Hàng
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-1">
                Có tổng cộng {orders.length} đơn hàng trên hệ thống
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider font-bold">
                  <th className="p-5">Mã Đơn</th>
                  <th className="p-5">Khách Hàng</th>
                  <th className="p-5">Sản Phẩm</th>
                  <th className="p-5">Tổng Tiền</th>
                  <th className="p-5 text-center">Trạng Thái</th>
                  <th className="p-5 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-blue-50/50 transition duration-200">
                    <td className="p-5 font-bold text-gray-900">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="p-5">
                      <p className="font-bold text-gray-900">{order.customerInfo.fullName}</p>
                      <p className="text-xs text-gray-500">{order.customerInfo.phone}</p>
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-semibold text-gray-700 line-clamp-1">
                        {order.items.map((i: any) => i.name).join(', ')}
                      </p>
                      <p className="text-xs text-gray-500">{order.items.length} sản phẩm</p>
                    </td>
                    <td className="p-5 font-black text-blue-600">{order.totalAmount?.toLocaleString('vi-VN')} đ</td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center">{getStatusBadge(order.status)}</div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        {/* 👉 BƯỚC C: NÚT GỌI MẢNH GHÉP ĐÃ CÓ SẴN TRONG CODE CỦA SẾP */}
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm whitespace-nowrap"
                          title="Xem chi tiết đơn hàng"
                        >
                          Chi tiết
                        </button>
                        
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-semibold cursor-pointer outline-none"
                        >
                          <option value="Chờ xác nhận">Chờ xác nhận</option>
                          <option value="Đang giao hàng">Đang giao hàng</option>
                          <option value="Hoàn thành">Hoàn thành</option>
                          <option value="Đã hủy">Hủy đơn</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 👉 BƯỚC D: THẢ MẢNH GHÉP XUỐNG ĐÂY (Thay thế toàn bộ cụm Modal cũ) */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}

    </main>
  );
}