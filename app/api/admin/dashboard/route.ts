// app/api/admin/dashboard/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    await dbConnect();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Chờ xác nhận' });
    const completedOrders = await Order.find({ status: 'Hoàn thành' });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
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