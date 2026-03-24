import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Dùng email làm chìa khóa
  fullName: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);