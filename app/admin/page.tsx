'use client';

import { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Helper for generic typing format and fallback
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const auth = getAuth();
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  alert(`Firestore Error: ${errInfo.error}\nCheck console for details.`);
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'inquiries' | 'slideshow'>('inquiries');
  
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Slideshow form states
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideForm, setSlideForm] = useState({ image: '', title: '', subtitle: '', buttonText: '', buttonLink: '', enabled: true, order: 0 });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && activeTab === 'inquiries') {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInquiries(data);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'inquiries');
      });
      return () => unsubscribe();
    } else if (user && activeTab === 'slideshow') {
      const q = query(collection(db, 'slideshow'), orderBy('order', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSlides(data);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'slideshow');
      });
      return () => unsubscribe();
    }
  }, [user, activeTab]);

  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoginError(null);
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
        setLoginError('Login popup closed. Please try again.');
      } else if (error.code === 'auth/unauthorized-domain' || error.message?.includes('cross-origin')) {
        setLoginError('Authentication might be blocked inside an iframe. Please open the application in a new tab (using the button in the top right), and try tracking again.');
      } else {
        setLoginError(error.message || 'Login failed. If you are in the AI Studio preview, please open the app in a new tab to login.');
      }
    }
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const markAsContacted = async (id: string, currentInquiry: any) => {
    if (!window.confirm('Mark this inquiry as contacted?')) return;
    try {
      const ref = doc(db, 'inquiries', id);
      await updateDoc(ref, { 
        status: 'contacted',
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `inquiries/${id}`);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `inquiries/${id}`);
    }
  };

  // Slideshow Methods
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

  if (loadingUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full border bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Admin Login</h2>
          <p className="text-gray-600 mb-8">Sign in with your authorized Google account to view inquiries.</p>
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
          
          <div className="mt-6 text-sm text-amber-700 bg-amber-50 p-4 rounded-lg text-left border border-amber-200">
            <strong>Note:</strong> If you are using the AI Studio preview window, the Google Login popup might be blocked by your browser depending on iframe settings. If the login doesn't work, please click the <strong>"Open in new tab"</strong> icon at the top right of the preview window and try again.
          </div>

          {loginError && (
            <div className="mt-4 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-left">
              {loginError}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-200">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-brand-blue">Admin Control Panel</h1>
            <p className="text-sm text-gray-500 font-medium">Welcome, {user.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-4 sm:mt-0 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-100 font-bold uppercase transition-colors tracking-widest"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-white p-2 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-widest rounded transition-colors whitespace-nowrap ${activeTab === 'inquiries' ? 'bg-brand-blue text-white' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Inquiries
          </button>
          <button 
            onClick={() => setActiveTab('slideshow')}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-widest rounded transition-colors whitespace-nowrap ${activeTab === 'slideshow' ? 'bg-brand-blue text-white' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Slideshow CMS
          </button>
        </div>

        {activeTab === 'inquiries' && (
          <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
            {loadingData ? (
              <div className="p-8 text-center text-gray-500">Loading inquiries...</div>
            ) : inquiries.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by sharing your website link.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Info</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product Specs</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className={inquiry.status === 'new' ? 'bg-blue-50/20' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{inquiry.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-widest leading-tight ${
                              inquiry.status === 'new' ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {(inquiry.status || 'new')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">{inquiry.name}</div>
                          <div className="text-sm text-gray-500">{inquiry.email}</div>
                          <div className="text-sm text-gray-500">{inquiry.phone}</div>
                          <div className="text-xs text-brand-blue mt-1 font-bold">{inquiry.country}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900 mb-1">{inquiry.productName}</div>
                          <div className="text-xs text-gray-700"><span className="font-semibold">Q:</span> {inquiry.quantity} | <span className="font-semibold">Sizes:</span> {inquiry.size}</div>
                          {inquiry.fabric && <div className="text-xs text-gray-500"><span className="font-semibold">Fabric:</span> {inquiry.fabric}</div>}
                          {inquiry.printingMethod && <div className="text-xs text-gray-500"><span className="font-semibold">Print:</span> {inquiry.printingMethod}</div>}
                          {inquiry.message && (
                            <div className="mt-2 text-xs italic text-gray-500 border-l-2 border-brand-blue pl-2 max-w-xs truncate" title={inquiry.message}>
                              &quot;{inquiry.message}&quot;
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex flex-col gap-2 items-end">
                            {inquiry.status === 'new' && (
                              <button 
                                onClick={() => markAsContacted(inquiry.id, inquiry)}
                                className="text-brand-blue bg-blue-50 border border-blue-100 hover:bg-blue-100 px-3 py-1 rounded transition-colors text-[10px] font-bold uppercase tracking-widest"
                              >
                                Mark Contacted
                              </button>
                            )}
                            <a 
                              href={`https://wa.me/${(inquiry.phone || '').replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 font-bold uppercase tracking-widest text-[10px]"
                            >
                              WhatsApp Reply
                            </a>
                            <button 
                              onClick={() => deleteInquiry(inquiry.id)}
                              className="text-red-500 hover:text-red-700 transition-colors mt-1 font-bold uppercase tracking-widest text-[10px]"
                            >
                              Delete
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
        )}

        {activeTab === 'slideshow' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 border border-gray-200 bg-white rounded-xl shadow-sm p-6 overflow-y-auto">
              <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 border-b border-gray-200 pb-2 mb-4">
                {editingSlideId ? 'Edit Slide' : 'Add New Slide'}
              </h2>
              <form onSubmit={saveSlide} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-1">Image URL</label>
                  <input required type="url" value={slideForm.image} onChange={e => setSlideForm({...slideForm, image: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-1">Title</label>
                  <input required type="text" value={slideForm.title} onChange={e => setSlideForm({...slideForm, title: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="Premium Custom Sportswear" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-1">Subtitle</label>
                  <textarea required value={slideForm.subtitle} onChange={e => setSlideForm({...slideForm, subtitle: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm" rows={2} placeholder="Global description..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-1">Button Text</label>
                    <input required type="text" value={slideForm.buttonText} onChange={e => setSlideForm({...slideForm, buttonText: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="View Catalog" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-1">Button Link</label>
                    <input required type="text" value={slideForm.buttonLink} onChange={e => setSlideForm({...slideForm, buttonLink: e.target.value})} className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="/products" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-700 mb-1">Order</label>
                    <input required type="number" value={slideForm.order} onChange={e => setSlideForm({...slideForm, order: Number(e.target.value)})} className="w-full border border-gray-300 rounded p-2 text-sm" />
                  </div>
                  <div className="flex items-center space-x-2 pt-5">
                    <input type="checkbox" id="enabled" checked={slideForm.enabled} onChange={e => setSlideForm({...slideForm, enabled: e.target.checked})} className="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300 rounded" />
                    <label htmlFor="enabled" className="text-xs font-bold uppercase tracking-widest text-gray-700">Enabled</label>
                  </div>
                </div>
                <div className="pt-4 flex gap-2">
                  <button type="submit" className="flex-1 bg-brand-blue text-white font-bold uppercase tracking-widest text-xs py-3 rounded hover:bg-blue-700 transition">Save Slide</button>
                  {editingSlideId && (
                    <button type="button" onClick={() => { setEditingSlideId(null); setSlideForm({ image: '', title: '', subtitle: '', buttonText: '', buttonLink: '', enabled: true, order: 0 }); }} className="bg-gray-200 text-gray-700 font-bold uppercase tracking-widest text-xs py-3 px-4 rounded hover:bg-gray-300 transition">Cancel</button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {slides.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500 font-medium">No slides in the database yet. Use the form to add one.</div>
              ) : (
                slides.map(slide => (
                  <div key={slide.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center shadow-sm relative overflow-hidden">
                    <div className="w-32 h-20 bg-gray-100 flex-shrink-0 relative rounded border border-gray-200 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={slide.image} alt={slide.title} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                      {!slide.enabled && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-black tracking-widest">DISABLED</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-black text-brand-blue mb-1 uppercase tracking-widest">Order: {slide.order}</div>
                      <h3 className="font-bold text-sm text-gray-900 truncate">{slide.title}</h3>
                      <p className="text-xs text-gray-500 truncate">{slide.subtitle}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => editSlide(slide)} className="text-[10px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded uppercase tracking-widest">Edit</button>
                      <button onClick={() => deleteSlide(slide.id)} className="text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded uppercase tracking-widest">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
