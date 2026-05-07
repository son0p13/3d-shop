'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Star, MessageSquare, ShieldCheck } from 'lucide-react';

interface Review {
  _id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 👉 SỬ DỤNG NEXT-AUTH ĐỂ LẤY THÔNG TIN ĐĂNG NHẬP (Thay thế hoàn toàn localStorage)
  const { data: session } = useSession();
  const currentUser = session?.user; 

  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy dữ liệu bình luận khi vừa vào trang
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      
      // LỚP BẢO VỆ 1
      if (!res.ok) {
        console.error("API trả về trạng thái lỗi:", res.status);
        setIsLoading(false);
        return; 
      }

      // LỚP BẢO VỆ 2
      const text = await res.text();
      if (!text) {
        setIsLoading(false);
        return; 
      }

      const data = JSON.parse(text);
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Lỗi tải bình luận:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra an toàn lần nữa
    if (!currentUser) {
      alert("Bạn cần đăng nhập để có thể đánh giá sản phẩm!");
      return; 
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId, 
          userName: currentUser.name,    
          userEmail: currentUser.email,  
          rating, 
          comment 
        })
      });
      const data = await res.json();

      if (data.success) {
        setReviews([data.review, ...reviews]);
        setComment('');
        alert("Cảm ơn bạn đã đánh giá sản phẩm!");
      } else {
        alert(data.message); 
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-black text-gray-800">Đánh giá sản phẩm ({reviews.length})</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* CỘT 1: FORM VIẾT ĐÁNH GIÁ */}
        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit">
          <h3 className="font-bold text-gray-800 mb-4">Gửi đánh giá của bạn</h3>
          
          {/* 👉 KIỂM TRA ĐĂNG NHẬP: Ẩn/Hiện Form */}
          {!currentUser ? (
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl text-center">
              <ShieldCheck className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-800 mb-3">Chỉ khách hàng đã mua sản phẩm mới có thể viết đánh giá.</p>
              <a href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition text-sm">
                Đăng nhập ngay
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 font-black rounded-full flex items-center justify-center text-sm">
                  {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Đánh giá với tư cách</p>
                  <p className="text-sm font-bold text-gray-800">{currentUser.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Chất lượng (Sao)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      onClick={() => setRating(star)}
                      className={`w-8 h-8 cursor-pointer transition ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`} 
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Bình luận</label>
                <textarea required rows={4} value={comment} onChange={(e) => setComment(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Sản phẩm in đẹp, chất lượng nhựa tốt..."></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition disabled:bg-gray-400 flex justify-center items-center gap-2">
                {isSubmitting ? (
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : null}
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </form>
          )}
        </div>

        {/* CỘT 2: DANH SÁCH BÌNH LUẬN */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="text-center text-gray-500 font-medium py-10">Đang tải đánh giá...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center bg-gray-50 rounded-2xl py-12 border border-dashed border-gray-300">
              <p className="text-gray-500 font-medium">Chưa có đánh giá nào. Hãy trải nghiệm và trở thành người đầu tiên!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition hover:shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 text-gray-600 font-black rounded-full flex items-center justify-center">
                      {rev.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                         <p className="font-bold text-gray-800">{rev.userName}</p>
                         <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Đã mua hàng
                         </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mt-3 leading-relaxed bg-gray-50 p-4 rounded-xl">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}