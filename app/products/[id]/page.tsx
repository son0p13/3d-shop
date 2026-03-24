import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import ModelViewer from '@/components/ModelViewer';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';
// 1. Khai báo params là một hộp quà Promise (Luật mới của Next.js 15+)
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. Dùng chữ await để "mở hộp" lấy ID thực sự ra
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  // 3. Kết nối Database và tìm sản phẩm theo ID chuẩn xác
  await dbConnect();
  const product = await Product.findById(productId).lean();

  if (!product) {
    return notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        

        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center min-h-[400px] border-b md:border-b-0 md:border-r border-gray-100 p-8">
          {product.modelUrl && product.modelUrl.trim() !== "" ? (
            <div className="w-full h-full max-h-[500px]">
               <ModelViewer url={product.modelUrl} />
            </div>
          ) : (
            <img 
              src={product.image || "https://placehold.co/600x600/png?text=No+Image"} 
              alt={product.name} 
              className="max-w-full h-auto rounded-xl object-cover shadow-sm hover:scale-105 transition-transform duration-500"
            />
          )}
        </div>

        {/* NỬA BÊN PHẢI: Thông tin chốt đơn */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Mô hình 3D
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="text-4xl font-black text-blue-600 mb-6">

            {product.basePrice?.toLocaleString('vi-VN')} đ
          </div>
          
          <p className="text-lg text-gray-600 mb-10 whitespace-pre-line leading-relaxed">
            {product.description}
          </p>

         <AddToCartButton product={{
            _id: product._id.toString(), // Phải đổi ID sang chuỗi để truyền cho Client
            name: product.name,
            basePrice: product.basePrice,
            image: product.image
          }} />
          
          <div className="mt-6 flex items-center justify-center gap-4 text-sm font-medium text-gray-500">
            <span className="flex items-center gap-1"> In bằng nhựa an toàn</span>
            <span className="flex items-center gap-1"> Đóng gói chống sốc</span>
          </div>
        </div>

      </div>
    </div>
  );
}