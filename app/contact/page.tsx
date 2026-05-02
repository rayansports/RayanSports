import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with RayanSports for wholesale inquiries, custom orders, and sportswear manufacturing quotes. Based in Sialkot, Pakistan.',
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen pb-16 font-sans text-slate-900 border-b border-slate-200">
      <div className="bg-slate-50 border-b border-slate-200 py-20 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-block px-3 py-1 bg-blue-100 text-brand-blue text-[10px] font-bold uppercase tracking-widest mb-4">Reach Out</div>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 uppercase tracking-tighter">Contact Us</h1>
          <p className="mt-4 text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Get in touch with us for general inquiries, partnership opportunities, or to schedule a visit to our manufacturing facility.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="bg-slate-50 p-8 mb-8 border border-slate-200">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 border-l-4 border-brand-blue pl-3">Our Headquarters</h3>
              <div className="space-y-6 text-sm text-slate-600 font-medium tracking-wide">
                <div className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-4 mt-2 flex-shrink-0" />
                  <span>Islam Nagar, Bounken, Kashmir Road<br/>Sialkot, Pakistan</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5"><svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.061-4.512 10.063-10.062.001-2.69-1.048-5.219-2.953-7.124s-4.434-2.953-7.125-2.954c-5.549 0-10.063 4.513-10.065 10.063-.001 2.042.593 3.635 1.599 5.307l-.974 3.56 3.655-.959-.519-.322z"/></svg></span>
                  <a href="tel:+923034707072" className="hover:text-brand-blue font-black tracking-widest text-[#1f5fa8]">+92 303 4707072</a>
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-4 flex-shrink-0" />
                  <a href="mailto:rayansports@hotmail.com" className="hover:text-brand-blue text-[#1f5fa8] font-bold">rayansports@hotmail.com</a>
                </div>
              </div>
            </div>

            <div className="rounded-none overflow-hidden h-80 relative border border-slate-200 bg-slate-100">
              {/* Fallback to simple iframe map for Sialkot */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107871.32832819875!2d74.45668603417774!3d32.4832598688469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391eebf05050a257%3A0x65c6ed11df82a794!2sSialkot%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1715617062403!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{border: 0}} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="RayanSports Location"
              ></iframe>
            </div>
          </div>

          <div className="bg-slate-900 overflow-hidden border border-slate-800 text-white flex flex-col">
            <div className="p-8 sm:p-10 flex-1">
              <h3 className="text-xl font-black text-white mb-1 tracking-tighter uppercase">Send us a Message</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-8">General Inquiries</p>
              <form action="mailto:rayansports@hotmail.com" method="GET" encType="text/plain" className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Full Name / Subject</label>
                  <input type="text" name="subject" className="w-full bg-slate-800 border-none text-white text-xs p-3 focus:ring-1 focus:ring-brand-blue outline-none" placeholder="Your Name" required />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1">Your Message</label>
                  <textarea name="body" rows={5} className="w-full bg-slate-800 border-none text-white text-xs p-3 focus:ring-1 focus:ring-brand-blue outline-none" placeholder="How can we help you?" required></textarea>
                </div>
                <button type="submit" className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-none text-[10px] font-black uppercase text-white bg-brand-blue hover:brightness-110 tracking-widest transition-all">
                  Send Email
                </button>
                <div className="text-center mt-6 mb-2">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Or message us instantly on</span>
                </div>
                <a href="https://wa.me/923034707072" target="_blank" rel="noopener noreferrer" className="w-full flex justify-center items-center px-6 py-4 border-2 border-green-500 rounded-none text-[10px] font-black text-green-500 bg-transparent hover:bg-green-500 hover:text-white uppercase tracking-widest transition-all">
                  WhatsApp
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
