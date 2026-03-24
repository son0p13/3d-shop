'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link'; 

const BANNERS = [
  {
    id: 1,
    title: "Mô Hình 3D Sắc Nét",
    desc: "Công nghệ in Resin chi tiết đến từng milimet.",
    image: "/uploads/banner1.jpg", 
    link: "/?view=all" 
  },
  {
    id: 2,
    title: "Góc Làm Việc Cực Chill",
    desc: "Các mẫu giá đỡ, chậu cây, đèn ngủ decor sáng tạo.",
    image: "/uploads/banner2.jpg",
    link: "/?category=Đồ trang trí" 
  },
  {
    id: 3,
    title: "Mixi3Ds - Sáng Tạo Vô Tận",
    desc: "Độc lạ Mixi3ds.",
    image: "/uploads/banner3.jpg",
    link: "/?category=Khác" 
  }
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(current === BANNERS.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? BANNERS.length - 1 : current - 1);

  return (
    <div className="relative w-full max-w-7xl mx-auto h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
      
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }} 
      >
        {BANNERS.map((banner) => (
          <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12 md:px-20 text-white">
              <h2 className="text-4xl md:text-6xl font-black mb-4 animate-in fade-in slide-in-from-left duration-700">
                {banner.title}
              </h2>
              <p className="text-lg md:text-xl mb-8 opacity-90 max-w-lg">
                {banner.desc}
              </p>

              <Link 
                href={banner.link} 
                className="bg-blue-600 w-fit px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition inline-block"
              >
                Xem Thêm
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${
              current === index ? 'w-8 bg-blue-600' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}