import { useState } from 'react';
import { LayoutDashboard, MessageSquare, Image as ImageIcon, Settings, Package, ShoppingCart, Users, LogOut, X, ChevronDown, Store, UserCircle, Briefcase } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, setIsOpen, handleLogout }: AdminSidebarProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    storefront: true,
    crm: true,
    system: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const navGroups = [
    {
      id: 'storefront',
      label: 'Storefront',
      icon: Store,
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'products', label: 'Products & Categories', icon: Package },
      ]
    },
    {
      id: 'crm',
      label: 'Customer Relations',
      icon: UserCircle,
      items: [
        { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
      ]
    },
    {
      id: 'system',
      label: 'Administration',
      icon: Briefcase,
      items: [
        { id: 'slideshow', label: 'Slideshow CMS', icon: ImageIcon },
        { id: 'pages', label: 'CMS Pages', icon: Store },
        { id: 'users', label: 'Users & Roles', icon: Users },
        { id: 'settings', label: 'Platform Settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-72 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0 shadow-2xl lg:shadow-none print:hidden`}>
        <div className="h-20 flex items-center justify-between px-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/20 to-transparent pointer-events-none"></div>
          <span className="text-xl font-black tracking-widest text-white uppercase relative z-10">RAYAN <span className="text-brand-blue font-bold">SPORT</span></span>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-white/50 hover:text-white transition-colors relative z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-4 px-4 overflow-y-auto scrollbar-hide">
          {navGroups.map(group => {
            const GroupIcon = group.icon;
            const isGroupOpen = openGroups[group.id];
            
            return (
              <div key={group.id} className="flex flex-col gap-1">
                <button 
                  onClick={() => toggleGroup(group.id)}
                  className="flex items-center justify-between px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500/70 hover:text-slate-400 transition-colors w-full text-left"
                >
                  <span className="flex items-center gap-2">
                    <GroupIcon className="w-3.5 h-3.5" />
                    {group.label}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isGroupOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 flex flex-col gap-1 ${isGroupOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                        className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all relative overflow-hidden group ${
                          isActive ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`}
                      >
                        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>}
                        <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="mb-4 px-4 hidden lg:block">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center flex-shrink-0 font-black text-white text-xs">
                A
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-slate-200">Admin User</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Superadmin</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-all group shadow-sm bg-slate-900"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
