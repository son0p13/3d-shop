import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // ID của sản phẩm được đánh giá
  userName: { type: String, required: true },  // Tên khách hàng
  rating: { type: Number, required: true, min: 1, max: 5 }, // Số sao (1 đến 5)
  comment: { type: String, required: true },   // Nội dung bình luận
  createdAt: { type: Date, default: Date.now } // Thời gian đăng
});

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export default Review;