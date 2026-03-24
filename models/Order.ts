import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  // 👉 THÊM TRƯỜNG NÀY ĐỂ ĐỊNH DANH TÀI KHOẢN (Tách biệt với người nhận hàng)
  userEmail: { type: String, required: true }, 

  customerInfo: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String },
  },
  items: { type: Array, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'Chờ xác nhận' },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);