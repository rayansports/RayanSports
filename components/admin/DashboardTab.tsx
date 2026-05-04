'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Activity, MessageSquare, PlusCircle } from 'lucide-react';

export default function DashboardTab() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInquiries(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const contactedInquiries = inquiries.filter(i => i.status === 'contacted').length;

  // Process data for the chart - group by date (last 7 days/items)
  const processChartData = () => {
    const days: Record<string, number> = {};
    inquiries.forEach(inquiry => {
      if (inquiry.createdAt?.toDate) {
        const date = inquiry.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        days[date] = (days[date] || 0) + 1;
      }
    });
    
    return Object.keys(days).map(date => ({
      date,
      Inquiries: days[date]
    })).slice(-10); // Show up to last 10 dates with activity
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-brand-blue/30 transition-colors">
          <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-blue-50 transition-colors">
            <MessageSquare className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              Total Inquiries
            </h3>
            <div className="text-5xl font-black text-slate-800">{inquiries.length}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-brand-blue/30 transition-colors">
          <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-blue-50 transition-colors">
            <PlusCircle className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
              New / Pending
            </h3>
            <div className="text-5xl font-black text-brand-blue">{newInquiries}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-brand-blue/30 transition-colors">
          <div className="absolute -right-6 -top-6 text-slate-50 group-hover:text-blue-50 transition-colors">
            <Activity className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Contacted
            </h3>
            <div className="text-5xl font-black text-emerald-600">{contactedInquiries}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 xl:col-span-2">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-4 mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-blue" />
            Inquiry Volume
          </h2>
          
          {chartData.length > 0 ? (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="Inquiries" stroke="#1E3A8A" strokeWidth={3} fillOpacity={1} fill="url(#colorInquiries)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 w-full flex flex-col items-center justify-center text-slate-400">
              <Activity className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm font-medium">Not enough data to display chart</p>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
            <span>Recent Activity</span>
            <span className="text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded font-bold">LIVE</span>
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {inquiries.slice(-5).reverse().map((inquiry, i) => (
              <div key={inquiry.id || i} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-black text-brand-blue">{(inquiry.name || 'U')[0].toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 line-clamp-1">{inquiry.name} <span className="font-normal text-slate-500">submitted an inquiry</span></p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{inquiry.productName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">
                    {inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                  </p>
                </div>
              </div>
            ))}
            {inquiries.length === 0 && (
              <div className="text-center py-10 text-sm text-slate-500">
                No recent activity recorded.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}