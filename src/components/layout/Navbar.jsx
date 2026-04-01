import { Menu, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export function Navbar({ onMenuClick }) {
  const { role, theme, toggleTheme } = useAppStore();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/transactions': return 'Transactions';
      case '/insights': return 'Insights';
      case '/settings': return 'Settings';
      default: return 'Overview';
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-color)] bg-[var(--surface-color)] z-30 sticky top-0 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg lg:hidden hover:bg-[var(--bg-color)] text-[var(--text-primary)]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
           <span className="text-sm text-[var(--text-muted)]">Role:</span>
           <Badge variant={role === 'admin' ? 'success' : 'info'}>
             {role.toUpperCase()}
           </Badge>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-full h-10 w-10 border border-[var(--border-color)] text-emerald-500 hover:text-emerald-600 dark:text-emerald-400"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
}
