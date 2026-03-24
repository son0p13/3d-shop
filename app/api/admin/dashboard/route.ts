// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic'; // Tắt cache để số luôn nhảy mới nhất

export async function GET() {
  try {
    await dbConnect();

    // 1. Đếm tổng số đơn hàng đã đặt
    const totalOrders = await Order.countDocuments();

    // 2. Đếm số đơn đang "Chờ xác nhận"
    const pendingOrders = await Order.countDocuments({ status: 'Chờ xác nhận' });

    // 3. Tính tổng doanh thu (Chỉ tính những đơn đã "Hoàn thành")
    const completedOrders = await Order.find({ status: 'Hoàn thành' });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // 4. Lấy 5 đơn hàng mới nhất để hiện lên bảng
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        totalRevenue,
        recentOrders
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Lỗi API Dashboard:", error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}