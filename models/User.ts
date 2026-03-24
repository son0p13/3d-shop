import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }, // Mặc định ai đăng ký cũng là user
  },
  { timestamps: true }
);

// ĐÂY LÀ DÒNG PHÉP THUẬT QUAN TRỌNG NHẤT
// Kiểm tra xem Mongoose đã tạo Model này chưa, nếu chưa thì mới tạo mới
// (Tránh lỗi văng server khi Next.js tải lại trang nhiều lần)
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;