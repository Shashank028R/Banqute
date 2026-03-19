
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  ClipboardList,
  IndianRupee, 
  Settings2, 
  ChevronRight,
  Menu,
  X,
  User,
  LogOut,
  HelpCircle,
  Bell,
  Sparkles,
  Package,
  Type,
  Plus,
  Minus,
  Moon,
  Sun,
  Building,
  Palette,
  CalendarCheck,
  ChevronDown,
  BarChart3,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Users,
  UserCheck,
  Tags,
  FileText,
  PieChart,
  Building2,
  Wallet
} from 'lucide-react';
import { getInitials } from '../lib/utils';
import { useOrganization } from '../contexts/OrganizationContext';
import { useFontSize } from '../contexts/FontSizeContext';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSeason: string;
  setSelectedSeason: (season: string) => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: ClipboardList },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { 
    id: 'accounts', 
    label: 'Accounts', 
    icon: IndianRupee,
    subItems: [
      { id: 'accounts-dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'accounts-income', label: 'Income', icon: TrendingUp },
      { id: 'accounts-expenses', label: 'Expenses', icon: TrendingDown },
      { id: 'accounts-cash', label: 'Cash Book', icon: BookOpen },
      { id: 'accounts-bank', label: 'Bank Book', icon: Building2 },
      { id: 'accounts-day', label: 'Day Book', icon: FileText },
      { id: 'accounts-customer', label: 'Customer Ledger', icon: Users },
      { id: 'accounts-vendor', label: 'Vendor Ledger', icon: UserCheck },
      { id: 'accounts-category', label: 'Category Ledger', icon: Tags },
      { id: 'accounts-invoices', label: 'Invoices & Receipts', icon: FileText },
      { id: 'accounts-reports', label: 'Reports', icon: PieChart },
      { id: 'accounts-owner', label: 'Owner/Company', icon: Building },
      { id: 'accounts-advance', label: 'Advance/Deposits', icon: Wallet },
    ]
  },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings2,
    subItems: [
      { id: 'settings-general', label: 'General', icon: Building },
      { id: 'settings-branding', label: 'Branding', icon: Palette },
      { id: 'settings-bookings', label: 'Bookings', icon: CalendarCheck },
      { id: 'settings-notifications', label: 'Notifications', icon: Bell },
    ]
  },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, selectedSeason, setSelectedSeason }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    return document.documentElement.classList.contains('dark');
  });
  const { organization: org, logout } = useOrganization();
  const { fontSize, increaseFontSize, decreaseFontSize } = useFontSize();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const initials = getInitials(org.name);

  const themeStyle = {
    '--primary-brand': org.primary_color,
    '--primary-brand-light': `${org.primary_color}15`,
    '--secondary-brand': org.secondary_color,
  } as React.CSSProperties;

  return (
    <div className="h-screen w-full flex bg-gray-50 overflow-hidden font-sans" style={themeStyle}>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transition-all duration-300 ease-in-out transform ${
          isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } ${isHovered ? 'w-64 shadow-2xl' : 'lg:w-20'}`}
      >
        <div className="h-full flex flex-col">
          {/* Platform Branding */}
          <div className="p-4 h-16 border-b border-gray-50 flex items-center overflow-hidden">
            <div className="flex items-center gap-3 min-w-[200px]">
              <div 
                className="w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: 'var(--primary-brand)', boxShadow: `0 8px 12px -3px var(--primary-brand)` }}
              >
                UP
              </div>
              <div className={`flex flex-col transition-opacity duration-300 ${isHovered || isMobileOpen ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className="font-bold text-lg text-gray-800 leading-none whitespace-nowrap">UtsavPro</h1>
                <span className="text-[10px] text-gray-400 font-medium tracking-widest mt-1 uppercase whitespace-nowrap">Banquet SaaS</span>
              </div>
            </div>
            <button className="lg:hidden ml-auto text-gray-500" onClick={() => setIsMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id || (item.subItems && activeTab.startsWith(item.id));
              const hasSubItems = !!item.subItems;
              const isExpanded = hasSubItems && (isActive || isHovered || isMobileOpen);

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => {
                      if (hasSubItems) {
                        setActiveTab(item.subItems![0].id);
                      } else {
                        setActiveTab(item.id);
                      }
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center group relative px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'shadow-sm border border-gray-100' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    style={isActive ? { backgroundColor: 'var(--primary-brand-light)', color: 'var(--primary-brand)' } : {}}
                  >
                    <div className="flex items-center min-w-[200px]">
                      <item.icon 
                        size={22} 
                        className={`transition-colors duration-200 ${!isActive ? 'text-gray-400 group-hover:text-gray-600' : ''}`}
                        style={isActive ? { color: 'var(--primary-brand)' } : {}}
                      />
                      <span className={`ml-4 transition-all duration-300 whitespace-nowrap ${isHovered || isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none translate-x-4'}`}>
                        {item.label}
                      </span>
                    </div>
                    {(isHovered || isMobileOpen) && (
                      hasSubItems ? (
                        <ChevronDown size={14} className={`ml-auto transition-transform ${isActive ? 'rotate-180' : ''}`} />
                      ) : isActive && (
                        <ChevronRight size={14} className="ml-auto" />
                      )
                    )}
                    {/* Tooltip for collapsed state */}
                    {!isHovered && !isMobileOpen && (
                      <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
                        {item.label}
                      </div>
                    )}
                  </button>

                  {/* Sub Items */}
                  {hasSubItems && (isHovered || isMobileOpen) && isActive && (
                    <div className="ml-9 space-y-1 mt-1">
                      {item.subItems!.map((subItem) => {
                        const isSubActive = activeTab === subItem.id;
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              setActiveTab(subItem.id);
                              setIsMobileOpen(false);
                            }}
                            className={`w-full flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                              isSubActive 
                                ? 'text-gray-900 bg-gray-50' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
                            }`}
                            style={isSubActive ? { color: 'var(--primary-brand)' } : {}}
                          >
                            <subItem.icon size={14} className="mr-3" />
                            {subItem.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User/Org Section */}
          <div className="p-3 border-t border-gray-50 mt-auto overflow-hidden">
            <div className={`flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 ${isHovered || isMobileOpen ? 'bg-gray-50 border border-gray-100' : ''}`}>
              <div className="w-10 h-10 min-w-[40px] rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-gray-200 shrink-0">
                 <img src={org.logo_url} alt={org.name} className="w-full h-full object-cover" />
              </div>
              <div className={`flex-1 min-w-0 transition-all duration-300 ${isHovered || isMobileOpen ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-sm font-bold text-gray-800 truncate">{org.name.split(' ')[0]}</p>
                <p className="text-[10px] text-gray-500 font-bold truncate uppercase tracking-tighter">Admin</p>
              </div>
              {(isHovered || isMobileOpen) && (
                <button 
                  onClick={logout}
                  className="text-gray-400 hover:text-red-600 transition-colors shrink-0"
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${isHovered ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500" onClick={() => setIsMobileOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center text-sm font-medium text-gray-400 gap-2">
              <span className="hover:text-gray-600 cursor-default">UtsavPro</span>
              <ChevronRight size={14} className="opacity-50" />
              <span className="text-gray-900 font-bold">
                {activeTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
              </span>
            </div>
            
            {/* Global Season Filter */}
            <div className="hidden sm:flex items-center ml-4 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 shadow-sm group">
              <Sparkles size={16} className="text-yellow-500 mr-2 group-hover:animate-spin" />
              <span className="text-xs font-bold text-gray-500 mr-2">SEASON:</span>
              <select 
                value={selectedSeason} 
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-transparent border-none text-xs font-black text-gray-800 focus:ring-0 cursor-pointer"
              >
                <option value="All">All Time</option>
                <option value="2023-24">2023-24</option>
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Font Size Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-50/80 border border-gray-100 px-2 py-1 rounded-xl">
              <button 
                onClick={decreaseFontSize}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-white border border-transparent hover:border-gray-200"
                title="Decrease Font Size"
              >
                <Minus size={14} />
              </button>
              <div className="flex items-center gap-1 px-1 min-w-[32px] justify-center">
                <Type size={14} className="text-gray-400" />
                <span className="text-[10px] font-black text-gray-600">{fontSize}</span>
              </div>
              <button 
                onClick={increaseFontSize}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-white border border-transparent hover:border-gray-200"
                title="Increase Font Size"
              >
                <Plus size={14} />
              </button>
            </div>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors rounded-full hover:bg-gray-50"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors rounded-full hover:bg-gray-50">
              <Bell size={20} />
              <span 
                className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full border-2 border-white animate-pulse"
                style={{ backgroundColor: 'var(--primary-brand)' }}
              ></span>
            </button>
          </div>
        </header>

        {/* Dynamic Main Body */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50/50">
          <div className="max-w-full mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
