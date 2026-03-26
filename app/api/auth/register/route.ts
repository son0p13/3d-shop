import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Vui lòng điền đầy đủ thông tin!' }, { status: 400 });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email này đã được sử dụng!' }, { status: 400 });
    }
    const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;

if (!nameRegex.test(name)) {
  return NextResponse.json(
    { success: false, message: "Tên chỉ được chứa chữ cái và khoảng trắng, không dùng số hay kí tự đặc biệt!" },
    { status: 400 }
  );
}

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'Đăng ký tài khoản thành công!' }, { status: 201 });

  } catch (error: any) {
    console.log(" LỖI ĐĂNG KÝ:", error.message);
    return NextResponse.json({ message: 'Có lỗi xảy ra khi đăng ký' }, { status: 500 });
  }
}