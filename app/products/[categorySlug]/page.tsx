import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategoryBySlug } from '@/lib/catalog';

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.categorySlug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} | RayanSports`,
    description: category.description,
    openGraph: {
      title: `${category.name} | RayanSports Manufacturing`,
      description: category.description,
      images: [category.image || 'https://picsum.photos/seed/default/800/600'],
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const resolvedParams = await params;
  
  const category = await getCategoryBySlug(resolvedParams.categorySlug);
  
  if (!category) {
    notFound();
  }

  const categoryProducts = category.products || [];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      <div className="relative bg-slate-900 py-24 border-b border-slate-200">
        <div className="absolute inset-0 overflow-hidden">
          <Image 
            src={category.image || 'https://picsum.photos/seed/default/800/600'} 
            alt={category.name} 
            fill 
            className="object-cover opacity-20" 
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-block px-3 py-1 bg-brand-blue/20 text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-4">Category</div>
          <h1 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter">{category.name}</h1>
          <p className="mt-4 text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryProducts.length > 0 ? (
            categoryProducts.map(product => (
              <div key={product.id} className="bg-white border border-slate-200 flex flex-col group rounded-none">
                <Link href={`/products/${category.slug}/${product.slug}`} className="block relative h-64 overflow-hidden bg-slate-100">
                  <Image 
                    src={product.image || 'https://picsum.photos/seed/default/800/600'} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300"></div>
                </Link>
                <div className="p-6 flex flex-col flex-grow bg-white border-t border-slate-200">
                  <Link href={`/products/${category.slug}/${product.slug}`}>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-blue mb-2 uppercase tracking-wide transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-slate-500 text-xs mb-6 flex-grow leading-relaxed">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <Link 
                      href={`/products/${category.slug}/${product.slug}`}
                      className="text-[10px] text-brand-blue font-black uppercase tracking-widest hover:underline"
                    >
                      View Details
                    </Link>
                    <Link 
                      href={`/request-quote?product=${encodeURIComponent(product.name)}`}
                      className="px-4 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-brand-blue transition-colors rounded-none"
                    >
                      Inquire
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 border border-slate-200 bg-slate-50">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">More products coming soon to this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
