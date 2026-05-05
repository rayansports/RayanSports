'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType, exportToCSV } from '@/app/admin/utils';
import { ShoppingCart, Package, Eye, Trash2, Search, X, Check, Clock, Truck, FileText, ChevronDown, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, error => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { 
        status: newStatus,
        updatedAt: new Date()
      });
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this order? This cannot be undone.")) return;
    try {
      if (selectedOrder && selectedOrder.id === id) setSelectedOrder(null);
      await deleteDoc(doc(db, 'orders', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `orders/${id}`);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        order.orderNumber?.toLowerCase().includes(q) ||
        order.customerName?.toLowerCase().includes(q) ||
        order.customerEmail?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'processing': return <Package className="w-3 h-3" />;
      case 'shipped': return <Truck className="w-3 h-3" />;
      case 'delivered': return <Check className="w-3 h-3" />;
      case 'cancelled': return <X className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 leading-none">Order Management</h2>
          <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">Track & fulfill customer orders</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              const exportData = filteredOrders.map(o => ({
                OrderID: o.id,
                Customer: o.customerName,
                Email: o.customerEmail,
                Phone: o.customerPhone,
                Status: o.status,
                Total: o.totalAmount,
                Date: o.createdAt?.toDate ? format(o.createdAt.toDate(), 'yyyy-MM-dd HH:mm:ss') : ''
              }));
              exportToCSV(exportData, `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`);
            }}
            className="px-4 py-2 bg-slate-900 border border-slate-900 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 hover:bg-slate-800 transition-all font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:bg-white transition-all"
            />
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full sm:w-auto min-w-[140px] px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:bg-white transition-all font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center justify-between"
            >
              {statusFilter === 'all' ? 'All Orders' : statusFilter}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-2" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2">
                {[
                  { value: 'all', label: 'All Orders' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'shipped', label: 'Shipped' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'cancelled', label: 'Cancelled' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setStatusFilter(opt.value); setDropdownOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest ${statusFilter === opt.value ? 'bg-blue-50 text-brand-blue' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-black text-slate-900">{orders.length}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-brand-blue/30 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-black text-brand-blue">{orders.filter(o => o.status === 'pending').length}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-brand-blue/70 mt-1">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-black text-emerald-600">{orders.filter(o => o.status === 'delivered').length}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80 mt-1">Delivered</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-black text-emerald-700">${orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0).toFixed(2)}</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600/80 mt-1">Total Revenue</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className={`xl:col-span-${selectedOrder ? '2' : '3'} space-y-4`}>
          {loading ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Loading Orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white p-16 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-2">No Orders Found</h3>
              <p className="text-slate-500 text-xs">There are no orders matching your current filters.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Order ID</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Customer</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Date</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Total</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map(order => (
                      <tr 
                        key={order.id} 
                        className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-blue-50/50' : ''}`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="p-4">
                          <span className="font-bold text-slate-900 text-sm">{order.orderNumber || order.id.substring(0, 8).toUpperCase()}</span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
                          <div className="text-xs text-slate-500">{order.customerEmail}</div>
                        </td>
                        <td className="p-4 text-xs text-slate-600 font-medium whitespace-nowrap">
                          {order.createdAt?.toDate?.().toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-bold text-slate-900">${(order.totalAmount || 0).toFixed(2)}</span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                              className="p-1.5 text-brand-blue hover:bg-blue-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}
                              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Panel */}
        {selectedOrder && (
          <div className="xl:col-span-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-8rem)] sticky top-6 animate-in slide-in-from-right-4">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-blue" />
                Order Details
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-sm"
                >
                  Print
                </button>
                <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Order Number</p>
                  <p className="font-bold text-lg text-slate-900">{selectedOrder.orderNumber || selectedOrder.id.substring(0, 8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Order Date</p>
                  <p className="text-sm font-medium text-slate-700">{selectedOrder.createdAt?.toDate?.().toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder.id, s)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold capitalize transition-all border ${
                        selectedOrder.status === s 
                          ? 'border-brand-blue bg-brand-blue text-white shadow-sm' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-200 pb-2">Customer Information</p>
                <div className="space-y-3">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Name</span>
                    <span className="text-sm font-medium text-slate-900">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Email</span>
                    <a href={`mailto:${selectedOrder.customerEmail}`} className="text-sm font-medium text-brand-blue hover:underline">{selectedOrder.customerEmail}</a>
                  </div>
                  {selectedOrder.shippingAddress && (
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Shipping Address</span>
                      <p className="text-sm font-medium text-slate-700 mt-1 whitespace-pre-wrap">{selectedOrder.shippingAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 border-b border-slate-100 pb-2">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">{item.quantity || 1}</span>
                          <span className="font-medium text-slate-800">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">No items found.</p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 p-4 rounded-xl border-dashed">
                  <span className="font-black uppercase tracking-widest text-slate-700 text-xs">Total Amount</span>
                  <span className="font-black text-xl text-brand-blue">${(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
