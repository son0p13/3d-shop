'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Phone, MapPin, Save, ShieldCheck, Pencil, X } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // 👉 THÊM CÔNG TẮC CHUYỂN ĐỔI CHẾ ĐỘ
  const [isEditing, setIsEditing] = useState(false); 

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (!res.ok) {
        setIsLoading(false);
        return; 
      }
      const data = await res.json();
      if (data.success && data.profile) {
        setFormData({
          fullName: data.profile.fullName || '',
          phone: data.profile.phone || '',
          address: data.profile.address || ''
        });
      }
    } catch (error) {
      console.error("Lỗi tải hồ sơ:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        alert("Lỗi máy chủ! Vui lòng thử lại sau.");
        setIsSaving(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        alert('Cập nhật hồ sơ thành công!');
        setIsEditing(false); // 👉 Lưu xong thì tự động đóng form lại
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (error) {
      alert('Lỗi kết nối máy chủ!');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return <div className="min-h-screen flex justify-center items-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Hồ sơ cá nhân</h1>
            <p className="text-gray-500 font-medium">Quản lý thông tin giao hàng mặc định của bạn.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
          {/* Email (Luôn hiển thị) */}
          <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {session?.user?.image ? <img src={session.user.image} alt="Avatar" /> : <User className="text-gray-500"/>}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">Tài khoản đăng nhập</p>
              <p className="font-black text-gray-900">{session?.user?.email}</p>
            </div>
          </div>

          {/* CHẾ ĐỘ 1: CHỈ XEM THÔNG TIN (Khi isEditing là false) */}
          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2 text-gray-500">
                    <User className="w-4 h-4" /> <p className="text-sm font-bold">Họ và tên người nhận</p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">{formData.fullName || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                </div>

                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-2 text-gray-500">
                    <Phone className="w-4 h-4" /> <p className="text-sm font-bold">Số điện thoại</p>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">{formData.phone || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <MapPin className="w-4 h-4" /> <p className="text-sm font-bold">Địa chỉ giao hàng</p>
                </div>
                <p className="font-bold text-gray-900 text-lg">{formData.address || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-gray-900 text-white font-bold rounded-xl px-8 py-3.5 hover:bg-gray-800 transition flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
                >
                  <Pencil className="w-4 h-4"/> Chỉnh sửa thông tin
                </button>
              </div>
            </div>
          ) : (
            
            /* CHẾ ĐỘ 2: FORM NHẬP LIỆU (Khi isEditing là true) */
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm font-semibold mb-6 flex items-center gap-2">
                <Pencil className="w-4 h-4"/> Bạn đang ở chế độ chỉnh sửa hồ sơ.
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên người nhận</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="VD: Hoàng Tuấn Sơn" className="pl-12 w-full bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none block p-3.5 shadow-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại liên hệ</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-gray-400" /></div>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="VD: 0987.654.321" className="pl-12 w-full bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none block p-3.5 shadow-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ giao hàng mặc định</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-400" /></div>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Số nhà, Tên đường, Phường/Xã..." className="pl-12 w-full bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none block p-3.5 shadow-sm" />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="bg-gray-100 text-gray-700 font-bold rounded-xl px-6 py-3.5 hover:bg-gray-200 transition flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <X className="w-5 h-5"/> Hủy
                </button>
                <button 
                  disabled={isSaving} 
                  type="submit" 
                  className="bg-blue-600 text-white font-bold rounded-xl px-8 py-3.5 hover:bg-blue-700 transition flex items-center gap-2 shadow-lg disabled:opacity-50 w-full sm:w-auto justify-center"
                >
                  {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save className="w-5 h-5"/> Lưu Hồ Sơ</>}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}