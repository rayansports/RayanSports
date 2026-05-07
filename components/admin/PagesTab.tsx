'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/app/admin/utils';
import { Plus, Edit2, Trash2, X, Check, FileText } from 'lucide-react';

export default function PagesTab() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialFormState = { title: '', slug: '', content: '', metaDescription: '', isActive: true };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const q = query(collection(db, 'pages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, error => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'pages');
      } catch (err) {}
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openForm = (page?: any) => {
    if (page) {
      setEditingId(page.id);
      setFormData({ 
        title: page.title, 
        slug: page.slug, 
        content: page.content || '', 
        metaDescription: page.metaDescription || '',
        isActive: page.isActive !== undefined ? page.isActive : true 
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsFormOpen(true);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const savePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingId || `page-${Date.now()}`;
      const payload: any = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        metaDescription: formData.metaDescription,
        isActive: formData.isActive,
        updatedAt: serverTimestamp()
      };
      
      if (!editingId) {
        payload.createdAt = serverTimestamp();
      } else {
        const existingPage = pages.find(p => p.id === id);
        payload.createdAt = existingPage?.createdAt || serverTimestamp();
      }
      
      await setDoc(doc(db, 'pages', id), payload);
      setIsFormOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'pages');
    }
  };

  const deletePage = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the page "${title}"?`)) return;
    try {
      await deleteDoc(doc(db, 'pages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `pages/${id}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 leading-none">Pages Management</h2>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Manage custom pages (e.g. Terms, Privacy, FAQ)</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => openForm()}
            className="bg-brand-blue border-2 border-brand-blue text-white px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 hover:border-blue-700 transition shadow-sm flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> New Page
          </button>
        </div>
      </div>

      {isFormOpen ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden mb-8 transform transition-all border-b-4 border-b-brand-blue">
          <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-200">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
              {editingId ? 'Edit Page' : 'Add New Page'}
            </h3>
            <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <form onSubmit={savePage} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Page Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all" placeholder="e.g. Privacy Policy" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">URL Slug</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: generateSlug(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-300" placeholder="privacy-policy" />
                </div>
                <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Page Status</h3>
                    <p className="text-xs text-slate-500 mt-1">If turned off, this page will return a 404 error.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`flex items-center justify-center p-1 rounded-full transition-colors w-12 h-6 ${formData.isActive ? 'bg-brand-blue' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-3' : '-translate-x-3'}`}></div>
                  </button>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Meta Description (SEO)</label>
                  <textarea value={formData.metaDescription} onChange={e => setFormData({...formData, metaDescription: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" rows={2}></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Page Content (Markdown / HTML)</label>
                  <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border border-slate-300 rounded-lg p-4 text-sm font-mono focus:ring-2 focus:ring-brand-blue outline-none transition-all min-h-[300px]" placeholder="# Heading 1&#10;Write markdown content here..."></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                <button type="submit" className="bg-brand-blue text-white px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-sm flex items-center gap-2"><Check className="w-4 h-4"/> {editingId ? 'Update' : 'Create'} Page</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-12 text-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
             <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Loading Pages...</p>
           </div>
        ) : pages.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <FileText className="w-8 h-8 text-slate-300" />
             </div>
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-2">No Pages Found</h3>
             <p className="text-slate-500 text-xs">There are no custom pages. Click New Page to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Page Title</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Slug</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Last Updated</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pages.map(page => (
                  <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{page.title}</div>
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-500">
                      /{page.slug}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${page.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {page.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-600 font-medium whitespace-nowrap">
                      {page.updatedAt?.toDate?.().toLocaleDateString() || page.createdAt?.toDate?.().toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200" title="View Page">
                          View
                        </a>
                        <button onClick={() => openForm(page)} className="p-1.5 text-brand-blue hover:bg-blue-100 rounded-lg transition-colors border border-transparent hover:border-blue-200" title="Edit Page">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deletePage(page.id, page.title)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Delete Page">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
