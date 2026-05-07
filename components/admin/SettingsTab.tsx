'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/app/admin/utils';
import { Check, Settings, Mail, ShieldCheck, Image as ImageIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import MediaUploader from './MediaUploader';

export default function SettingsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: 'RAYAN SPORTS',
    contactWhatsapp: '923000000000',
    contactEmail: 'rayansportsofficial@gmail.com',
    footerAddress: 'Sialkot, Pakistan',
    logoUrl: '',
    maintenanceMode: false,
    seoTitle: 'Rayan Sports',
    seoDescription: 'High quality sports wear',
    seoKeywords: 'sports, wear, custom'
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, 'settings', 'primary');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    
    try {
      await setDoc(doc(db, 'settings', 'primary'), formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/primary');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:border-brand-blue/30 transition-colors">
        <div className="bg-slate-50 px-6 lg:px-8 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-blue" />
            General Configuration
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
            Core Data
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Company Logo</label>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {formData.logoUrl && (
                  <div className="w-32 h-32 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-4 flex-shrink-0">
                    <img src={formData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 w-full">
                  <MediaUploader accept="image/*" label="Upload Primary Logo" onUploadSuccess={(url) => setFormData({...formData, logoUrl: url})} />
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Recommended size: 512x512px. Formats: PNG, SVG, JPG.</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Company Name</label>
              <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-shadow hover:border-slate-400" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Contact WhatsApp (Include Country Code)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+</span>
                <input required type="text" name="contactWhatsapp" value={formData.contactWhatsapp} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 pl-7 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-shadow hover:border-slate-400" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Contact Email</label>
              <input required type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-shadow hover:border-slate-400" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Footer Address</label>
              <textarea required name="footerAddress" value={formData.footerAddress} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-shadow hover:border-slate-400" rows={3}></textarea>
            </div>
            
            {/* Maintenance Mode Toggle */}
            <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Maintenance Mode</h3>
                <p className="text-xs text-slate-500 mt-1">When enabled, the storefront will display a maintenance page to visitors.</p>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
                className={`flex items-center justify-center p-1 rounded-full transition-colors w-12 h-6 ${formData.maintenanceMode ? 'bg-brand-blue' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.maintenanceMode ? 'translate-x-3' : '-translate-x-3'}`}></div>
              </button>
            </div>

            <div className="md:col-span-2 mt-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">SEO Title</label>
                  <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-shadow hover:border-slate-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">SEO Description</label>
                  <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-shadow hover:border-slate-400" rows={2}></textarea>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">SEO Keywords (Comma Separated)</label>
                  <input type="text" name="seoKeywords" value={formData.seoKeywords} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-blue outline-none transition-shadow hover:border-slate-400" placeholder="e.g. sports, shirts, custom uniforms" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              {success && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
                  <Check className="w-3.5 h-3.5" /> Settings saved successfully
                </span>
              )}
            </div>
            <button 
              type="submit" 
              disabled={saving}
              className={`text-white px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm transition flex items-center gap-2 ${saving ? 'bg-slate-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-blue-700 hover:shadow-md active:scale-95'}`}
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Save Primary Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:border-slate-300 transition-colors">
        <div className="bg-slate-50 px-6 lg:px-8 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-slate-400" />
            SMTP / Email Integration
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shadow-sm flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> External Setup Required
          </span>
        </div>
        
        <div className="p-6 lg:p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800 font-medium mb-8 flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-full mt-0.5">
              <Mail className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-amber-900 mb-1">Email Dispatch Disabled</p>
              <p className="opacity-90">To enable automated order confirmations and inquiry replies, you need to configure an external Mail Server (like Resend, Sendgrid, or SMTP) directly in the edge functions.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50 relative pointer-events-none">
            <div className="absolute inset-0 bg-white/40 z-10 backdrop-blur-[1px]"></div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">SMTP Host</label>
              <input type="text" value="smtp.example.com" disabled className="w-full border border-slate-300 rounded-lg p-3 text-sm bg-slate-50" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">SMTP Port</label>
              <input type="text" value="587" disabled className="w-full border border-slate-300 rounded-lg p-3 text-sm bg-slate-50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Secure Passkey</label>
              <input type="password" value="****************" disabled className="w-full border border-slate-300 rounded-lg p-3 text-sm bg-slate-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}