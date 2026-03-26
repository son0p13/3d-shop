'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
export default function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/?search=${encodeURIComponent(keyword.trim())}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center w-full max-w-md bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Tìm kiếm mô hình 3D..."
        className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-400"
      />
      <button type="submit" className="text-gray-500 hover:text-blue-600 p-1 transition-colors">
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}