import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getCategories } from '@/lib/catalog';
import HomepageSlider from '@/components/HomepageSlider';

export const metadata: Metadata = {
  title: 'RayanSports - Premium Custom Sportswear Manufacturer & Exporter',
  description: 'RayanSports is a leading manufacturer & exporter of premium custom sportswear, team uniforms, fitness apparel, and accessories based in Sialkot, Pakistan. Global delivery & OEM services.',
};

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col min-h-screen text-slate-900 font-sans">
      <HomepageSlider />
      
      {/* Categories Preview */}
      <section className="py-16 bg-white border-b border-slate-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
            <h2 className="text-xs font-black uppercase tracking-widest border-l-4 border-brand-blue pl-3">Product Categories</h2>
            <Link href="/products" className="text-[10px] font-bold text-brand-blue uppercase cursor-pointer hover:underline">View All Categories →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((category, index) => (
              <Link key={category.id} href={`/products/${category.slug}`} className="group relative bg-slate-200 h-64 lg:h-72 overflow-hidden rounded-none">
                <Image 
                  src={category.image || 'https://picsum.photos/seed/default/800/600'} 
                  alt={category.name} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-brand-blue/80 transition-all duration-300"></div>
                <div className="absolute bottom-6 left-6">
                  <p className="text-[10px] text-white uppercase font-bold tracking-widest mb-1 opacity-80">0{index + 1}</p>
                  <h3 className="text-white font-bold text-lg uppercase tracking-wider">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-slate-900 leading-tight mb-6 tracking-tight uppercase">Manufacturing <br/> <span className="text-brand-blue">Excellence</span></h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed max-w-lg">
                Based in Sialkot, Pakistan—the global hub of sporting goods—RayanSports combines traditional craftsmanship with modern technology to deliver premium sportswear.
              </p>
              <dl className="mt-10 space-y-8">
                {[
                  { title: 'Global Export Quality', desc: 'Operating at the same standards as top global suppliers.' },
                  { title: 'Full Customization (OEM)', desc: 'From fabric selection to sublimation, screen printing, and embroidery.' },
                  { title: 'Competitive Pricing', desc: 'Direct from manufacturer pricing ensures maximum margin for your brand.' }
                ].map((feature, i) => (
                  <div key={i} className="flex flex-col">
                    <dt className="text-xs font-black uppercase tracking-widest text-slate-900 border-l-4 border-brand-blue pl-3 mb-2">{feature.title}</dt>
                    <dd className="mt-1 text-sm text-slate-500 pl-4">{feature.desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-16 lg:mt-0">
              <div className="relative h-[600px] rounded-none overflow-hidden border border-slate-200">
                <Image 
                  src="https://picsum.photos/seed/factory/800/1000" 
                  alt="Factory Production" 
                  fill 
                  className="object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Global CTA */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Ready to Start Production?</h2>
          <p className="text-sm text-slate-400 mb-8 max-w-2xl mx-auto">Get a customized quotation for your private label sportswear within 24 hours.</p>
          <Link href="/request-quote" className="px-10 py-5 bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all rounded-none inline-flex">
            Request a Free Quote
          </Link>
        </div>
      </section>
    </div>
  );
}
