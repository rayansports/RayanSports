import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategoryBySlug, getProductBySlug } from '@/lib/catalog';

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string; productSlug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  const product = getProductBySlug(resolvedParams.categorySlug, resolvedParams.productSlug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | RayanSports Custom Manufacturing`,
    description: product.description,
    openGraph: {
      title: `${product.name} | RayanSports Customer Sportswear`,
      description: product.description,
      images: [product.image || 'https://picsum.photos/seed/default/800/600'],
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ categorySlug: string; productSlug: string }> }) {
  const resolvedParams = await params;
  
  const category = getCategoryBySlug(resolvedParams.categorySlug);
  
  if (!category) {
    notFound();
  }

  const product = getProductBySlug(resolvedParams.categorySlug, resolvedParams.productSlug);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-slate-900">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="/products" className="hover:text-brand-blue transition-colors">Products</Link>
          <span className="text-slate-300">/</span>
          <Link href={`/products/${category.slug}`} className="hover:text-brand-blue transition-colors">{category.name}</Link>
          <span className="text-slate-300">/</span>
          <span className="text-brand-blue">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Images */}
          <div className="mb-12 lg:mb-0">
            <div className="relative aspect-square rounded-none overflow-hidden border border-slate-200 bg-slate-100">
              <Image 
                src={product.image || 'https://picsum.photos/seed/default/800/600'} 
                alt={product.name} 
                fill 
                className="object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">{product.name}</h1>
            <p className="text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200 leading-relaxed font-medium">
              {product.description}
            </p>

            {Array.isArray(product.features) && product.features.length > 0 && (
              <div className="mb-8 pl-4 border-l-4 border-brand-blue">
                <h3 className="text-xs font-black text-slate-900 mb-4 uppercase tracking-widest">Key Features</h3>
                <ul className="space-y-3">
                  {product.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-3 mt-1.5 shrink-0" />
                      <span className="text-sm text-slate-600 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-slate-50 p-8 mb-8 border border-slate-200">
              <h3 className="text-[10px] font-black text-brand-blue mb-6 uppercase tracking-widest border-b border-slate-200 pb-2">Available Customizations (OEM)</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-6 text-xs">
                <div>
                  <span className="font-bold text-slate-900 uppercase tracking-widest block mb-1">Sizes</span>
                  <span className="text-slate-500 font-medium">Youth & Adult (S - 3XL)</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900 uppercase tracking-widest block mb-1">Fabrics</span>
                  <span className="text-slate-500 font-medium">Polyester, Spandex, Mesh, Cotton</span>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-900 uppercase tracking-widest block mb-1">Printing Methods</span>
                  <span className="text-slate-500 font-medium">Sublimation, Screen Printing, Embroidery, Heat Transfer</span>
                </div>
                <div className="col-span-2">
                  <span className="font-bold text-slate-900 uppercase tracking-widest block mb-1">Logos/Designs</span>
                  <span className="text-slate-500 font-medium">Upload your own artwork during inquiry</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-4">
              <Link 
                href={`/request-quote?product=${encodeURIComponent(product.name)}`}
                className="flex-1 flex justify-center items-center px-8 py-4 border border-transparent rounded-none text-xs font-black text-white bg-brand-blue hover:brightness-110 uppercase tracking-widest transition-all"
              >
                Request Quote
              </Link>
              <a 
                href={`https://wa.me/923034707072?text=Hi, I am interested in ${product.name} (Custom Order).`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex justify-center items-center px-8 py-4 border-2 border-slate-900 rounded-none text-xs font-black text-slate-900 bg-white hover:bg-slate-900 hover:text-white uppercase tracking-widest transition-all"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
