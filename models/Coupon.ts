import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['fixed', 'percent'], default: 'fixed' },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  expirationDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  applicableProducts: { type: [String], default: [] } 
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);