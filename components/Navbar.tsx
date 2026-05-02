'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/products', label: 'Products' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-blue rounded-sm flex items-center justify-center text-white font-bold text-xl">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl leading-none tracking-tight text-slate-900">RAYAN<span className="text-brand-blue">SPORTS</span></span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">Manufacturers & Exporters</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:space-x-8 items-center text-sm font-semibold uppercase tracking-wider">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive(link.href) 
                    ? 'text-brand-blue' 
                    : 'text-slate-900 hover:text-brand-blue'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/request-quote" 
              className="ml-4 px-5 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-blue transition-colors rounded-none"
            >
              Get a Quote
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="pt-2 pb-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-blue-50 border-brand-blue text-brand-blue'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 mt-4">
              <Link 
                href="/request-quote" 
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-blue hover:bg-blue-700"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
