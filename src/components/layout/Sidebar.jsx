import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, BarChart3, Settings, Wallet, X } from 'lucide-react';
import { cn } from '../../utils/classMerge';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ReceiptText },
  { name: 'Insights', path: '/insights', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[var(--surface-color)] border-r border-[var(--border-color)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5 text-emerald-500">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-[var(--text-primary)]">FinDash</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--bg-color)] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] whitespace-nowrap">Main Menu</span>
            <div className="h-px w-full bg-gradient-to-r from-[var(--border-color)] to-transparent" />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 hover:translate-x-1',
                  isActive
                    ? 'sidebar-link-active shadow-sm'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-color)] hover:text-[var(--text-primary)]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    "w-5 h-5 transition-transform duration-300 ease-out group-hover:scale-110",
                    isActive ? "text-emerald-500" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                  )} />
                  <span className="font-semibold">{item.name}</span>
                  
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-[var(--bg-color)] border border-[var(--border-color)] group cursor-pointer hover:border-emerald-500/30 transition-all">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 text-emerald-500 flex items-center justify-center font-bold border border-emerald-500/10">
                P
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[var(--bg-color)] p-0.5">
                <div className="w-full h-full rounded-full bg-emerald-500 border border-[var(--surface-color)] shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-[var(--text-primary)] truncate">Piyush</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                Online <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
