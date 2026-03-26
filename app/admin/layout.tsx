import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"; 
import Link from "next/link";
import { BarChart3, Package, Home } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions); 

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/'); 
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo & Các nút chuyển trang */}
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0 flex items-center gap-2">
                <span className="text-2xl font-black text-blue-600">MIXI</span>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md">ADMIN</span>
              </div>
              
              {/* Menu cho máy tính */}
              <div className="hidden md:flex space-x-3">
                <Link href="/admin/products" className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 rounded-xl font-bold transition flex items-center gap-2">
                  <Package className="w-5 h-5" /> Kho Sản Phẩm
                </Link>
                <Link href="/admin/revenue" className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 shadow-sm border border-blue-100">
                  <BarChart3 className="w-5 h-5" /> Thống Kê Doanh Thu
                </Link>
              </div>
            </div>

            {/* Nút thoát ra ngoài Cửa hàng */}
            <div className="flex items-center">
              <Link href="/" className="text-gray-500 hover:text-blue-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition bg-gray-50 hover:bg-blue-50">
                <Home className="w-4 h-4" /> Ra Cửa Hàng
              </Link>
            </div>
          </div>
        </div>
        
        <div className="md:hidden border-t border-gray-100 flex p-3 gap-3 overflow-x-auto bg-gray-50">
            <Link href="/admin/products" className="whitespace-nowrap bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm">
              <Package className="w-4 h-4" /> Kho
            </Link>
            <Link href="/admin/revenue" className="whitespace-nowrap bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm">
              <BarChart3 className="w-4 h-4" /> Doanh Thu
            </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        {children}
      </main>
      
    </div>
  );
}