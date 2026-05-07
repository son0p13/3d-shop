import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp"; // Nhập thêm két sắt OTP

export async function POST(req: Request) {
  try {
    const { name, email, password, otp } = await req.json(); // Nhận thêm otp từ Frontend
    await dbConnect();

    // 1. Kiểm tra OTP có khớp và còn hạn không
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return NextResponse.json(
        { success: false, message: "Mã OTP không chính xác hoặc đã hết hạn!" },
        { status: 400 }
      );
    }

    // 2. Chắc cốp kiểm tra lại email có bị trùng không
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email đã tồn tại" }, { status: 400 });
    }

    // 3. Mã hóa mật khẩu và tạo tài khoản như bình thường
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    // 4. Hủy mã OTP sau khi đăng ký thành công để tránh dùng lại
    await Otp.deleteOne({ email });

    return NextResponse.json(
      { success: true, message: "Đăng ký thành công!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Lỗi đăng ký:", error);
    return NextResponse.json({ success: false, message: "Lỗi máy chủ" }, { status: 500 });
  }
}