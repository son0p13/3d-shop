import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await dbConnect();
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ success: false, message: 'Email này chưa được đăng ký trong hệ thống!' }, { status: 404 });
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.findOneAndUpdate(
      { email }, 
      { otp: otpCode, createdAt: Date.now() }, 
      { upsert: true, returnDocument: 'after' }
    );
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com', 
      port: 465, 
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    await transporter.sendMail({
      from: `"Mixi3Ds Store" <mixi3ds@gmail.com>`,
      to: email,
      subject: 'Mã khôi phục mật khẩu Mixi3Ds',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563EB;">Yêu cầu khôi phục mật khẩu</h2>
          <p>Xin chào <b>${existingUser.name}</b>,</p>
          <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản tại Mixi3Ds. Mã xác thực của bạn là:</p>
          <h1 style="background: #f3f4f6; padding: 10px 20px; letter-spacing: 5px; color: #111; border-radius: 5px; text-align: center;">${otpCode}</h1>
          <p style="color: #ef4444; font-size: 14px;"><i>* Mã này sẽ hết hạn sau 5 phút. Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</i></p>
        </div>
      `
    });

    return NextResponse.json({ success: true, message: 'Mã khôi phục đã được gửi đến email của bạn!' });

  } catch (error: any) {
    console.error("Lỗi gửi OTP Khôi phục:", error);
    return NextResponse.json({ success: false, message: 'Lỗi hệ thống khi gửi email.' }, { status: 500 });
  }
}