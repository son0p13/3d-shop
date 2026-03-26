'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '', 
    modelUrl: ''
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { 
        alert('Vui lòng chọn ảnh nhỏ hơn 5MB nhé!');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('📸 Vui lòng tải lên một tấm ảnh cho sản phẩm!');
      return;
    }
    setLoading(true);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('basePrice', formData.basePrice);
    submitData.append('image', file); 

    if (formData.modelUrl.trim() !== '') {
      submitData.append('modelUrl', formData.modelUrl.trim());
    }
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: submitData, 
      });

      if (res.ok) {
        alert(' Đã thêm sản phẩm thành công!');
        router.push('/');
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(` Có lỗi xảy ra: ${errorData.message || 'Lưu sản phẩm thất bại.'}`);
      }
    } catch (error) {
      console.error(error);
      alert(' Lỗi kết nối mạng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
        <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Mô hình Pikachu 3D" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sản phẩm</label>
        <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Nhựa PLA an toàn..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Giá tiền (VNĐ) *</label>
        <input required type="number" min="0" value={formData.basePrice} onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: 150000" />
      </div>

      <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
        <label className="block text-sm font-bold text-blue-800 mb-2">📸 Tải Ảnh 2D Sản Phẩm (Bắt buộc)</label>
        <input required type="file" accept="image/*" onChange={handleImageChange}
          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer transition" />
        
        {preview && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2 font-medium">Xem trước ảnh:</p>
            <img src={preview} alt="Preview" className="h-40 w-40 object-cover rounded-2xl shadow-md border-4 border-white" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Link File 3D (.glb) (Nếu có)</label>
        <input type="url" value={formData.modelUrl} onChange={(e) => setFormData({ ...formData, modelUrl: e.target.value })}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl text-lg disabled:bg-gray-400 disabled:shadow-none mt-2">
        {loading ? '⏳ Đang tải ảnh và lưu sản phẩm...' : '🚀 Thêm Sản Phẩm Ngay'}
      </button>
    </form>
  );
}