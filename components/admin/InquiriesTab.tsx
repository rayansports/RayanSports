'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType, exportToCSV } from '@/app/admin/utils';
import { Search, Filter, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function InquiriesTab() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInquiries(data);
      setLoadingData(false);
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'inquiries');
      } catch (err: any) {
        if (err.message.includes('Missing or insufficient permissions')) {
          setDataError('Permission Denied: Your account is not authorized as an Admin.');
        } else {
          setDataError(err.message);
        }
      }
      setLoadingData(false);
    });
    return () => unsubscribe();
  }, []);

  const markAsContacted = async (id: string, currentInquiry: any) => {
    if (!window.confirm('Mark this inquiry as contacted?')) return;
    try {
      const ref = doc(db, 'inquiries', id);
      await updateDoc(ref, { status: 'contacted' });
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

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesFilter = filter === 'all' || inquiry.status === filter || (!inquiry.status && filter === 'new');
    const matchesSearch = searchTerm === '' || 
      inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loadingData) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-sm animate-pulse">Loading inquiries...</div>;

  if (dataError) {
    return (
      <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl text-left shadow-sm">
        <strong className="font-bold uppercase tracking-widest text-[10px] block mb-1">Error Loading Data</strong>
        {dataError}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue placeholder:text-slate-400 transition-shadow"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
            <button 
              onClick={() => setFilter('all')}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('new')}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap ${filter === 'new' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              New
            </button>
            <button 
              onClick={() => setFilter('contacted')}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap ${filter === 'contacted' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Contacted
            </button>
          </div>
          <button
            onClick={() => {
              const exportData = filteredInquiries.map(i => ({
                ID: i.id,
                Name: i.name,
                Email: i.email,
                Phone: i.phone,
                ProductName: i.productName,
                Quantity: i.quantity,
                Requirements: i.requirements,
                Status: i.status,
                Date: i.createdAt?.toDate ? format(i.createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss') : ''
              }));
              exportToCSV(exportData, `inquiries-${Date.now()}.csv`);
            }}
            className="px-4 py-2 bg-slate-900 border border-slate-900 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 hover:bg-slate-800 transition-all font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
        {filteredInquiries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">No inquiries found</h3>
            <p className="mt-2 text-sm text-slate-500">
              {inquiries.length === 0 
                ? "Get started by sharing your website link or check if permissions are set."
                : "Try adjusting your search or filters to find what you're looking for."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Date & Status</th>
                  <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer Info</th>
                  <th scope="col" className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Product Specs</th>
                  <th scope="col" className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className={`transition-colors hover:bg-slate-50 ${inquiry.status === 'new' || !inquiry.status ? 'bg-blue-50/20' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <div className="text-sm font-bold text-slate-900">{inquiry.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</div>
                      <div className="mt-2">
                        <span className={`inline-flex rounded px-2 py-1 text-[10px] font-black uppercase tracking-widest leading-none ${
                          (inquiry.status === 'new' || !inquiry.status) ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {(inquiry.status || 'new')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-black text-slate-900 uppercase tracking-tight">{inquiry.name}</div>
                      <div className="text-sm text-slate-500 mt-1">{inquiry.email}</div>
                      <div className="text-sm font-medium text-slate-700 mt-0.5">{inquiry.phone}</div>
                      <div className="text-[10px] text-brand-blue mt-2 font-black uppercase tracking-widest">{inquiry.country}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm font-bold text-slate-900 mb-2">{inquiry.productName}</div>
                      <div className="text-xs text-slate-600"><span className="font-bold uppercase text-[10px] tracking-wider text-slate-400">Qty:</span> {inquiry.quantity} | <span className="font-bold uppercase text-[10px] tracking-wider text-slate-400">Sizes:</span> {inquiry.size}</div>
                      {inquiry.fabric && <div className="text-xs text-slate-600 mt-1"><span className="font-bold uppercase text-[10px] tracking-wider text-slate-400">Fabric:</span> {inquiry.fabric}</div>}
                      {inquiry.printingMethod && <div className="text-xs text-slate-600 mt-1"><span className="font-bold uppercase text-[10px] tracking-wider text-slate-400">Print:</span> {inquiry.printingMethod}</div>}
                      {inquiry.message && (
                        <div className="mt-3 text-xs italic text-slate-600 bg-slate-50 p-3 rounded-lg border-l-2 border-brand-blue max-w-sm">
                          &quot;{inquiry.message}&quot;
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                      <div className="flex flex-col gap-2 items-end">
                        {(inquiry.status === 'new' || !inquiry.status) && (
                          <button 
                            onClick={() => markAsContacted(inquiry.id, inquiry)}
                            className="text-brand-blue bg-blue-50 border border-brand-blue hover:bg-brand-blue hover:text-white px-3 py-1.5 rounded transition-colors text-[10px] font-black uppercase tracking-widest shadow-sm"
                          >
                            Mark Contacted
                          </button>
                        )}
                        <a 
                          href={`https://wa.me/${(inquiry.phone || '').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 font-black uppercase tracking-widest text-[10px] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded transition-colors shadow-sm"
                        >
                          WhatsApp Reply
                        </a>
                        <button 
                          onClick={() => deleteInquiry(inquiry.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors py-1.5 px-3 rounded font-black uppercase tracking-widest text-[10px] mt-2"
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
    </div>
  );
}