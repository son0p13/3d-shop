'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Edit, X, Percent, DollarSign, Search } from 'lucide-react';

export default function CouponManager() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'fixed',
    discountValue: '',
    minOrderValue: '',
    usageLimit: '',
    expirationDate: '',
    applicableProducts: [] as string[]
  });
  
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, '0');
  const day = String(todayDate.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      }
    } catch (error) {
      console.error('Lỗi tải danh sách sản phẩm:', error);
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      
      if (!res.ok) {
         console.error("API trả về lỗi:", res.status);
         setIsLoading(false);
         return; 
      }

      const data = await res.json();
      if (data.success) setCoupons(data.coupons);
    } catch (error) {
      console.error('Lỗi tải mã giảm giá:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.expirationDate < today) {
      alert("Ngày hết hạn không thể là ngày trong quá khứ. Vui lòng kiểm tra lại!");
      return;
    }
    
    setModalStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const payload = {
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue),
      usageLimit: Number(formData.usageLimit),
      applicableProducts: formData.applicableProducts
    };

    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        alert("Thêm mã giảm giá thành công!");
        setCoupons([data.coupon, ...coupons]);
        setIsModalOpen(false);
        setModalStep(1);
        setSearchKeyword('');
        setFormData({ code: '', discountType: 'fixed', discountValue: '', minOrderValue: '', usageLimit: '', expirationDate: '', applicableProducts: [] });
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCoupons(coupons.filter(c => c._id !== id));
      } else {
        alert("Lỗi khi xóa!");
      }
    } catch (error) {
      alert("Lỗi máy chủ");
    }
  };

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  
  const groupedProducts = filteredProducts.reduce((acc, product: any) => {
    const cat = product.category || 'Chưa phân loại';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Tag className="text-blue-600 w-8 h-8" /> Quản Lý Mã Giảm Giá
          </h1>
          <p className="text-gray-500 mt-2">Tạo và quản lý các chiến dịch khuyến mãi</p>
        </div>
        <button 
          onClick={() => {
            setModalStep(1);
            setIsModalOpen(true);
            setSearchKeyword('');
          }}
          className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-md"
        >
          <Plus className="w-5 h-5" /> Thêm Mã Mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm font-bold border-b border-gray-100">
                <th className="p-4">Mã Code</th>
                <th className="p-4">Mức Giảm</th>
                <th className="p-4">Điều Kiện (Tối thiểu)</th>
                <th className="p-4">Đã dùng</th>
                <th className="p-4">Hạn Sử Dụng</th>
                <th className="p-4 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr><td colSpan={6} className="text-center p-8 text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-8 text-gray-500">Chưa có mã giảm giá nào</td></tr>
              ) : (
                coupons.map((coupon: any) => (
                  <tr key={coupon._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-700 font-black px-3 py-1 rounded-lg">{coupon.code}</span>
                    </td>
                    <td className="p-4 font-bold text-gray-800">
                      {coupon.discountType === 'fixed' 
                        ? `${coupon.discountValue.toLocaleString('vi-VN')} đ` 
                        : `${coupon.discountValue} %`}
                    </td>
                    <td className="p-4 text-gray-600">
                      {coupon.minOrderValue.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-800">{coupon.usedCount}</span> <span className="text-gray-400">/ {coupon.usageLimit}</span>
                    </td>
                    <td className="p-4">
                      <div className={`font-medium ${new Date(coupon.expirationDate) < new Date() ? 'text-red-500' : 'text-green-600'}`}>
                        {`${String(new Date(coupon.expirationDate).getDate()).padStart(2, '0')}/${String(new Date(coupon.expirationDate).getMonth() + 1).padStart(2, '0')}/${new Date(coupon.expirationDate).getFullYear()}`}
                      </div>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button onClick={() => handleDelete(coupon._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-black text-gray-900">
                {modalStep === 1 ? "Tạo Mã Khuyến Mãi Mới" : "Chọn Sản Phẩm Áp Dụng"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={modalStep === 1 ? handleNextStep : handleSubmit} className="p-6 space-y-5">
              {modalStep === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Tên Mã (Code)</label>
                      <input required type="text" name="code" value={formData.code} onChange={handleChange} placeholder="VD: MIXI2026" className="w-full uppercase px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Ngày Hết Hạn</label>
                      <input required type="date" min={today} name="expirationDate" value={formData.expirationDate} onChange={handleChange} onKeyDown={(e) => e.preventDefault()} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Kiểu Giảm Giá</label>
                      <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button type="button" onClick={() => setFormData({...formData, discountType: 'fixed'})} className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-1 transition ${formData.discountType === 'fixed' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                          <DollarSign className="w-4 h-4" /> Tiền mặt
                        </button>
                        <button type="button" onClick={() => setFormData({...formData, discountType: 'percent'})} className={`flex-1 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-1 transition ${formData.discountType === 'percent' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                          <Percent className="w-4 h-4" /> Phần trăm
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Giá trị giảm ({formData.discountType === 'fixed' ? 'VNĐ' : '%'})
                      </label>
                      <input required type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} placeholder={formData.discountType === 'fixed' ? "VD: 50000" : "VD: 15"} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Giá trị tối thiểu (VNĐ)</label>
                      <input required type="number" name="minOrderValue" value={formData.minOrderValue} onChange={handleChange} placeholder="VD: 200000" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng </label>
                      <input required type="number" name="usageLimit" value={formData.usageLimit} onChange={handleChange} placeholder="VD: 100" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-5">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">
                      Hủy bỏ
                    </button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition flex items-center gap-2">
                       Chọn sản phẩm áp dụng
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Áp dụng cho sản phẩm cụ thể (Tùy chọn)</label>
                    <p className="text-xs text-gray-500 mb-3">Chọn các sản phẩm được áp dụng mã. Nếu không chọn, mã sẽ áp dụng cho tất cả sản phẩm.</p>
                    
                    <div className="relative mb-3">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={searchKeyword} 
                        onChange={(e) => setSearchKeyword(e.target.value)} 
                        placeholder="Tìm kiếm sản phẩm..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" 
                      />
                    </div>

                    <div className="max-h-72 overflow-y-auto border border-gray-300 rounded-xl p-3 bg-gray-50 space-y-4">
                      {products.length === 0 ? (
                         <p className="text-sm text-gray-500 text-center py-2">Đang tải danh sách sản phẩm...</p>
                      ) : Object.keys(groupedProducts).length === 0 ? (
                         <p className="text-sm text-gray-500 text-center py-4">Không tìm thấy sản phẩm nào phù hợp.</p>
                      ) : (
                        Object.entries(groupedProducts).map(([category, prods]: [string, any]) => {
                          const isAllSelected = prods.length > 0 && prods.every((p: any) => formData.applicableProducts.includes(p._id));
                          
                          return (
                          <div key={category} className="space-y-2">
                            <h4 className="font-bold text-gray-700 bg-gray-200/80 px-3 py-1.5 rounded-lg text-sm sticky top-0 z-10 shadow-sm backdrop-blur-sm border border-gray-200 flex items-center justify-between">
                              <div>
                                {category} <span className="font-normal text-gray-500 text-xs ml-1">({prods.length})</span>
                              </div>
                              <label className="flex items-center gap-1.5 text-xs font-bold text-blue-600 cursor-pointer hover:text-blue-800 transition">
                                <input 
                                  type="checkbox" 
                                  checked={isAllSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      const newIds = prods.map((p: any) => p._id);
                                      setFormData({ ...formData, applicableProducts: Array.from(new Set([...formData.applicableProducts, ...newIds])) });
                                    } else {
                                      const idsToRemove = prods.map((p: any) => p._id);
                                      setFormData({ ...formData, applicableProducts: formData.applicableProducts.filter((id: string) => !idsToRemove.includes(id)) });
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
                                />
                                Chọn tất cả
                              </label>
                            </h4>
                            <div className="space-y-2 pl-1">
                              {prods.map((product: any) => (
                                <label key={product._id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition">
                                  <input 
                                    type="checkbox" 
                                    checked={formData.applicableProducts.includes(product._id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setFormData({ ...formData, applicableProducts: [...formData.applicableProducts, product._id] });
                                      } else {
                                        setFormData({ ...formData, applicableProducts: formData.applicableProducts.filter((id: string) => id !== product._id) });
                                      }
                                    }}
                                    className="w-4 h-4 text-blue-600 rounded cursor-pointer" 
                                  />
                                  <div className="flex items-center gap-3 w-full">
                                    {product.image ? (
                                      <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded shadow-sm border border-gray-100" />
                                    ) : (
                                      <div className="w-8 h-8 bg-gray-100 rounded border border-gray-200"></div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <span className="text-sm font-bold text-gray-800 block truncate">{product.name}</span>
                                      <span className="text-xs font-semibold text-blue-600 block">{product.basePrice?.toLocaleString('vi-VN')} đ</span>
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-5">
                    <button type="button" onClick={() => setModalStep(1)} className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">
                      Quay lại
                    </button>
                    <button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition disabled:bg-green-300 flex items-center gap-2">
                      {isSubmitting ? "Đang lưu..." : "Hoàn Tất Tạo Mã"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}