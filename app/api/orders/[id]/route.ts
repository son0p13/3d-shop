import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { authOptions } from "@/lib/auth";
import Order from '@/models/Order';
export async function PUT(req: Request, { params }: { params: any }) {
  try {
    await dbConnect();
        const body = await req.json();
    const newStatus = body.status;
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Thiếu mã đơn hàng' }, { status: 400 });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });

  } catch (error) {
    console.error("Lỗi cập nhật đơn hàng:", error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}