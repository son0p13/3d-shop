// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

// 1. LẤY THÔNG TIN 1 SẢN PHẨM (Để điền sẵn vào Form)
export async function GET(req: Request, { params }: { params: any }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const product = await Product.findById(resolvedParams.id);
    
    if (!product) return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}

// 2. CẬP NHẬT SẢN PHẨM (Khi Admin bấm Lưu)
export async function PUT(req: Request, { params }: { params: any }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const body = await req.json();
    
    const updatedProduct = await Product.findByIdAndUpdate(resolvedParams.id, body, { new: true });
    
    if (!updatedProduct) return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}

// 3. XÓA SẢN PHẨM (Giữ nguyên như em đã làm)
export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    
    const deletedProduct = await Product.findByIdAndDelete(resolvedParams.id);
    if (!deletedProduct) return NextResponse.json({ success: false, message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Đã xóa' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}