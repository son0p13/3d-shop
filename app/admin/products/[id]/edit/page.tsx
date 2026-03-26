// app/admin/products/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon, Package } from 'lucide-react';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    basePrice: 0,
    image: '',
    description: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        
        if (data.success) {
          setFormData({
            name: data.product.name || '',
            category: data.product.category || 'Khác',
            basePrice: data.product.basePrice || 0,
            image: data.product.image || '',
            description: data.product.description || ''
          });
        } else {
          alert('Không tìm thấy sản phẩm này!');
          router.push('/admin/products');
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          basePrice: Number(formData.basePrice) 
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('Cập nhật sản phẩm thành công!');
        router.push('/admin/products'); 
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (error) {
      alert('Lỗi kết nối máy chủ!');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <main className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products" className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition shadow-sm">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Package className="text-blue-600" /> Chỉnh sửa sản phẩm
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Tên mô hình</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="Anime & Manga">Anime & Manga</option>
                  <option value="Siêu anh hùng">Siêu anh hùng</option>
                  <option value="Game">Mô hình Game</option>
                  <option value="Đồ trang trí">Đồ trang trí</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Giá bán (VNĐ)</label>
                <input required type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Đường dẫn ảnh (URL)</label>
              <input required type="text" name="image" value={formData.image} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="https://..." />
              {formData.image && (
                <div className="mt-4 w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button disabled={isSaving} type="submit" className="bg-blue-600 text-white font-bold rounded-xl px-8 py-3 hover:bg-blue-700 transition flex items-center gap-2 shadow-lg disabled:opacity-50">
                {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Save className="w-5 h-5"/> Lưu thay đổi</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}