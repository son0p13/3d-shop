'use client';

import { X, Package, MapPin, CreditCard, Calendar, Phone, User, Tag } from 'lucide-react';

export default function OrderDetailsModal({ order, onClose }: { order: any, onClose: () => void }) {
  if (!order) return null;

  // Tính lại tiền hàng (Subtotal)
  const subtotal = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const shippingFee = 30000; // Phí ship mặc định như sếp đã cài
  const discountAmount = subtotal + shippingFee - order.totalAmount; // Tính nhẩm ra số tiền đã được giảm

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* HEADER CỦA CỬA SỔ */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" /> Chi Tiết Đơn Hàng
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Mã đơn: <span className="text-gray-900 uppercase">#{order._id.slice(-8)}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NỘI DUNG CHI TIẾT (Có thể cuộn) */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          
          {/* Lưới thông tin: Trạng thái & Khách hàng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
              <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">Thông tin chung</h3>
              <p className="flex justify-between text-sm"><span className="text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4"/> Ngày đặt:</span> <span className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleString('vi-VN')}</span></p>
              <p className="flex justify-between text-sm"><span className="text-gray-500 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Thanh toán:</span> <span className="font-semibold text-gray-900">{order.paymentMethod === 'cod' ? 'Tiền mặt (COD)' : 'Chuyển khoản QR'}</span></p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Tag className="w-4 h-4"/> Trạng thái:</span> 
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
                  order.status === 'Đã hủy' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>{order.status}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3">
              <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">Khách hàng & Giao hàng</h3>
              <p className="flex text-sm"><span className="text-gray-500 w-8"><User className="w-4 h-4"/></span> <span className="font-semibold text-gray-900">{order.customerInfo?.fullName || order.userEmail}</span></p>
              <p className="flex text-sm"><span className="text-gray-500 w-8"><Phone className="w-4 h-4"/></span> <span className="font-semibold text-gray-900">{order.customerInfo?.phone || 'Không có sđt'}</span></p>
              <p className="flex text-sm"><span className="text-gray-500 w-8 flex-shrink-0"><MapPin className="w-4 h-4"/></span> <span className="font-semibold text-gray-900 line-clamp-2">{order.customerInfo?.address || 'Không có địa chỉ'}</span></p>
              {order.customerInfo?.note && (
                <p className="flex text-sm"><span className="text-gray-500 w-8 flex-shrink-0">📝</span> <span className="italic text-gray-600">{order.customerInfo.note}</span></p>
              )}
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Danh sách sản phẩm</h3>
            <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50 bg-white">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-gray-100" />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">Số lượng: {item.quantity}</p>
                  </div>
                  <p className="font-black text-blue-600">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng kết tiền */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính hàng hóa</span>
                <span className="font-semibold text-gray-900">{subtotal.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-gray-900">{shippingFee.toLocaleString('vi-VN')} đ</span>
              </div>
              
              {/* Hiển thị Mã giảm giá nếu đơn này có áp mã */}
              {(discountAmount > 0 || order.appliedCoupon) && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span className="flex items-center gap-1">
                    Mã giảm giá {order.appliedCoupon ? `(${order.appliedCoupon})` : ''}
                  </span>
                  <span>- {discountAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              )}
              
              <div className="pt-4 border-t border-blue-200 flex justify-between items-center mt-4">
                <span className="text-lg font-black text-gray-900">Tổng thanh toán</span>
                <span className="text-3xl font-black text-blue-600">{order.totalAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}