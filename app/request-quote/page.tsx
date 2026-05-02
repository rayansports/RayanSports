'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

function QuoteForm() {
  const searchParams = useSearchParams();
  const defaultProduct = searchParams.get('product') || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    productName: defaultProduct,
    quantity: '',
    size: '',
    fabric: '',
    printingMethod: '',
    name: '',
    email: '',
    phone: '',
    country: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFirestoreError = (err: any) => {
    console.error(err);
    setError('Failed to submit quote request. Please try again.');
  };

  const submitToFirebase = async () => {
    setIsSubmitting(true);
    setError('');
    const inquiryId = uuidv4();
    try {
      const payload = {
        ...formData,
        status: 'new',
        createdAt: serverTimestamp()
      };
      
      const inquiryRef = doc(collection(db, 'inquiries'), inquiryId);
      await setDoc(inquiryRef, payload);
      setSuccess('Your request has been successfully submitted! We will contact you within 24 hours.');
      setFormData({
        productName: '',
        quantity: '',
        size: '',
        fabric: '',
        printingMethod: '',
        name: '',
        email: '',
        phone: '',
        country: '',
        message: ''
      });
    } catch (err) {
      handleFirestoreError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppLink = () => {
    const text = `*New Quote Request*%0A%0A*Product:* ${formData.productName}%0A*Quantity:* ${formData.quantity}%0A*Size:* ${formData.size}%0A*Fabric:* ${formData.fabric}%0A*Printing:* ${formData.printingMethod}%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone}%0A*Country:* ${formData.country}%0A*Message:* ${formData.message}`;
    return `https://wa.me/923034707072?text=${text}`;
  };

  const generateEmailLink = () => {
    const subject = `Quote Request: ${formData.productName}`;
    const body = `Product: ${formData.productName}%0AQuantity: ${formData.quantity}%0ASize: ${formData.size}%0AFabric: ${formData.fabric}%0APrinting Method: ${formData.printingMethod}%0A%0AContact Details:%0AName: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0ACountry: ${formData.country}%0A%0AMessage:%0A${formData.message}`;
    return `mailto:rayansports@hotmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    submitToFirebase().then(() => {
      window.open(generateWhatsAppLink(), '_blank');
    });
  };

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    submitToFirebase().then(() => {
      window.location.href = generateEmailLink();
    });
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h3>
        <p className="text-gray-600 text-lg">{success}</p>
        <button
          onClick={() => setSuccess('')}
          className="mt-8 text-brand-blue font-medium hover:underline"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {/* Product Details Section */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1f5fa8] border-b border-slate-700 pb-2 mb-6">Product Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full">
            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Product Name / Type *</label>
            <input required type="text" name="productName" value={formData.productName} onChange={handleChange} className="w-full bg-slate-800 border-none text-white text-xs p-3 focus:ring-1 focus:ring-brand-blue outline-none" placeholder="e.g., Sublimated Soccer Kits" />
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Quantity *</label>
            <input required type="text" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full bg-slate-800 border-none text-white text-xs p-3 focus:ring-1 focus:ring-brand-blue outline-none" placeholder="e.g., 50 sets" />
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Sizes *</label>
            <input required type="text" name="size" value={formData.size} onChange={handleChange} className="w-full bg-slate-800 border-none text-white text-xs p-3 focus:ring-1 focus:ring-brand-blue outline-none" placeholder="e.g., M-20, L-20, XL-10" />
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Fabric Preference</label>
            <select name="fabric" value={formData.fabric} onChange={handleChange} className="w-full bg-slate-800 border-none text-white text-xs p-3 focus:ring-1 focus:ring-brand-blue outline-none">
              <option value="">Select Fabric (Optional)</option>
              <option value="100% Polyester Mesh">100% Polyester Mesh</option>
              <option value="Polyester/Spandex Blend">Polyester/Spandex Blend</option>
              <option value="Cotton Blend">Cotton Blend</option>
              <option value="Fleece">Fleece</option>
              <option value="Other / Not Sure">Other / Let manufacturer suggest</option>
            </select>
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Printing Method</label>
            <select name="printingMethod" value={formData.printingMethod} onChange={handleChange} className="w-full bg-slate-800 border-none text-white text-xs p-3 focus:ring-1 focus:ring-brand-blue outline-none">
              <option value="">Select Printing (Optional)</option>
              <option value="Sublimation">Sublimation (Best for all-over print)</option>
              <option value="Screen Printing">Screen Printing</option>
              <option value="Embroidery">Embroidery</option>
              <option value="Heat Transfer / PU Vinyl">Heat Transfer / PU Vinyl</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1f5fa8] border-b border-slate-700 pb-2 mb-6 mt-10">Your Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Full Name *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-800 border-none text-white text-xs p-3 focus:ring-1 focus:ring-brand-blue outline-none" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Email Address *</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-800 border-none text-white text-xs p-3 focus:ring-1 focus:ring-brand-blue outline-none" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Phone / WhatsApp *</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-800 border-none text-white text-xs p-3 focus:ring-1 focus:ring-brand-blue outline-none" placeholder="+1 234 567 8900" />
          </div>
          <div>
            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Country *</label>
            <input required type="text" name="country" value={formData.country} onChange={handleChange} className="w-full bg-slate-800 border-none text-white text-xs p-3 focus:ring-1 focus:ring-brand-blue outline-none" placeholder="e.g., USA, UK" />
          </div>
          <div className="col-span-full">
            <label className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Additional Details / Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-slate-800 border-none text-white text-xs p-3 focus:ring-1 focus:ring-brand-blue outline-none" placeholder="Tell us more about your design, logo placement, or deadlines..."></textarea>
            <p className="mt-2 text-[9px] text-slate-500 uppercase tracking-widest font-bold">Note: You can easily send us your logo/artwork files when we reply or via WhatsApp directly.</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-800">
        <button 
          type="button"
          disabled={isSubmitting || !formData.productName || !formData.name || !formData.email || !formData.phone || !formData.country || !formData.quantity || !formData.size}
          onClick={handleSubmitWhatsApp}
          className="flex-1 inline-flex justify-center items-center px-6 py-4 border-2 border-green-500 rounded-none shadow-sm text-[10px] font-black uppercase tracking-widest text-green-500 bg-transparent hover:bg-green-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit via WhatsApp
        </button>
        <button 
          type="button"
          disabled={isSubmitting || !formData.productName || !formData.name || !formData.email || !formData.phone || !formData.country || !formData.quantity || !formData.size}
          onClick={handleSubmitEmail}
          className="flex-1 inline-flex justify-center items-center px-6 py-4 border border-transparent rounded-none shadow-sm text-[10px] font-black uppercase tracking-widest text-[#1f5fa8] bg-white hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit via Email
        </button>
      </div>
    </form>
  );
}

export default function RequestQuotePage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-none overflow-hidden border border-slate-200 shadow-sm bg-slate-900 text-white">
          <div className="p-10 border-b border-slate-800 flex flex-col">
            <div className="inline-block px-3 py-1 bg-[#1f5fa8] text-white text-[10px] font-bold uppercase tracking-widest self-start mb-4">Request for Quote</div>
            <h1 className="text-3xl font-black uppercase tracking-tighter sm:text-4xl">Immediate B2B Inquiries</h1>
            <p className="mt-2 text-xs text-slate-400 font-bold tracking-widest uppercase">Fill out this form to receive pricing within 24 hours.</p>
          </div>
          <div className="p-8 sm:p-12">
            <Suspense fallback={<div className="text-center py-10 uppercase text-xs font-bold tracking-widest text-slate-500">Loading form...</div>}>
              <QuoteForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
