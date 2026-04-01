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
          <div className="flex items-center gap-2 text-emerald-500">
            <Wallet className="w-8 h-8" />
            <span className="text-xl font-bold text-[var(--text-primary)]">FinDash</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-color)] hover:text-[var(--text-primary)]'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--bg-color)]">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
              U
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--text-primary)]">User Profile</span>
              <span className="text-xs text-[var(--text-muted)]">Premium Member</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
