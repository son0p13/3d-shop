import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function POST(req: Request) {
  try {
    const { code, orderTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập mã giảm giá!' }, { status: 400 });
    }

    await dbConnect();
    
    // Tìm mã trong Database
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) return NextResponse.json({ success: false, message: 'Vui lòng kiểm tra lại mã giảm giá!' }, { status: 404 });
    if (new Date() > new Date(coupon.expirationDate)) return NextResponse.json({ success: false, message: 'Mã giảm giá này đã hết hạn!' }, { status: 400 });
    if (coupon.usedCount >= coupon.usageLimit) return NextResponse.json({ success: false, message: 'Mã giảm giá này đã hết lượt sử dụng!' }, { status: 400 });
    if (orderTotal < coupon.minOrderValue) return NextResponse.json({ success: false, message: `Đơn hàng phải từ ${coupon.minOrderValue.toLocaleString('vi-VN')}đ để áp dụng mã này.` }, { status: 400 });

    // Tính tiền giảm
    let discountAmount = coupon.discountType === 'percent' ? (orderTotal * coupon.discountValue) / 100 : coupon.discountValue;
    discountAmount = Math.min(discountAmount, orderTotal); // Không cho giảm âm tiền

    return NextResponse.json({ success: true, discountAmount, couponCode: coupon.code, message: 'Áp dụng mã thành công!' });
  } catch (error) {
    console.error("Lỗi áp dụng mã:", error);
    return NextResponse.json({ success: false, message: 'Lỗi hệ thống máy chủ' }, { status: 500 });
  }
}