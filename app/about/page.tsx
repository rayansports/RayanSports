import Image from "next/image";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about RayanSports, our history in Sialkot, Pakistan, and our commitment to high-quality custom sportswear manufacturing and export.',
};

export default function About() {
  return (
    <div className="min-h-screen pb-16 bg-white font-sans text-slate-900 border-b border-slate-200">
      <div className="bg-slate-50 border-b border-slate-200 py-20 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-block px-3 py-1 bg-blue-100 text-brand-blue text-[10px] font-bold uppercase tracking-widest mb-4">Sialkot, Pakistan</div>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 uppercase tracking-tighter">About RayanSports</h1>
          <p className="mt-4 text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Your Trusted Custom Sportswear Manufacturing Partner.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative h-[400px] rounded-none border border-slate-200 bg-slate-100">
            <Image 
              src="https://picsum.photos/seed/sialkot/800/600" 
              alt="Sialkot Manufacturing" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="border-l-4 border-brand-blue pl-6">
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-wider">Our Heritage</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium">
              Founded in Sialkot, Pakistan—a city renowned globally for its sporting goods manufacturing heritage—RayanSports Manufacturer & Exporters has built a reputation on quality, precision, and reliability.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              We specialize in OEM and private label sportswear, empowering sports brands, clubs, and fitness enterprises around the world by providing top-tier garments manufactured to exact specifications.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-8 md:p-12 border border-slate-200 mb-8">
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div className="flex flex-col">
              <div className="w-10 h-10 bg-brand-blue flex items-center justify-center mb-6 text-white shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-200 pb-2">Our Mission</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">To deliver innovative and high-performance sportswear that elevates athletes and brands globally.</p>
            </div>
            <div className="flex flex-col">
              <div className="w-10 h-10 bg-brand-blue flex items-center justify-center mb-6 text-white shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-200 pb-2">Quality Assurance</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Rigorous multi-stage quality control ensuring every stitch meets international export standards.</p>
            </div>
            <div className="flex flex-col">
              <div className="w-10 h-10 bg-brand-blue flex items-center justify-center mb-6 text-white shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-200 pb-2">Global Export</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Seamless international shipping to USA, UK, Europe, and Australia with reliable logistics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
