'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  enabled: boolean;
  order: number;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 'default-1',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2067&auto=format&fit=crop',
    title: 'Premium Custom Sportswear',
    subtitle: 'Global OEM & Private Label manufacturing partner. Delivering export-quality team uniforms.',
    buttonText: 'View Catalog',
    buttonLink: '/products',
    enabled: true,
    order: 0,
  },
  {
    id: 'default-2',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=2026&auto=format&fit=crop',
    title: 'American Football Uniforms',
    subtitle: 'Professional-grade uniforms designed to withstand aggressive impacts.',
    buttonText: 'Request a Quote',
    buttonLink: '/request-quote',
    enabled: true,
    order: 1,
  }
];

export default function HomepageSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);

  useEffect(() => {
    const fetchSlides = async () => {
      if (!db) return; // In case db is undefined during SSR/hydration
      try {
        const q = query(collection(db, 'slideshow'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Slide));
          const active = fetched.filter(s => s.enabled);
          if (active.length > 0) {
            setSlides(active);
          }
        }
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };
    fetchSlides();
  }, []);

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[85vh] bg-slate-900 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
          <Image
            src={slide.image || 'https://picsum.photos/seed/hero/1920/1080'}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg transform transition-transform duration-700 translate-y-0">
              {slide.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-200 font-medium max-w-2xl drop-shadow mb-8">
              {slide.subtitle}
            </p>
            {slide.buttonText && slide.buttonLink && (
              <Link 
                href={slide.buttonLink} 
                className="px-8 py-4 bg-[#FF0000] text-white font-bold uppercase tracking-widest text-sm hover:bg-brand-blue hover:text-white transition-all rounded-none inline-flex transform hover:scale-105"
              >
                {slide.buttonText}
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide(prev => prev === 0 ? slides.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-4 bg-white/10 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-all"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide(prev => prev === slides.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-4 bg-white/10 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-all"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
