import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar'; // Gọi Navbar vào
import AuthProvider from '@/components/AuthProvider';
import FloatingContact from "@/components/FloatingContact";

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Mixi3ds - Xưởng In Mô Hình 3D',
  description: 'In mô hình 3D theo yêu cầu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <AuthProvider>
        {/* Thanh điều hướng dính ở trên cùng */}
        <Navbar />
        
        {/* Nội dung các trang sẽ được bơm vào đây */}
        <div className="min-h-screen">
          {children}
        </div>
        <FloatingContact />
        </AuthProvider>
        {/* Chân trang (Footer) đơn giản */}
        <footer className="bg-white border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
            <p>© 2026 Mixi3ds. Cửa hàng in ấn 3D theo yêu cầu.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}