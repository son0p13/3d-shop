'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; 
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const result = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.error) {
      setStatus('error');
      setErrorMsg('Email hoặc mật khẩu không chính xác!');
    } else {
      router.push('/');
      router.refresh(); 
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Đăng nhập</h2>
          <p className="text-gray-500 mt-2">Chào mừng bạn quay lại Xưởng In 3D</p>
        </div>

        {status === 'error' && (
          <div className="p-4 rounded-xl mb-6 flex items-center gap-3 bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Địa chỉ Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required type="email" placeholder="youremail@example.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setStatus('idle'); 
                }}
                className="w-full pl-11 pr-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                required type="password" placeholder="••••••••"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setStatus('idle'); 
                }}
                className="w-full pl-11 pr-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex justify-center items-center gap-2 py-3.5 mt-4 rounded-xl font-bold text-white bg-gray-900 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-70"
          >
            {status === 'loading' ? 'Đang kiểm tra...' : 'Đăng Nhập'}
            {status !== 'loading' && <ArrowRight className="w-5 h-5" />}
          </button>

          <div className="flex justify-center mt-3">
            <Link 
              href="/forgot-password" 
              className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition"
            >
              Bạn quên mật khẩu?
            </Link>
          </div>

        </form>

        <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700 transition">
            Đăng ký ngay
          </Link>
        </div>
        
      </div>
    </main>
  );
}