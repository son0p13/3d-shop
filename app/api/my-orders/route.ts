import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // 👉 ĐẶT MÁY DÒ: Xem Backend nhận được gì từ giao diện
    console.log("📦 THÔNG TIN KHÁCH HÀNG GỬI LÊN:", body.customerInfo);

    const newOrder = await Order.create(body);
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ... (Các hàm GET giữ nguyên)