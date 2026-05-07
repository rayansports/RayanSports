'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/app/admin/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
  LineChart, Line
} from 'recharts';
import { Activity, MessageSquare, PlusCircle, Package, Layers, ShoppingCart, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

export default function DashboardTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qInq = query(collection(db, 'inquiries'), orderBy('createdAt', 'asc'));
    const unSubInq = onSnapshot(qInq, (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      try { handleFirestoreError(error, OperationType.LIST, 'inquiries'); } catch(e) {}
    });

    const qProducts = query(collection(db, 'products'));
    const unSubProd = onSnapshot(qProducts, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      try { handleFirestoreError(error, OperationType.LIST, 'products'); } catch(e) {}
    });

    const qCategories = query(collection(db, 'categories'));
    const unSubCat = onSnapshot(qCategories, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      try { handleFirestoreError(error, OperationType.LIST, 'categories'); } catch(e) {}
    });

    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'asc'));
    const unSubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      try { handleFirestoreError(error, OperationType.LIST, 'orders'); } catch(e) {}
      setLoading(false);
    });

    return () => {
      unSubInq();
      unSubProd();
      unSubCat();
      unSubOrders();
    };
  }, []);

  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  // Generate last 7 days array
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    return subDays(new Date(), 6 - i);
  });

  // Process data for the chart - last 7 days
  const processChartData = () => {
    return last7Days.map(date => {
      const dayStr = format(date, 'MMM d');
      
      const dayInquiries = inquiries.filter(inq => {
        if (!inq.createdAt?.toDate) return false;
        return isSameDay(inq.createdAt.toDate(), date);
      }).length;

      const dayOrders = orders.filter(ord => {
        if (!ord.createdAt?.toDate) return false;
        return isSameDay(ord.createdAt.toDate(), date);
      });

      const dayRevenue = dayOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

      return {
        date: dayStr,
        Inquiries: dayInquiries,
        Orders: dayOrders.length,
        Revenue: dayRevenue
      };
    });
  };

  const chartData = processChartData();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div 
          onClick={() => setActiveTab('orders')}
          className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-brand-blue/30 transition-colors">
          <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-blue-50 transition-colors">
            <DollarSign className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Total Revenue
            </h3>
            <div className="text-4xl font-black text-slate-800">${totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('orders')}
          className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-brand-blue/30 transition-colors">
          <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-blue-50 transition-colors">
            <ShoppingCart className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex justify-between items-end">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                Total Orders
              </h3>
              <div className="text-4xl font-black text-brand-blue">{orders.length}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase">Pending</div>
              <div className="text-xl font-black text-amber-500">{pendingOrders}</div>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('inquiries')}
          className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-brand-blue/30 transition-colors">
          <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-amber-50 transition-colors">
            <MessageSquare className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex justify-between items-end">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Inquiries
              </h3>
              <div className="text-4xl font-black text-amber-600">{inquiries.length}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase">New</div>
              <div className="text-xl font-black text-amber-500">{newInquiries}</div>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('products')}
          className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-brand-blue/30 transition-colors">
          <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-blue-50 transition-colors">
            <Package className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex justify-between items-end">
            <div>
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                Products
              </h3>
              <div className="text-4xl font-black text-indigo-600">{products.length}</div>
            </div>
            <div className="text-right">
               <div className="text-xs font-bold text-slate-500 uppercase">Cats</div>
               <div className="text-xl font-black text-indigo-400">{categories.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Revenue (Last 7 Days)
            </div>
          </h2>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
             <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-blue" />
              Orders & Inquiries
            </div>
          </h2>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#F1F5F9' }}
                />
                <Bar dataKey="Orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Inquiries" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
            <span>Recent Orders</span>
            <span className="text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded font-bold">LIVE</span>
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {orders.slice(-5).reverse().map((order, i) => (
              <div key={order.id || i} className="flex gap-4 items-start pb-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-default">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <ShoppingCart className="w-4 h-4 text-brand-blue" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{order.customerName}</p>
                    <span className="font-black text-brand-blue text-sm">${(order.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'MMM d, h:mm a') : 'Recent'}
                    </span>
                    <span className={`px-2 py-0.5 rounded ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {order.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-500">
                No recent orders.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
            <span>Recent Inquiries</span>
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {inquiries.slice(-5).reverse().map((inquiry, i) => (
              <div key={inquiry.id || i} className="flex gap-4 items-start pb-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-default">
                <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <span className="text-xs font-black text-amber-600">{(inquiry.name || 'U')[0].toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800 line-clamp-1">{inquiry.name}</p>
                  <p className="text-xs font-medium text-amber-600 mt-0.5 truncate">{inquiry.productName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {inquiry.createdAt?.toDate ? format(inquiry.createdAt.toDate(), 'MMM d, h:mm a') : 'Recent'}
                  </p>
                </div>
              </div>
            ))}
            {inquiries.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-500">
                No recent inquiries.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}