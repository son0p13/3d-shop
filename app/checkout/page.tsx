'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Phone, User, CreditCard, ArrowLeft, Truck, CheckCircle2, QrCode, Banknote, ChevronLeft, Tag } from 'lucide-react';
import { useSession } from 'next-auth/react'; 

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { data: session } = useSession(); 
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });
  
  const [phoneError, setPhoneError] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');
  const [couponMessage, setCouponMessage] = useState({ text: '', isError: false });
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = 30000; 
  const finalTotal = subtotal + shippingFee - discountAmount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'phone') {
      const numericValue = e.target.value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, phone: numericValue });
      setPhoneError(''); 
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setPhoneError('Vui lòng nhập đúng số điện thoại (10 chữ số, bắt đầu bằng số 0)');
      return; 
    }
    setStep(2);
  };

const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    setCouponMessage({ text: '', isError: false });

    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderTotal: subtotal }) 
      });

      // 👉 ĐÃ NÂNG CẤP: Nếu có lỗi, cố gắng đọc tin nhắn của Backend trước
      if (!res.ok) {
        try {
          const errorData = await res.json();
          // Nếu Backend có gửi lời nhắn (VD: "Mã không tồn tại", "Hết hạn"), thì hiện lời nhắn đó ra
          setCouponMessage({ text: errorData.message || "Mã không hợp lệ", isError: true });
        } catch (e) {
          // Nếu sập hẳn không có tin nhắn gì, mới báo lỗi đường dẫn API
          setCouponMessage({ text: `Lỗi Server: Mã ${res.status}. Sếp check lại Terminal!`, isError: true });
        }
        setIsApplyingCoupon(false);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setDiscountAmount(data.discountAmount);
        setAppliedCode(data.couponCode);
        setCouponMessage({ text: data.message, isError: false });
        setCouponCode(''); 
      } else {
        setCouponMessage({ text: data.message, isError: true });
        setDiscountAmount(0);
        setAppliedCode('');
      }
    } catch (error) {
      setCouponMessage({ text: 'Lỗi mạng hoặc Server chưa bật (Check Terminal)', isError: true });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setDiscountAmount(0);
    setAppliedCode('');
    setCouponMessage({ text: 'Đã gỡ mã giảm giá', isError: false });
  };

  const handleFinalCheckout = async () => {
    setIsSubmitting(true);
    
    try {
      const orderPayload = {
        customerInfo: {
          ...formData,
          email: session?.user?.email || "",
        },
        items: cart,
        totalAmount: finalTotal,
        paymentMethod: paymentMethod,
        appliedCoupon: appliedCode || null 
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();
      if (data.success) {
        setIsSubmitting(false);
        setShowSuccessModal(true); 
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại!");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Lỗi gửi đơn:", error);
      alert("Lỗi kết nối đến máy chủ!");
      setIsSubmitting(false);
    }
  };

  const handleCloseAndRedirect = () => {
    setShowSuccessModal(false);
    clearCart();
    router.push('/');
  };

  if (!mounted || cart.length === 0) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {step === 1 ? (
          <Link href="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-8 transition">
            <ArrowLeft className="w-5 h-5" /> Quay lại giỏ hàng
          </Link>
        ) : (
          <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-8 transition">
            <ChevronLeft className="w-5 h-5" /> Quay lại thông tin giao hàng
          </button>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="text-blue-600" /> Thông tin giao hàng
                </h2>
                
                <form onSubmit={handleNextStep} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                        <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className={`h-5 w-5 ${phoneError ? 'text-red-400' : 'text-gray-400'}`} />
                        </div>
                        <input 
                          required 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          maxLength={10} 
                          className={`pl-10 w-full bg-gray-50 border rounded-xl block p-3 outline-none transition-all ${
                            phoneError 
                              ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                              : 'border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500'
                          }`} 
                        />
                      </div>
                      {phoneError && (
                        <p className="text-red-500 text-xs font-semibold mt-1.5 animate-in fade-in">{phoneError}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ nhận hàng chi tiết</label>
                    <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú (Tùy chọn)</label>
                    <textarea name="note" value={formData.note} onChange={handleChange} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3" />
                  </div>

                  <button type="submit" className="w-full text-white font-bold rounded-xl text-lg px-5 py-4 text-center bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg">
                    Tiếp tục đến Phương thức thanh toán <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="text-blue-600" /> Phương thức thanh toán
                </h2>

                <div className="space-y-4 mb-8">
                  <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-5 h-5 text-blue-600" />
                      <Banknote className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className={`font-bold ${paymentMethod === 'cod' ? 'text-blue-900' : 'text-gray-700'}`}>Thanh toán khi nhận hàng (COD)</span>
                    </div>
                  </label>

                  <label className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === 'qr' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <input type="radio" name="payment" value="qr" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} className="w-5 h-5 text-blue-600" />
                      <QrCode className={`w-6 h-6 ${paymentMethod === 'qr' ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className={`font-bold ${paymentMethod === 'qr' ? 'text-blue-900' : 'text-gray-700'}`}>Chuyển khoản qua mã QR</span>
                    </div>
                    {paymentMethod === 'qr' && (
                      <div className="mt-4 pl-8 animate-in fade-in zoom-in duration-300">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 inline-block shadow-sm">
                          <img src={`https://img.vietqr.io/image/mbbank-0836958396-compact2.png?amount=${finalTotal}&addInfo=Thanh toan don hang Mixi3Ds&accountName=HOANG TUAN SON`} alt="QR Code" className="w-100 h-100 object-contain" />
                          <p className="text-sm text-center font-semibold text-gray-600 mt-2">Quét mã bằng App Ngân Hàng</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                <button 
                  onClick={handleFinalCheckout}
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold rounded-xl text-lg px-5 py-4 text-center transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 transform hover:-translate-y-1'}`}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-6 h-6" /> Xác nhận Đặt Hàng
                    </>
                  )}
                </button>
              </div>
            )}

          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cart.map((item: any) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-blue-600">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                ))}
              </div>

              <hr className="border-gray-100 mb-6" />

              {/* 👉 ĐÃ CẬP NHẬT: GIAO DIỆN LỖI Ô NHẬP MÃ GIẢM GIÁ */}
              <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" /> Mã giảm giá
                </h3>

                {!appliedCode ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode} 
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        // 👉 Tự động xóa trạng thái lỗi khi khách bắt đầu gõ lại
                        if (couponMessage.isError) {
                          setCouponMessage({ text: '', isError: false });
                        }
                      }}
                      placeholder="Nhập mã giảm giá" 
                      className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 outline-none uppercase uppercase-placeholder transition-all ${
                        couponMessage.isError 
                          ? 'border-red-500 focus:ring-red-200 bg-red-50 text-red-700' 
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode}
                      className="bg-gray-900 text-white px-4 py-2 text-sm rounded-lg font-bold hover:bg-black disabled:bg-gray-300 transition"
                    >
                      {isApplyingCoupon ? 'Đang thử...' : 'Áp dụng'}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-green-100 border border-green-200 p-2.5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {appliedCode}
                      </span>
                      <span className="text-green-700 font-medium text-sm">Đã áp dụng!</span>
                    </div>
                    <button onClick={removeCoupon} className="text-red-500 text-xs font-bold hover:underline">Gỡ bỏ</button>
                  </div>
                )}

                {/* Thông báo lỗi hoặc thành công */}
                {couponMessage.text && (
                  <p className={`text-xs mt-2 font-semibold animate-in fade-in ${couponMessage.isError ? 'text-red-500' : 'text-green-600'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* TỔNG KẾT TIỀN */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-gray-900">{subtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1"><Truck className="w-4 h-4" /> Phí vận chuyển</span>
                  <span className="font-semibold text-gray-900">{shippingFee.toLocaleString('vi-VN')} đ</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium animate-in fade-in">
                    <span>Mã giảm giá</span>
                    <span>- {discountAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-2xl font-extrabold text-blue-600">{finalTotal.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* MODAL THÀNH CÔNG */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl max-w-md w-full text-center transform animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            
            <h3 className="text-3xl font-extrabold text-gray-900 mb-3">Đặt Hàng Thành Công!</h3>
            
            <p className="text-gray-600 mb-8 text-lg">
              Cảm ơn <span className="font-bold text-blue-600">{formData.fullName}</span> đã mua sắm!<br/>
              Phương thức: <span className="font-semibold text-gray-800">{paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản QR'}</span>
            </p>
            
            <button
              onClick={handleCloseAndRedirect}
              className="w-full bg-blue-600 text-white font-bold rounded-xl px-6 py-4 hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-1 text-lg"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        </div>
      )}

    </main>
  );
}