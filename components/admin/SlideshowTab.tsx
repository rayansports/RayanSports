'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/app/admin/utils';
import MediaUploader from './MediaUploader';

export default function SlideshowTab() {
  const [slides, setSlides] = useState<any[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);

  // Slideshow form states
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideForm, setSlideForm] = useState({ image: '', title: '', subtitle: '', buttonText: '', buttonLink: '', enabled: true, order: 0 });

  useEffect(() => {
    const q = query(collection(db, 'slideshow'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSlides(data);
    }, (error) => {
      const msg = handleFirestoreError(error, OperationType.LIST, 'slideshow');
      setDataError(msg);
    });
    return () => unsubscribe();
  }, []);

  const saveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingSlideId || `slide-${Date.now()}`;
      await setDoc(doc(db, 'slideshow', id), {
        image: slideForm.image,
        title: slideForm.title,
        subtitle: slideForm.subtitle,
        buttonText: slideForm.buttonText,
        buttonLink: slideForm.buttonLink,
        enabled: slideForm.enabled,
        order: Number(slideForm.order)
      });
      setEditingSlideId(null);
      setSlideForm({ image: '', title: '', subtitle: '', buttonText: '', buttonLink: '', enabled: true, order: 0 });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'slideshow');
    }
  };

  const deleteSlide = async (id: string) => {
    if (!window.confirm('Delete this slide?')) return;
    try {
      await deleteDoc(doc(db, 'slideshow', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `slideshow/${id}`);
    }
  };

  const editSlide = (slide: any) => {
    setEditingSlideId(slide.id);
    setSlideForm({ ...slide });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-1 border border-slate-200 bg-white rounded-2xl shadow-sm p-6 lg:p-8 max-h-[calc(100vh-8rem)] overflow-y-auto sticky top-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-4 mb-6">
          {editingSlideId ? 'Edit Slide' : 'Add New Slide'}
        </h2>
        
        {dataError && (
          <div className="mb-6 p-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl text-left shadow-sm">
            <strong className="font-bold uppercase tracking-widest text-[10px] block mb-1">Error Loading Data</strong>
            {dataError}
          </div>
        )}

        <form onSubmit={saveSlide} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Image URL</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input required type="url" value={slideForm.image} onChange={e => setSlideForm({...slideForm, image: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all mb-3" placeholder="https://..." />
                <MediaUploader accept="image/*" label="Upload Image" onUploadSuccess={(url) => setSlideForm({...slideForm, image: url})} />
              </div>
              {slideForm.image && (
                <div className="w-32 h-32 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0 bg-slate-50">
                  <img src={slideForm.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Title</label>
            <input required type="text" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all" placeholder="Premium Custom Sportswear" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Subtitle</label>
            <textarea required value={slideForm.subtitle} onChange={e => setSlideForm({...slideForm, subtitle: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all" rows={2} placeholder="Global description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Button Text</label>
              <input required type="text" value={slideForm.buttonText} onChange={e => setSlideForm({...slideForm, buttonText: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all" placeholder="View Catalog" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Button Link</label>
              <input required type="text" value={slideForm.buttonLink} onChange={e => setSlideForm({...slideForm, buttonLink: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all" placeholder="/products" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 items-center pt-2">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Order</label>
              <input required type="number" value={slideForm.order} onChange={e => setSlideForm({...slideForm, order: Number(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all" />
            </div>
            <div className="flex items-center space-x-3 pt-5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Enabled</span>
              <button 
                type="button"
                onClick={() => setSlideForm({...slideForm, enabled: !slideForm.enabled})}
                className={`flex items-center justify-center p-1 rounded-full transition-colors w-12 h-6 ${slideForm.enabled ? 'bg-brand-blue' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${slideForm.enabled ? 'translate-x-3' : '-translate-x-3'}`}></div>
              </button>
            </div>
          </div>
          <div className="pt-6 flex gap-3">
            <button type="submit" className="flex-1 bg-brand-blue text-white font-black uppercase tracking-widest text-xs py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Save Slide</button>
            {editingSlideId && (
              <button type="button" onClick={() => { setEditingSlideId(null); setSlideForm({ image: '', title: '', subtitle: '', buttonText: '', buttonLink: '', enabled: true, order: 0 }); }} className="bg-slate-100 text-slate-700 font-black uppercase tracking-widest text-xs py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {slides.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-sm text-slate-500 font-medium shadow-sm">No slides in the database yet. Use the form to add one.</div>
        ) : (
          slides.map(slide => (
            <div key={slide.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center shadow-sm relative overflow-hidden transition-all hover:border-brand-blue/30 group">
              <div className="w-full sm:w-48 h-32 bg-slate-100 flex-shrink-0 relative rounded-lg border border-slate-200 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.image} alt={slide.title} className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                {!slide.enabled && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-black tracking-widest">DISABLED</div>}
              </div>
              <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                <div className="text-[10px] font-black text-brand-blue mb-1.5 uppercase tracking-widest bg-blue-50 inline-block px-2 py-0.5 rounded">Order: {slide.order}</div>
                <h3 className="font-bold text-base text-slate-900 truncate mb-1">{slide.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{slide.subtitle}</p>
                <div className="mt-3 flex gap-4 text-xs font-medium text-slate-400">
                  <span>Button: <strong className="text-slate-700">{slide.buttonText}</strong></span>
                  <span>Link: <strong className="text-slate-700">{slide.buttonLink}</strong></span>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <button onClick={() => editSlide(slide)} className="flex-1 sm:flex-none text-[10px] font-black text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 px-4 py-2 rounded-lg uppercase tracking-widest transition-colors">Edit</button>
                <button onClick={() => deleteSlide(slide.id)} className="flex-1 sm:flex-none text-[10px] font-black text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-lg uppercase tracking-widest transition-colors">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}