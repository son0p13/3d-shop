'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PackagePlus, ArrowLeft, Image as ImageIcon, UploadCloud } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['Mô hình Game', 'Đồ trang trí', 'Linh kiện 3D', 'Khác'];

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { return alert("Vui lòng tải ảnh lên!"); }

    setIsLoading(true);

    try {
      // --- BƯỚC 1: TẢI ẢNH LÊN ---
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        setIsLoading(false);
        return alert("Lỗi tải ảnh: " + uploadData.message);
      }

      // ĐÂY LÀ CHỖ QUAN TRỌNG: Lấy link từ uploadData vừa nhận được
      const linkAnhChuan = uploadData.imageUrl; 
      console.log("🔗 Link ảnh nhận được:", linkAnhChuan);

      // --- BƯỚC 2: GỬI SANG API LƯU SẢN PHẨM ---
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          price: Number(price),
          basePrice: Number(price),
          image: linkAnhChuan, // 👈 DÙNG BIẾN TRỰC TIẾP Ở ĐÂY
          description: description,
          category: category
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Đã lưu vào Database thành công!");
        router.push('/admin');
        router.refresh(); // Làm mới dữ liệu
      } else {
        alert("Lỗi Database: " + data.message);
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <PackagePlus className="w-8 h-8 text-blue-600" /> Thêm Mô Hình Mới
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Tên sản phẩm</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="VD: Mô hình Garen..." />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Giá tiền</label>
                <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Danh mục</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Ảnh sản phẩm</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 relative overflow-hidden group">
                {previewUrl ? (
                  <div className="relative h-48 w-full">
                    <img src={previewUrl} className="h-full w-full object-contain" alt="Preview" />
                    <button type="button" onClick={() => {setFile(null); setPreviewUrl('');}} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg text-xs">Xóa ảnh</button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500" />
                    <span className="text-blue-600 font-bold">Bấm để chọn ảnh</span>
                    <input type="file" required accept="image/*" onChange={handleFileChange} className="sr-only" />
                  </label>
                )}
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-400">
              {isLoading ? 'Đang xử lý...' : 'Xác nhận Đăng bài'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}