'use client';

export default function ProductsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-black uppercase tracking-widest text-slate-900 border-b-2 border-brand-blue pb-1 inline-block">Product Management</h2>
        <button className="bg-brand-blue text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition">
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-min">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">Categories</h3>
          <ul className="space-y-2 text-sm text-slate-600 font-medium">
            <li className="p-2 bg-slate-50 rounded-md border border-slate-100 flex justify-between cursor-pointer hover:border-brand-blue/30 transition">
              <span>All Products</span>
              <span className="text-brand-blue font-bold">120</span>
            </li>
            <li className="p-2 hover:bg-slate-50 rounded-md border border-transparent cursor-pointer transition">
              American Football
            </li>
            <li className="p-2 hover:bg-slate-50 rounded-md border border-transparent cursor-pointer transition">
              Basketball
            </li>
            <li className="p-2 border-t border-slate-100 mt-2 text-brand-blue font-bold cursor-pointer hover:underline text-xs flex justify-between items-center">
              <span>Manage Categories</span>
              <span>&rarr;</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm text-center p-12">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-base font-bold text-slate-800 mb-2">No Products Synchronized</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            The product database is currently being served from a static catalog. 
            To manage products here, please run the Firebase synchronization script.
          </p>
        </div>
      </div>
    </div>
  );
}