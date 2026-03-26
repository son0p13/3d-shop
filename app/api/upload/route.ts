import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    console.log("\n=== 📡 BẮT ĐẦU XỬ LÝ ẢNH TẢI LÊN ===");
        const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      console.log("❌ Không tìm thấy file trong gói dữ liệu!");
      return NextResponse.json({ success: false, message: 'Không có file ảnh' }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filename = `${Date.now()}-${safeName}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    const imageUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error(" LỖI NGHIÊM TRỌNG KHI TẢI ẢNH:", error);
    return NextResponse.json({ success: false, message: 'Lỗi máy chủ' }, { status: 500 });
  }
}