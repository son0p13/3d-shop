import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

export async function POST(req: Request) {
  try {
    // 1. Nhận file khách gửi lên từ Frontend
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "Không tìm thấy file" }, { status: 400 });
    }

    // 2. Biến file thành dòng chảy dữ liệu (Buffer Stream) để tải lên Drive
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    // 3. Đánh thức Robot bằng Chìa khóa
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Ép kiểu để Next.js hiểu đúng các dấu xuống dòng \n trong private key
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // 4. Ra lệnh cho Robot ném file vào đúng thư mục Drive của Admin
    const response = await drive.files.create({
      requestBody: {
        name: file.name, // Giữ nguyên tên file gốc của khách
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID || ''],
      },
      media: {
        mimeType: file.type || 'application/octet-stream',
        body: stream,
      },
      fields: 'id, webViewLink, webContentLink',
    });

    // 5. Trả về đường link file cho Frontend để gắn vào Giỏ hàng
    return NextResponse.json({
      success: true,
      fileId: response.data.id,
      fileUrl: response.data.webViewLink, // Link xem
      downloadUrl: response.data.webContentLink, // Link tải trực tiếp
    });

  } catch (error) {
    console.error("Lỗi Google Drive API:", error);
    return NextResponse.json({ success: false, message: "Tải file lên Drive thất bại!" }, { status: 500 });
  }
}