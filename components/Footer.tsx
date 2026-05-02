import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-white font-sans shrink-0">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8 border-b border-slate-800 pb-12">
          <div className="space-y-8 xl:col-span-1 border-r border-slate-800 pr-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-blue flex items-center justify-center rounded-sm font-bold text-white text-xl">R</div>
              <div className="flex flex-col">
                <span className="font-black text-xl leading-none tracking-tight text-white">RAYAN<span className="text-brand-blue">SPORTS</span></span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Manufacturers & Exporters</span>
              </div>
            </Link>
            <p className="text-slate-400 text-[10px] leading-relaxed max-w-xs font-bold uppercase tracking-wider">
              Premium Custom Sportswear Manufacturer & Exporters based in Sialkot, Pakistan. Delivering high-quality private label apparel globally.
            </p>
            <div className="flex space-x-6">
              {/* Social icons could go here */}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2 pl-0 xl:pl-8">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-black text-slate-300 tracking-widest uppercase mb-6 border-l-4 border-brand-blue pl-3">Products</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/products/team-sports-uniforms" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors">Team Sports Uniforms</Link></li>
                  <li><Link href="/products/fitness-gym-wear" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors">Fitness & Gym Wear</Link></li>
                  <li><Link href="/products/casual-streetwear" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors">Casual & Streetwear</Link></li>
                  <li><Link href="/products" className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:text-white transition-colors">View All Products &rarr;</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-xs font-black text-slate-300 tracking-widest uppercase mb-6 border-l-4 border-brand-blue pl-3">Company</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/about" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors">Contact</Link></li>
                  <li><Link href="/request-quote" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors">Request a Quote</Link></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8 border-l border-slate-800 pl-0 md:pl-8">
              <div>
                <h3 className="text-xs font-black text-slate-300 tracking-widest uppercase mb-6 border-l-4 border-brand-blue pl-3">Contact Info</h3>
                <ul className="mt-4 space-y-4">
                  <li className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Islam Nagar, Bounken, Kashmir Road</li>
                  <li className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sialkot, Pakistan</li>
                  <li className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-6">
                    <a href="tel:+923034707072" className="hover:text-white transition-colors flex items-center gap-2">
                       <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                         <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.061-4.512 10.063-10.062.001-2.69-1.048-5.219-2.953-7.124s-4.434-2.953-7.125-2.954c-5.549 0-10.063 4.513-10.065 10.063-.001 2.042.593 3.635 1.599 5.307l-.974 3.56 3.655-.959-.519-.322z"/></svg>
                       </span>
                       +92 303 4707072
                    </a>
                  </li>
                  <li className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <a href="mailto:rayansports@hotmail.com" className="hover:text-white transition-colors">rayansports@hotmail.com</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest gap-4">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} RayanSports Manufacturer & Exporters • ISO 9001:2015 Certified
          </p>
          <div className="flex gap-4 sm:gap-6 items-center flex-wrap justify-center">
             <span className="hidden sm:inline">Global Export Partners</span>
             <span className="text-brand-blue">Europe</span>
             <span className="text-brand-blue">USA</span>
             <span className="text-brand-blue">Australia</span>
             <Link href="/admin" className="ml-0 sm:ml-4 px-3 py-2 bg-slate-800 text-white hover:bg-brand-blue transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
