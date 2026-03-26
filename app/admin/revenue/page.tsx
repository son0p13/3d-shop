'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, PackageCheck, LineChart as LineChartIcon, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RevenuePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Các state quản lý bộ lọc và giao diện
  const [filter, setFilter] = useState('month');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar'); // Mặc định là Cột
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        // Chỉ lấy đơn hàng đã hoàn thành
        const completedOrders = data.orders.filter((o: any) => o.status === 'Hoàn thành');
        setOrders(completedOrders);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Thuật toán nhào nặn dữ liệu
  const getChartData = () => {
    const now = new Date();
    const currentYear = now.getFullYear();

    if (filter === 'day') {
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateStr = d.toLocaleDateString('vi-VN');
        const total = orders
          .filter(o => new Date(o.createdAt).toLocaleDateString('vi-VN') === dateStr)
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        data.push({ name: dateStr.slice(0, 5), 'Doanh Thu': total });
      }
      return data;
    }

    if (filter === 'month') {
      const data = [];
      for (let i = 1; i <= 12; i++) {
        const total = orders
          .filter(o => {
            const d = new Date(o.createdAt);
            return d.getMonth() + 1 === i && d.getFullYear() === currentYear;
          })
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        data.push({ name: `T${i}`, 'Doanh Thu': total });
      }
      return data;
    }

    if (filter === 'quarter') {
      return [1, 2, 3, 4].map(q => {
        const total = orders
          .filter(o => {
            const month = new Date(o.createdAt).getMonth() + 1;
            const orderQuarter = Math.ceil(month / 3);
            return orderQuarter === q && new Date(o.createdAt).getFullYear() === currentYear;
          })
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        return { name: `Quý ${q}`, 'Doanh Thu': total };
      });
    }

    if (filter === 'year') {
      const data = [];
      for (let i = 2; i >= 0; i--) {
        const year = currentYear - i;
        const total = orders
          .filter(o => new Date(o.createdAt).getFullYear() === year)
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        data.push({ name: `${year}`, 'Doanh Thu': total });
      }
      return data;
    }

    // 👉 TÍNH NĂNG MỚI: Lọc theo khoảng ngày tùy chọn
    if (filter === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const data = [];
      
      // Chặn lỗi người dùng chọn ngày bắt đầu lớn hơn ngày kết thúc
      if (start <= end) {
        let current = new Date(start);
        while(current <= end) {
          const dateStr = current.toLocaleDateString('vi-VN');
          const total = orders
            .filter(o => new Date(o.createdAt).toLocaleDateString('vi-VN') === dateStr)
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
          
          data.push({ name: dateStr.slice(0, 5), 'Doanh Thu': total });
          current.setDate(current.getDate() + 1); // Tiến lên 1 ngày
        }
      }
      return data;
    }

    return [];
  };

  const chartData = getChartData();
  
  // Đã tối ưu: Tính tổng tiền dựa TRÊN NHỮNG CỘT ĐANG HIỂN THỊ (Lọc tới đâu, tiền nhảy tới đó)
  const dynamicTotalRevenue = chartData.reduce((sum, item) => sum + item['Doanh Thu'], 0);
  
  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <main className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & BỘ LỌC */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-gray-50 rounded-full hover:bg-gray-200 transition">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <BarChart3 className="text-blue-600" /> Báo Cáo Doanh Thu
              </h1>
            </div>
          </div>
          
          {/* Khu vực chọn thời gian */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            
            {/* Nếu chọn Tùy chỉnh thì hiện 2 ô chọn lịch */}
            {filter === 'custom' && (
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 w-full sm:w-auto">
                <Calendar className="w-5 h-5 text-gray-400 ml-2" />
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 cursor-pointer" />
                <span className="text-gray-400 font-bold">-</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 cursor-pointer" />
              </div>
            )}

            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-900 font-bold rounded-xl focus:ring-2 focus:ring-blue-500 block p-3 outline-none cursor-pointer w-full sm:w-auto"
            >
              <option value="day">7 Ngày gần nhất</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Theo Quý</option>
              <option value="year">Theo Năm</option>
              <option value="custom">Chọn thời gian</option>
            </select>
          </div>
        </div>

        {/* THẺ TỔNG QUAN TỰ ĐỘNG CẬP NHẬT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 bg-green-100 text-green-600 rounded-2xl">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-500 font-bold text-sm mb-1 uppercase">Doanh thu thời gian chọn</p>
              <h3 className="text-3xl font-black text-gray-900">{dynamicTotalRevenue.toLocaleString('vi-VN')} đ</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
              <PackageCheck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-500 font-bold text-sm mb-1">TỔNG ĐƠN HÀNG TOÀN HỆ THỐNG</p>
              <h3 className="text-3xl font-black text-gray-900">{orders.length} Đơn</h3>
            </div>
          </div>
        </div>

        {/* KHU VỰC BIỂU ĐỒ & NÚT GẠT CỘT/ĐƯỜNG */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" /> Phân tích dòng tiền
            </h2>
            
            {/* 👉 BỘ CHUYỂN ĐỔI BIỂU ĐỒ (TOGGLE) */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setChartType('bar')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${chartType === 'bar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <BarChart3 className="w-4 h-4" /> Cột
              </button>
              <button 
                onClick={() => setChartType('line')} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${chartType === 'line' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LineChartIcon className="w-4 h-4" /> Đường
              </button>
            </div>
          </div>

          {/* VẼ BIỂU ĐỒ DỰA THEO LỰA CHỌN */}
          <div className="w-full h-[400px]">
            {chartData.length === 0 && filter === 'custom' ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-2xl">
                Vui lòng chọn ngày bắt đầu và kết thúc để xem biểu đồ
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  // 👉 BIỂU ĐỒ CỘT
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontWeight: 600 }} tickFormatter={(value) => `${(value / 1000).toLocaleString('vi-VN')}k`} dx={-10} />
                    <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`${Number(value).toLocaleString('vi-VN')} đ`, 'Doanh Thu']} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                    <Bar dataKey="Doanh Thu" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={50} animationDuration={1000} />
                  </BarChart>
                ) : (
                  // 👉 BIỂU ĐỒ ĐƯỜNG
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontWeight: 600 }} tickFormatter={(value) => `${(value / 1000).toLocaleString('vi-VN')}k`} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`${Number(value).toLocaleString('vi-VN')} đ`, 'Doanh Thu']} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                    <Line type="monotone" dataKey="Doanh Thu" stroke="#2563EB" strokeWidth={4} activeDot={{ r: 8 }} animationDuration={1000} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}