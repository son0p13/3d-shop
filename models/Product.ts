import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true }, 
  category: { type: String, default: 'khac' },
  modelUrl: { type: String, required: false }, 
  
  printOptions: {
    materials: [String], // Ví dụ: ['PLA', 'ABS', 'Resin']
    colors: [String],    // Ví dụ: ['Đỏ', 'Đen', 'Trắng']
    sizes: [String]      // Ví dụ: ['Nhỏ (5cm)', 'Vừa (10cm)', 'Lớn (20cm)']
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);