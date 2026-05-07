import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function GET() {
  try {
    await dbConnect();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();
    // 👉 LỚP BẢO VỆ: KIỂM TRA HẠN SỬ DỤNG
    const expDate = new Date(body.expirationDate);
    // Cài đặt giờ của ngày hết hạn thành 23:59:59 để bao trọn ngày hôm đó
    expDate.setHours(23, 59, 59, 999); 
    
    const now = new Date();

    if (expDate < now) {
      return NextResponse.json({ 
        success: false, 
        message: 'Hạn sử dụng của mã không được nằm trong quá khứ!' 
      }, { status: 400 }); // Trả về lỗi 400 (Bad Request)
    }

    const existing = await Coupon.findOne({ code: body.code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Mã giảm giá này đã tồn tại!' }, { status: 400 });
    }

    const newCoupon = await Coupon.create({
      ...body,
      code: body.code.toUpperCase(),
    });

    return NextResponse.json({ success: true, coupon: newCoupon }, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo mã:", error);
    return NextResponse.json({ success: false, message: 'Lỗi khi tạo mã giảm giá' }, { status: 500 });
  }
}
// XÓA MÃ GIẢM GIÁ
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID của mã cần xóa' }, { status: 400 });
    }

    // Kết nối Database và xóa
    await dbConnect();
    await Coupon.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Đã xóa mã giảm giá' });
  } catch (error) {
    console.error("Lỗi API Xóa:", error);
    return NextResponse.json({ success: false, message: 'Lỗi hệ thống khi xóa' }, { status: 500 });
  }
}