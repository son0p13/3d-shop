'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter(); // Dùng để chuyển trang sau khi đăng ký thành công
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState(''); // Chứa câu thông báo lỗi hoặc thành công

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Đăng ký thành công! Đang chuyển hướng...');
        
        // Đợi 2 giây cho người dùng đọc thông báo rồi chuyển sang trang Đăng nhập
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        
        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Tạo tài khoản mới</h2>
          <p className="text-gray-500 mt-2">Tham gia Xưởng In 3D ngay hôm nay</p>
        </div>

        {/* Thông báo Lỗi / Thành công */}
        {message && (
          <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${
            status === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium text-sm">{message}</span>
          </div>
        )}

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nhập Tên */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Họ và Tên</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                type="text"
                placeholder="VD: Tuấn Sơn"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-11 pr-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Nhập Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Địa chỉ Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                type="email"
                placeholder="son@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Nhập Mật khẩu */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-11 pr-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Nút Đăng ký */}
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full flex justify-center items-center gap-2 py-3.5 mt-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản'}
            {status !== 'loading' && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* Chuyển sang trang đăng nhập */}
        <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
          Đã có tài khoản?{' '}
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 transition">
            Đăng nhập ngay
          </Link>
        </div>
        
      </div>
    </main>
  );
}