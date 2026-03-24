'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Plus, Trash2, ArrowLeft, Image as ImageIcon, Pencil } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mô hình này vĩnh viễn không?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      
      if (data.success) {
        setProducts(products.filter(p => p._id !== id));
        alert('Đã xóa sản phẩm thành công!');
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (error) {
      alert('Lỗi kết nối đến máy chủ!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-gray-50 rounded-full hover:bg-gray-200 transition">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Package className="text-blue-600" /> Quản Lý Kho Mô Hình
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-1">
                Đang hiển thị {products.length} sản phẩm
              </p>
            </div>
          </div>
          
          <Link 
            href="/admin/products/new" 
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" /> Đăng Sản Phẩm Mới
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider font-bold">
                  <th className="p-5">Hình ảnh</th>
                  <th className="p-5">Tên Sản Phẩm</th>
                  <th className="p-5">Danh Mục</th>
                  <th className="p-5">Giá Bán</th>
                  <th className="p-5 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-blue-50/50 transition duration-200 group">
                    <td className="p-5">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm group-hover:scale-105 transition" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                          <ImageIcon className="text-gray-400 w-6 h-6"/>
                        </div>
                      )}
                    </td>
                    <td className="p-5 font-bold text-gray-900 max-w-[200px] truncate">{product.name}</td>
                    <td className="p-5">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap">
                        {product.category || 'Chưa phân loại'}
                      </span>
                    </td>
                    <td className="p-5 font-black text-blue-600">
                      {product.basePrice?.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center gap-3">
                        <Link 
                          href={`/admin/products/${product._id}/edit`} 
                          className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm"
                          title="Sửa sản phẩm"
                        >
                          <Pencil className="w-5 h-5" />
                        </Link>
                        
                        <button 
                          onClick={() => handleDelete(product._id)} 
                          className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm" 
                          title="Xóa sản phẩm này"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-500 font-bold text-lg">Kho hàng đang trống.</p>
                      <p className="text-gray-400">Hãy đăng thêm các mô hình 3D tuyệt đẹp nhé!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </main>
  );
}