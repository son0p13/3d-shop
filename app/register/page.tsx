'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  
  // Các state lưu trữ dữ liệu người dùng gõ vào
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  // Các state quản lý giao diện
  const [step, setStep] = useState(1); // 1: Điền thông tin, 2: Nhập OTP
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Hàm gom dữ liệu khi người dùng gõ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); // Gõ lại là xóa lỗi cũ đi
  };

  // 👉 BƯỚC 1: XỬ LÝ GỬI MÃ OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Kiểm tra mật khẩu khớp nhau
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Mật khẩu nhập lại không khớp!");
      setIsLoading(false);
      return;
    }

    // Kiểm duyệt tên bằng Regex trực tiếp trên Frontend cho nhanh
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    if (!nameRegex.test(formData.name)) {
      setErrorMsg("Tên chỉ được chứa chữ cái, không dùng số hay kí tự đặc biệt!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email })
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!");
        setStep(2); // 👉 Chuyển sang Bước 2 (Hiện ô nhập OTP)
      } else {
        setErrorMsg(data.message || "Lỗi khi gửi mã OTP");
      }
    } catch (error) {
      setErrorMsg("Lỗi kết nối máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  // 👉 BƯỚC 2: XỬ LÝ ĐĂNG KÝ CHÍNH THỨC
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (formData.otp.length !== 6) {
      setErrorMsg("Mã OTP phải có đúng 6 chữ số!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) // Gửi tất cả: name, email, password, otp
      });

      const data = await res.json();

      if (data.success) {
        alert("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
        router.push('/login'); // Chuyển thẳng về trang Login
      } else {
        setErrorMsg(data.message || "Mã OTP không đúng hoặc đã hết hạn");
      }
    } catch (error) {
      setErrorMsg("Lỗi kết nối máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-600 mb-2">MIXI 3DS</h1>
          <p className="text-gray-500 font-medium">Tạo tài khoản thành viên mới</p>
        </div>

        {/* Hiển thị lỗi hoặc thành công */}
        {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold border border-red-100">{errorMsg}</div>}
        {successMsg && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-bold border border-green-100">{successMsg}</div>}

        <form onSubmit={step === 1 ? handleSendOTP : handleRegister} className="space-y-4">
          
          {/* LUÔN HIỂN THỊ CÁC Ô NÀY (Nhưng khóa lại ở bước 2 để khách không sửa lung tung) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Họ và Tên</label>
            <input type="text" name="name" required disabled={step === 2} value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"  />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required disabled={step === 2} value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50"  />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
            <input type="password" name="password" required disabled={step === 2} value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50" placeholder="••••••••" />
          </div>

          {step === 1 && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nhập lại mật khẩu</label>
              <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="••••••••" />
            </div>
          )}

          {/* CHỈ HIỂN THỊ Ô NÀY Ở BƯỚC 2 (Khi đã gửi mã) */}
          {step === 2 && (
            <div className="animate-fade-in-up mt-6 border-t pt-6">
              <label className="block text-sm font-black text-blue-600 mb-1">Mã xác thực OTP (6 số)</label>
              <p className="text-xs text-gray-500 mb-2">Vui lòng kiểm tra hòm thư chính và mục Thư rác (Spam).</p>
              <input type="text" name="otp" required maxLength={6} value={formData.otp} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-center font-black tracking-widest text-xl"  />
            </div>
          )}

          {/* NÚT BẤM LINH HOẠT THEO BƯỚC */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-md disabled:bg-blue-400 mt-6 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : null}
            {step === 1 ? "Đăng kí" : "Xác nhận Đăng ký"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          Đã có tài khoản? <Link href="/login" className="text-blue-600 font-bold hover:underline">Đăng nhập ngay</Link>
        </p>

      </div>
    </div>
  );
}