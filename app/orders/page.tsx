'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Clock, ArrowLeft, LogIn } from 'lucide-react';
import { useSession } from 'next-auth/react'; // 
import { useRouter } from 'next/navigation';

export default function OrderHistoryPage() {
  const router = useRouter();
  
  const { data: session, status } = useSession(); 

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchOrders = async () => {
        try {
          const res = await fetch('/api/orders'); 
          const data = await res.json();
          if (data.success) {
            setOrders(data.orders);
          }
        } catch (error) {
          console.error("Lỗi tải đơn hàng:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    } else if (status === 'unauthenticated') {
      setIsLoading(false); 
    }
  }, [status]);

  if (status === 'loading' || (status === 'authenticated' && isLoading)) {
    return (
      <main className="min-h-screen bg-gray-50 flex justify-center py-32">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100 transform animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Vui lòng đăng nhập</h2>
          <p className="text-gray-500 mb-8 text-sm px-4">
            Bạn cần đăng nhập vào tài khoản để theo dõi lịch sử và trạng thái đơn hàng của mình.
          </p>
          <button
            onClick={() => router.push('/api/auth/signin')} 
            className="w-full bg-blue-600 text-white font-bold px-6 py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" /> Đăng nhập ngay
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="w-full text-gray-500 font-semibold px-6 py-4 mt-2 hover:bg-gray-50 rounded-xl transition-all"
          >
            Quay lại trang chủ
          </button>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition text-gray-600 hover:text-blue-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" /> Lịch sử đơn hàng
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100">
            <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty" className="w-32 h-32 mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-gray-500 mb-6">Bạn chưa thực hiện giao dịch nào trên Mixi3Ds.</p>
            <Link href="/" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-md">
              Đi mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                
                {/* Header của từng đơn hàng */}
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 uppercase">
                      <Clock className="w-3.5 h-3.5" /> {order.status}
                    </span>
                    <span className="text-sm text-gray-500 font-medium border-l border-gray-300 pl-3">
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Mã đơn: <span className="text-gray-900 font-bold uppercase">{order._id.slice(-6)}</span>
                  </div>
                </div>

                {/* Danh sách sản phẩm trong đơn */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg line-clamp-1">{item.name}</h4>
                          <p className="text-gray-500 text-sm mt-1">Số lượng: x{item.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900">
                          {item.price.toLocaleString('vi-VN')} đ
                        </p>
                      </div>
                    ))}
                  </div>

                  <hr className="border-gray-100 mb-4" />
                  
                  {/* Tổng kết tiền & Thông tin giao hàng */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl w-full md:w-auto">
                      <p><span className="font-semibold">Người nhận:</span> {order.customerInfo.fullName} ({order.customerInfo.phone})</p>
                      <p className="mt-1"><span className="font-semibold">Giao tới:</span> {order.customerInfo.address}</p>
                      <p className="mt-1"><span className="font-semibold">Thanh toán:</span> {order.paymentMethod === 'cod' ? 'Tiền mặt (COD)' : 'Chuyển khoản QR'}</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                      <span className="text-gray-600 font-medium">Thành tiền:</span>
                      <span className="text-2xl font-extrabold text-blue-600">
                        {order.totalAmount.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}