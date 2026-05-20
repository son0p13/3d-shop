import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Otp from '@/models/Otp';

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    await dbConnect();

    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    if (!nameRegex.test(name)) {
      return NextResponse.json({ success: false, message: 'Tên chỉ được chứa chữ cái, không dùng số hay kí tự đặc biệt!' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email này đã được đăng ký!' }, { status: 400 });
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

    try {
      await transporter.verify();
      console.log("✅ KẾT NỐI BREVO THÀNH CÔNG! Đang chuẩn bị gửi...");
    } catch (verifyError) {
      console.error("❌ LỖI TÀI KHOẢN BREVO:", verifyError);
      return NextResponse.json({ success: false, message: 'Lỗi đăng nhập Brevo (Check Terminal)' }, { status: 500 });
    }

    await transporter.sendMail({
      from: `"Mixi3Ds Store" <mixi3ds@gmail.com>`,
      to: email,
      subject: 'Mã xác thực đăng ký tài khoản Mixi3Ds',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563EB;">Chào mừng ${name} đến với Mixi3Ds!</h2>
          <p>Mã xác thực đăng ký tài khoản của bạn là:</p>
          <h1 style="background: #f3f4f6; padding: 10px 20px; letter-spacing: 5px; color: #111; border-radius: 5px; text-align: center;">${otpCode}</h1>
          <p style="color: #ef4444; font-size: 14px;"><i>* Mã này sẽ tự động hết hạn sau 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</i></p>
        </div>
      `
    });

    console.log(`✅ ĐÃ GỬI OTP TỚI: ${email}`);
    return NextResponse.json({ success: true, message: 'Mã xác thực đã được gửi đến email của bạn!' });

  } catch (error: any) {
    console.error("Lỗi gửi OTP:", error);
    return NextResponse.json({ success: false, message: 'Lỗi hệ thống khi gửi email.' }, { status: 500 });
  }
}