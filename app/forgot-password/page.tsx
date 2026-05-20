'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
    if (e.target.name === 'otp') setSuccessMsg('');
  };

  // Bước 1: Gửi yêu cầu Khôi phục
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message);
        setStep(2); // Chuyển sang bước nhập mật khẩu mới
      } else {
        setErrorMsg(data.message);
      }
    } catch (error) {
      setErrorMsg("Lỗi kết nối máy chủ!");
    } finally {
      setIsLoading(false);
    }
  };

  // Bước 2: Đặt lại mật khẩu
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg("Mật khẩu nhập lại không khớp!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: formData.otp, 
          newPassword: formData.newPassword 
        })
      });
      const data = await res.json();

      if (data.success) {
        alert("🎉 Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.");
        router.push('/login');
      } else {
        setErrorMsg(data.message);
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
          <p className="text-gray-500 font-medium">Khôi phục mật khẩu</p>
        </div>

        {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold border border-red-100">{errorMsg}</div>}
        {successMsg && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-bold border border-green-100">{successMsg}</div>}

        <form onSubmit={step === 1 ? handleSendOTP : handleResetPassword} className="space-y-4">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email đăng nhập</label>
            <input type="email" name="email" required disabled={step === 2} value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-50" />
          </div>

          {step === 2 && (
            <div className="animate-fade-in-up mt-6 space-y-4 border-t pt-6">
              <div>
                <label className="block text-sm font-black text-blue-600 mb-1">Mã xác thực OTP</label>
                <input type="text" name="otp" required maxLength={6} value={formData.otp} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-center font-black tracking-widest text-xl" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu mới</label>
                <input type="password" name="newPassword" required value={formData.newPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="••••••••" />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-md disabled:bg-blue-400 mt-6 flex justify-center items-center gap-2"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : null}
            {step === 1 ? "Khôi phục tài khoản" : "Cập nhật mật khẩu"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8 font-medium">
          Nhớ mật khẩu rồi? <Link href="/login" className="text-blue-600 font-bold hover:underline">Quay lại Đăng nhập</Link>
        </p>

      </div>
    </div>
  );
}