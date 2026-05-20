import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();
    await dbConnect();

    const otpRecord = await Otp.findOne({ email });
    
    if (!otpRecord || otpRecord.otp !== otp) {
      return NextResponse.json({ success: false, message: 'Mã OTP không chính xác hoặc đã hết hạn!' }, { status: 400 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );
    await Otp.findOneAndDelete({ email });
    return NextResponse.json({ success: true, message: 'Đặt lại mật khẩu thành công!' });
  } catch (error: any) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    return NextResponse.json({ success: false, message: 'Lỗi hệ thống.' }, { status: 500 });
  }
}