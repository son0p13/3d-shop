import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({ 
      success: true, 
      products: products 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi tải dữ liệu' }, { status: 500 });
  }
}
