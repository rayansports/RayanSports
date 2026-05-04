'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, setDoc, deleteDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/app/admin/utils';
import { Plus, Edit2, Trash2, X, Check, Image as ImageIcon, Search } from 'lucide-react';

export default function ProductsTab() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [viewMode, setViewMode] = useState<'products' | 'categories'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Forms
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const initialCategoryState = { parentId: '', name: '', slug: '', image: '', description: '' };
  const [categoryForm, setCategoryForm] = useState(initialCategoryState);

  const initialProductState = { categoryId: '', name: '', slug: '', image: '', videoUrl: '', mediaUrls: [''], description: '', features: [''] };
  const [productForm, setProductForm] = useState(initialProductState);

  useEffect(() => {
    const qCategories = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unSubCategories = onSnapshot(qCategories, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, error => handleFirestoreError(error, OperationType.LIST, 'categories'));

    const qProducts = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unSubProducts = onSnapshot(qProducts, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, error => handleFirestoreError(error, OperationType.LIST, 'products'));

    return () => {
      unSubCategories();
      unSubProducts();
    };
  }, []);

  const openCategoryForm = (category?: any) => {
    if (category) {
      setEditingId(category.id);
      setCategoryForm({ parentId: category.parentId || '', name: category.name, slug: category.slug, image: category.image || '', description: category.description || '' });
    } else {
      setEditingId(null);
      setCategoryForm(initialCategoryState);
    }
    setViewMode('categories');
    setIsFormOpen(true);
  };

  const openProductForm = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setProductForm({ 
        categoryId: product.categoryId, 
        name: product.name, 
        slug: product.slug, 
        image: product.image || '', 
        videoUrl: product.videoUrl || '',
        mediaUrls: product.mediaUrls && product.mediaUrls.length ? product.mediaUrls : [''],
        description: product.description || '', 
        features: product.features && product.features.length ? product.features : [''] 
      });
    } else {
      setEditingId(null);
      setProductForm({ ...initialProductState, categoryId: selectedCategory !== 'all' ? selectedCategory : '' });
    }
    setViewMode('products');
    setIsFormOpen(true);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingId || `cat-${Date.now()}`;
      const payload: any = {
        name: categoryForm.name,
        slug: categoryForm.slug || generateSlug(categoryForm.name),
        image: categoryForm.image,
        description: categoryForm.description
      };
      
      if (categoryForm.parentId) {
        payload.parentId = categoryForm.parentId;
      }
      
      if (!editingId) {
        payload.createdAt = serverTimestamp();
      } else {
        const existingCat = categories.find(c => c.id === id);
        payload.createdAt = existingCat?.createdAt || serverTimestamp();
      }
      
      await setDoc(doc(db, 'categories', id), payload);
      setIsFormOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'categories');
    }
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = editingId || `prod-${Date.now()}`;
      const payload: any = {
        categoryId: productForm.categoryId,
        name: productForm.name,
        slug: productForm.slug || generateSlug(productForm.name),
        image: productForm.image,
        description: productForm.description,
        features: productForm.features.filter(f => f.trim() !== '')
      };

      if (productForm.videoUrl) payload.videoUrl = productForm.videoUrl;
      const filteredMedia = productForm.mediaUrls.filter(m => m.trim() !== '');
      if (filteredMedia.length > 0) payload.mediaUrls = filteredMedia;
      
      if (!editingId) {
        payload.createdAt = serverTimestamp();
      } else {
        const existingProd = products.find(p => p.id === id);
        payload.createdAt = existingProd?.createdAt || serverTimestamp();
      }
      
      await setDoc(doc(db, 'products', id), payload);
      setIsFormOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    }
  };

  const deleteCategory = async (id: string, name: string) => {
    if (products.some(p => p.categoryId === id) || categories.some(c => c.parentId === id)) {
      alert(`Cannot delete category "${name}" because it is in use by products or sub-categories.`);
      return;
    }
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      if (selectedCategory === id) setSelectedCategory('all');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...productForm.features];
    newFeatures[index] = value;
    setProductForm({ ...productForm, features: newFeatures });
  };
  
  const addFeature = () => setProductForm({ ...productForm, features: [...productForm.features, ''] });
  const removeFeature = (index: number) => setProductForm({ ...productForm, features: productForm.features.filter((_, i) => i !== index) });

  const handleMediaChange = (index: number, value: string) => {
    const newMedia = [...productForm.mediaUrls];
    newMedia[index] = value;
    setProductForm({ ...productForm, mediaUrls: newMedia });
  };
  
  const addMedia = () => setProductForm({ ...productForm, mediaUrls: [...productForm.mediaUrls, ''] });
  const removeMedia = (index: number) => setProductForm({ ...productForm, mediaUrls: productForm.mediaUrls.filter((_, i) => i !== index) });

  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 leading-none">Catalog Management</h2>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Manage products and categories</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setViewMode('categories'); openCategoryForm(); }}
            className="bg-white border-2 border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Category
          </button>
          <button 
            onClick={() => { setViewMode('products'); openProductForm(); }}
            className="bg-brand-blue border-2 border-brand-blue text-white px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 hover:border-blue-700 transition shadow-sm flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Product
          </button>
        </div>
      </div>

      {isFormOpen ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden mb-8 transform transition-all border-b-4 border-b-brand-blue">
          <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-200">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
              {editingId ? `Edit ${viewMode === 'categories' ? 'Category' : 'Product'}` : `Add New ${viewMode === 'categories' ? 'Category' : 'Product'}`}
            </h3>
            <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {viewMode === 'categories' ? (
              <form onSubmit={saveCategory} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Parent Category (Optional)</label>
                    <select value={categoryForm.parentId} onChange={e => setCategoryForm({...categoryForm, parentId: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all bg-white">
                      <option value="">None (Main Category)</option>
                      {categories.filter(c => !editingId || c.id !== editingId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Category Name</label>
                    <input required type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all" placeholder="e.g. American Football" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">URL Slug</label>
                    <input type="text" value={categoryForm.slug} onChange={e => setCategoryForm({...categoryForm, slug: generateSlug(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-300" placeholder="american-football (auto-generated)" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Image URL</label>
                    <input required type="url" value={categoryForm.image} onChange={e => setCategoryForm({...categoryForm, image: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" placeholder="https://..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
                    <textarea required value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" rows={3}></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                  <button type="submit" className="bg-brand-blue text-white px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-sm flex items-center gap-2"><Check className="w-4 h-4"/> {editingId ? 'Update' : 'Create'} Category</button>
                </div>
              </form>
            ) : (
              <form onSubmit={saveProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Category</label>
                    <select required value={productForm.categoryId} onChange={e => setProductForm({...productForm, categoryId: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all bg-white">
                      <option value="">Select a category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Product Name</label>
                    <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all" placeholder="e.g. Pro Team Jersey" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">URL Slug</label>
                    <input type="text" value={productForm.slug} onChange={e => setProductForm({...productForm, slug: generateSlug(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all placeholder:text-slate-300" placeholder="pro-team-jersey" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Primary Image URL</label>
                    <input required type="url" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Video URL (Optional)</label>
                    <input type="url" value={productForm.videoUrl} onChange={e => setProductForm({...productForm, videoUrl: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all" placeholder="YouTube or video link..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Description</label>
                    <textarea required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-all" rows={3}></textarea>
                  </div>
                  
                  {/* Media Gallery List */}
                  <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-800 mb-3 flex items-center justify-between">
                      <span>Additional Media Gallery Images</span>
                      <button type="button" onClick={addMedia} className="text-brand-blue hover:text-blue-800 flex items-center gap-1">+ Add</button>
                    </label>
                    <div className="space-y-3">
                      {productForm.mediaUrls.map((media, idx) => (
                        <div key={idx} className="flex gap-2 relative group">
                          <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                          <input 
                            type="url" 
                            value={media} 
                            onChange={e => handleMediaChange(idx, e.target.value)} 
                            className="w-full border border-slate-300 rounded-lg py-2.5 pr-10 pl-9 text-sm focus:ring-1 focus:ring-brand-blue outline-none transition-all" 
                            placeholder="https://... secondary image/video" 
                          />
                          {productForm.mediaUrls.length > 1 && (
                            <button type="button" onClick={() => removeMedia(idx)} className="absolute right-2 top-2 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-800 mb-3 flex items-center justify-between">
                      <span>Features / Highlights</span>
                      <button type="button" onClick={addFeature} className="text-brand-blue hover:text-blue-800 flex items-center gap-1">+ Add</button>
                    </label>
                    <div className="space-y-3">
                      {productForm.features.map((feature, idx) => (
                        <div key={idx} className="flex gap-2 relative group">
                          <div className="absolute left-3 top-3 text-[10px] font-black text-slate-300">{idx + 1}.</div>
                          <input 
                            type="text" 
                            value={feature} 
                            onChange={e => handleFeatureChange(idx, e.target.value)} 
                            className="w-full border border-slate-300 rounded-lg py-2.5 pr-10 pl-8 text-sm focus:ring-1 focus:ring-brand-blue outline-none transition-all" 
                            placeholder="e.g. 100% Polyester Dri-Fit" 
                          />
                          {productForm.features.length > 1 && (
                            <button type="button" onClick={() => removeFeature(idx)} className="absolute right-2 top-2 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors">Cancel</button>
                  <button type="submit" className="bg-brand-blue text-white px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-sm flex items-center gap-2"><Check className="w-4 h-4"/> {editingId ? 'Update' : 'Create'} Product</button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 border border-slate-200 rounded-2xl p-5 shadow-sm h-min bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categories</h3>
            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{categories.length}</span>
          </div>
          <ul className="space-y-1.5 text-sm font-bold">
            <li 
              onClick={() => setSelectedCategory('all')}
              className={`p-3 rounded-xl flex justify-between cursor-pointer transition-all ${selectedCategory === 'all' ? 'bg-brand-blue text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
            >
              <span>All Products</span>
              <span className={selectedCategory === 'all' ? 'text-white/80' : 'text-slate-400'}>{products.length}</span>
            </li>
            
            <div className="h-px bg-slate-100 my-2"></div>
            
            {loading ? (
              <div className="animate-pulse space-y-2 mt-4 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                Loading...
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center p-4 text-xs font-bold uppercase tracking-widest text-slate-400 border border-dashed border-slate-200 rounded-xl my-4">
                No Categories
              </div>
            ) : (
              categories.map(cat => (
                <li key={cat.id} className="group relative">
                  <div 
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-xl flex justify-between cursor-pointer transition-all pr-12 ${selectedCategory === cat.id ? 'bg-brand-blue text-white shadow-md' : 'text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className={selectedCategory === cat.id ? 'text-white/80' : 'text-slate-400'}>{products.filter(p => p.categoryId === cat.id).length}</span>
                  </div>
                  <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${selectedCategory === cat.id ? 'text-white' : 'text-slate-400'}`}>
                    <button onClick={(e) => { e.stopPropagation(); openCategoryForm(cat); }} className="p-1 hover:bg-black/10 rounded transition-colors"><Edit2 className="w-3.5 h-3.5"/></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id, cat.name); }} className="p-1 hover:bg-black/10 hover:text-red-500 rounded transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3 pb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
              {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-shadow bg-white" 
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border text-center border-slate-200 rounded-2xl overflow-hidden p-6 animate-pulse">
                  <div className="w-full aspect-[4/3] bg-slate-100 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-100 rounded mb-2 w-3/4 mx-auto"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2 mx-auto mt-4"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm text-center p-16">
              <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-base font-black uppercase tracking-widest text-slate-800 mb-2">No Products Found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
                {searchQuery ? `No products matching "${searchQuery}"` : "There are no products in this category yet. Click Add Product to get started."}
              </p>
              {!searchQuery && (
                <button onClick={() => { setViewMode('products'); openProductForm(); }} className="mt-6 font-black uppercase tracking-widest text-brand-blue text-xs border-2 border-brand-blue px-6 py-2 rounded-lg hover:bg-brand-blue hover:text-white transition-colors">
                  Create First Product
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:border-brand-blue/30 group flex flex-col">
                  <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg">
                      <button onClick={() => openProductForm(product)} className="p-1.5 text-slate-600 hover:text-brand-blue hover:bg-blue-50 rounded transition-colors"><Edit2 className="w-3.5 h-3.5"/></button>
                      <button onClick={() => deleteProduct(product.id, product.name)} className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="text-[9px] font-black uppercase tracking-widest text-brand-blue mb-2.5 leading-none">
                      {categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
                    </div>
                    <h3 className="font-black text-slate-900 text-lg tracking-tight mb-2 leading-tight">{product.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-auto mb-4 leading-relaxed font-medium">{product.description}</p>
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded">
                        {product.features?.length || 0} Features
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        /{product.slug}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}