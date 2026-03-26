import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true }, 
  category: { type: String, default: 'khac' },
  modelUrl: { type: String, required: false }, 
  
  printOptions: {
    materials: [String], 
    colors: [String],   
    sizes: [String]     
  }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);