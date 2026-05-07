'use client';

import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardTab from '@/components/admin/DashboardTab';
import InquiriesTab from '@/components/admin/InquiriesTab';
import SlideshowTab from '@/components/admin/SlideshowTab';
import ProductsTab from '@/components/admin/ProductsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import UsersTab from '@/components/admin/UsersTab';
import OrdersTab from '@/components/admin/OrdersTab';
import PagesTab from '@/components/admin/PagesTab';
import { Menu } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setLoginError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
        setLoginError('Login popup closed. Please try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        setLoginError(`Domain not authorized. Please go to your Firebase Console -> Authentication -> Settings -> Authorized Domains, and add this URL's domain (${window.location.hostname}) to the list.`);
      } else if (error.message?.includes('cross-origin')) {
        setLoginError('Authentication might be blocked inside an iframe. Please open the application in a new tab (using the button in the top right), and try again.');
      } else {
        setLoginError(error.message || 'Login failed. Try opening the app in a new tab.');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loadingUser) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans tracking-tight">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 text-center">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Admin Portal</h2>
          <p className="text-slate-500 mb-8 font-medium">Authentication required</p>
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 rounded-xl py-4 font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>
          
          <div className="mt-8 text-sm text-amber-800 bg-amber-50 p-4 rounded-xl text-left border border-amber-200 leading-relaxed font-medium">
            <strong>Note:</strong> If you are using the AI Studio preview window, the Google Login popup might be blocked by your browser depending on iframe settings. Click the <strong>&quot;Open in new tab&quot;</strong> icon at the top right of the preview window and try again.
          </div>

          {loginError && (
            <div className="mt-4 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl text-left font-medium">
              {loginError}
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'inquiries': return <InquiriesTab />;
      case 'orders': return <OrdersTab />;
      case 'slideshow': return <SlideshowTab />;
      case 'products': return <ProductsTab />;
      case 'settings': return <SettingsTab />;
      case 'users': return <UsersTab />;
      case 'pages': return <PagesTab />;
      default: return (
        <div className="bg-white p-16 text-center rounded-2xl border border-slate-200 shadow-sm animate-in fade-in flex flex-col items-center justify-center max-w-2xl mx-auto mt-10">
          <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-lg font-black tracking-widest uppercase text-slate-800 mb-2">Under Construction</h2>
          <p className="text-slate-500 font-medium text-sm max-w-md">The {activeTab} module is currently being built and will be available in the next system update.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden print:overflow-visible print:h-auto print:bg-white">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden print:overflow-visible print:h-auto">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 print:hidden">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-black uppercase tracking-widest text-slate-800">
              {activeTab.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-500 hidden sm:block">{user.email}</span>
            <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm">
              {user.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8 print:overflow-visible print:p-0 print:bg-white">
          <div className="max-w-7xl mx-auto pb-20 print:pb-0 print:max-w-none">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
