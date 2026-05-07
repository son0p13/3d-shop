import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order'; 

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Thiếu ID sản phẩm' }, { status: 400 });
    }

    await dbConnect();
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Lỗi GET Review:", error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, userName, userEmail, rating, comment } = body; 

    if (!productId || !userName || !userEmail || !rating || !comment) {
      return NextResponse.json({ success: false, message: 'Vui lòng điền đủ thông tin!' }, { status: 400 });
    }

    await dbConnect();

 const hasPurchased = await Order.findOne({
      userEmail: userEmail, 
      $or: [
        { "items._id": productId },
        { "items.productId": productId },
        { "items.id": productId } 
      ]
    });
    if (!hasPurchased) {
      return NextResponse.json({ 
        success: false, 
        message: 'Bạn phải mua sản phẩm này mới có thể đánh giá!' 
      }, { status: 403 });
    }

    const newReview = await Review.create({ productId, userName, rating, comment });
    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Lỗi duyệt đánh giá:", error);
    return NextResponse.json({ success: false, message: 'Lỗi khi lưu đánh giá' }, { status: 500 });
  }
}