import { LayoutDashboard, MessageSquare, Image as ImageIcon, Settings, Package, ShoppingCart, Users, LogOut, Menu, X } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, setIsOpen, handleLogout }: AdminSidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inquiries', label: 'Inquiries & CRM', icon: MessageSquare },
    { id: 'orders', label: 'Order Management', icon: ShoppingCart },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'slideshow', label: 'Slideshow CMS', icon: ImageIcon },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-64 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <span className="text-xl font-black tracking-tight text-white">RAYAN SPORTS</span>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
          <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">Navigation</div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isActive ? 'bg-brand-blue text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
