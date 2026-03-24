import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Product from '@/models/Product';
export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const session = await getServerSession(authOptions);
    const currentUserEmail = session?.user?.email || "khach_vang_lai@gmail.com";

    const finalOrderData = {
      ...body,
      userEmail: currentUserEmail 
    };

    const newOrder = await Order.create(finalOrderData);
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const productId = resolvedParams.id;

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Thiếu ID sản phẩm' }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);
    
    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa thành công' }, { status: 200 });
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}