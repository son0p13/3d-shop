'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = [
  { label: 'Tất cả danh mục', value: 'Tất cả' },
  { label: 'Mô hình Game', value: 'Mô hình Game' },
  { label: 'Đồ trang trí', value: 'Đồ trang trí' },
  { label: 'Linh kiện 3D', value: 'Linh kiện 3D' },
  { label: 'Khác', value: 'Khác' },
];

const PRICE_RANGES = [
  { label: 'Mọi mức giá', value: '' },
  { label: 'Dưới 100.000đ', value: 'duoi-100' },
  { label: '100.000đ - 300.000đ', value: '100-300' },
  { label: 'Trên 300.000đ', value: 'tren-300' },
];

export default function ProductFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'Tất cả') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl mx-auto">
      <select 
        onChange={(e) => handleFilterChange('category', e.target.value)}
        value={searchParams.get('category') || 'Tất cả'}
        className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700 bg-white shadow-sm"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>{cat.label}</option>
        ))}
      </select>

      <select 
        onChange={(e) => handleFilterChange('price', e.target.value)}
        value={searchParams.get('price') || ''}
        className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700 bg-white shadow-sm"
      >
        {PRICE_RANGES.map((range) => (
          <option key={range.value} value={range.value}>{range.label}</option>
        ))}
      </select>
    </div>
  );
}