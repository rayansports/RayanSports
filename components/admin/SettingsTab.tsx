'use client';

export default function SettingsTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 lg:p-8">
        <h2 className="text-base font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-4 mb-6">General Configuration</h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Company Name</label>
              <input type="text" defaultValue="RAYAN SPORTS" className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Contact WhatsApp</label>
              <input type="text" defaultValue="923000000000" className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Contact Email</label>
              <input type="email" defaultValue="rayansportsofficial@gmail.com" className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Footer Address</label>
              <textarea defaultValue="Sialkot, Pakistan" className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none" rows={3}></textarea>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button type="button" className="bg-brand-blue text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-sm">
              Save Primary Settings
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 lg:p-8">
        <h2 className="text-base font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-4 mb-6">SMTP / Email Integration</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 font-medium mb-6">
          Email dispatch is currently disabled. Configure SMTP settings to enable automated order confirmations and inquiry replies.
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 pointer-events-none">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">SMTP Host</label>
            <input type="text" placeholder="smtp.gmail.com" className="w-full border border-slate-300 rounded-lg p-3 text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">SMTP Port</label>
            <input type="text" placeholder="587" className="w-full border border-slate-300 rounded-lg p-3 text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}