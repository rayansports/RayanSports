import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getCategories } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Sportswear Catalog & Categories',
  description: 'Browse our extensive range of high-quality custom sportswear categories including Team Uniforms, Activewear, and Casual wear manufactured in Sialkot.',
};

export default function ProductsPage() {
  const categories = getCategories();

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <div className="bg-slate-50 border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-block px-3 py-1 bg-blue-100 text-brand-blue text-[10px] font-bold uppercase tracking-widest mb-4">Catalog</div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter">Our Products</h1>
          <p className="mt-4 text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Browse our extensive range of high-quality custom sportswear categories. Click on a category to view specific products.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.length === 0 ? (
          <div className="text-center text-xs uppercase tracking-widest font-bold text-slate-500">No categories found. Check the admin panel.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products/${category.slug}`} className="group relative bg-slate-200 h-72 lg:h-80 overflow-hidden rounded-none border border-slate-200 flex flex-col">
                <Image 
                  src={category.image || 'https://picsum.photos/seed/default/800/600'} 
                  alt={category.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-brand-blue/80 transition-all duration-300"></div>
                <div className="absolute bottom-6 left-6 right-6 flex flex-col">
                   <p className="text-[10px] text-white uppercase font-bold tracking-widest opacity-80 border-b border-white/20 pb-2 mb-2">Category</p>
                   <h3 className="text-white font-bold text-lg uppercase tracking-wider">{category.name}</h3>
                   <p className="text-xs text-white/80 line-clamp-2 mt-2 font-medium">{category.description}</p>
                   <div className="mt-4 flex items-center text-[10px] text-white font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     Explore Category &rarr;
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
