import Link from 'next/link';
import ModelViewer from '@/components/ModelViewer';
import AddToCartButton from '@/components/AddToCartButton';

export default function ProductCard({ product }: { product: any }) {
  return (
    <Link 
      href={`/products/${product._id.toString()}`} 
      className="bg-white rounded-xl shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden block cursor-pointer group flex flex-col h-full"
    >
      <div className="w-full h-[250px] sm:h-[300px] bg-gray-200 overflow-hidden relative">
        {product.modelUrl && product.modelUrl.trim() !== "" ? (
          <ModelViewer url={product.modelUrl} />
        ) : (
          <img 
            src={product.image || "https://placehold.co/400x400/png?text=No+Image"} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-2">{product.name}</h2>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mt-4 gap-3">
          <span className="text-blue-600 font-bold text-xl">
            {product.basePrice?.toLocaleString('vi-VN')} đ
          </span>
          <div className="flex items-center gap-2 w-full xl:w-auto justify-end">
            <span className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-bold hover:bg-gray-200 transition-all text-sm text-center shadow-sm">
              Chi tiết
            </span>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </Link>
  );
}