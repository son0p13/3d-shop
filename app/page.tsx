import dbConnect from '@/lib/mongodb';
import { Flame, Sparkles, SearchX, ArrowRight } from 'lucide-react'; 
import Product from '@/models/Product';
import SearchBar from '@/components/SearchBar'; 
import ProductFilter from '@/components/ProductFilter';
import ProductCard from '@/components/ProductCard'; 
import HeroBanner from '@/components/HeroBanner';
import Link from 'next/link';

const formatProduct = (product: any) => ({
  ...product,
  _id: product._id.toString(),
  createdAt: product.createdAt ? product.createdAt.toString() : null,
  updatedAt: product.updatedAt ? product.updatedAt.toString() : null,
});
async function getFilteredProducts(keyword: string, category: string, price: string) {
  await dbConnect();
  const filter: any = {};

  if (keyword) {
    filter.name = { $regex: keyword, $options: 'i' };
  }

  if (category && category !== 'Tất cả') {
    filter.category = category;
  }

  if (price === 'duoi-100') {
    filter.basePrice = { $lt: 100000 };
  } else if (price === '100-300') {
    filter.basePrice = { $gte: 100000, $lte: 300000 };
  } else if (price === 'tren-300') {
    filter.basePrice = { $gt: 300000 };
  }

  const products = await Product.find(filter).sort({ createdAt: -1 }).lean(); 
  return products.map(formatProduct);
}

async function getDashboardProducts() {
  await dbConnect();
  const newProducts = await Product.find({}).sort({ createdAt: -1 }).limit(8).lean();
  const featuredProducts = await Product.find({}).sort({ basePrice: -1 }).limit(8).lean();

  return {
    newProducts: newProducts.map(formatProduct),
    featuredProducts: featuredProducts.map(formatProduct)
  };
}

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  
  const keyword = (typeof params.search === 'string' ? params.search : '') || '';
  const category = (typeof params.category === 'string' ? params.category : '') || '';
  const price = (typeof params.price === 'string' ? params.price : '') || '';
  const viewAll = params.view === 'all';
  const isFiltering = keyword || (category && category !== 'Tất cả') || price || viewAll;
  let filteredProducts: any[] = [];
  let newProducts: any[] = [];
  let featuredProducts: any[] = [];
  if (isFiltering) {
    filteredProducts = await getFilteredProducts(keyword, category, price);
  } else {
    const dashboardData = await getDashboardProducts();
    newProducts = dashboardData.newProducts;
    featuredProducts = dashboardData.featuredProducts;
  }

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-50">
      
      <div className="max-w-7xl mx-auto mb-8 flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold text-blue-600">Mixi3Ds</h1>
        <SearchBar />
      </div>
      {!isFiltering && <HeroBanner />}
      {!isFiltering && (
        <div className="max-w-7xl mx-auto mt-6 flex justify-end">
          <Link 
            href="/?view=all" 
            className="flex items-center gap-2 bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            Xem toàn bộ sản phẩm <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="mt-8">
        <ProductFilter />
      </div>
      {isFiltering ? (
        <>
          <div className="max-w-7xl mx-auto mb-6">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
              {viewAll ? "Tất cả sản phẩm" : "Kết quả tìm kiếm"}: <span className="text-blue-600">{filteredProducts.length}</span> sản phẩm
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {filteredProducts.length === 0 ? (
              <p className="text-center col-span-full text-xl text-gray-500 py-10">Không tìm thấy sản phẩm nào.</p>
            ) : (
              filteredProducts.map((p) => <ProductCard key={p._id} product={p} />)
            )}
          </div>
        </>
      ) : (
        <div className="max-w-7xl mx-auto flex flex-col gap-16 pb-12 mt-10">
                    <section>
            <div className="flex items-center gap-3 mb-6 border-b-2 border-red-500 pb-2 inline-flex">
              <Flame className="w-8 h-8 text-red-500 animate-pulse" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Sản Phẩm Nổi Bật</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
          <section>
            <div className="flex items-center gap-3 mb-6 border-b-2 border-blue-500 pb-2 inline-flex">
              <Sparkles className="w-8 h-8 text-blue-500" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Mới Lên Kệ</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>

        </div>
      )}
    </main>
  );
}