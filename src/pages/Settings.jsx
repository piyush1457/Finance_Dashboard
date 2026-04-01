import { useAppStore } from '../store/appStore';
import { useTransactionStore } from '../store/transactionStore';
import { toast } from '../store/toastStore';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Moon, Sun, ShieldAlert, MonitorCheck, RotateCcw } from 'lucide-react';

export function Settings() {
  const { role, setRole, theme, toggleTheme } = useAppStore();
  const { resetTransactions } = useTransactionStore();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all transactions to default mock data?')) {
      resetTransactions();
      toast.success('Transactions reset successfully');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <MonitorCheck className="w-6 h-6 text-emerald-500" /> Application Preferences
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">Theme</h3>
              <p className="text-sm text-[var(--text-muted)]">Toggle between dark and light modes</p>
            </div>
            <Button variant="secondary" onClick={toggleTheme} className="w-32">
              {theme === 'dark' ? (
                <><Moon className="w-4 h-4 mr-2" /> Dark Mode</>
              ) : (
                <><Sun className="w-4 h-4 mr-2" /> Light Mode</>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">Currency</h3>
              <p className="text-sm text-[var(--text-muted)]">Base currency for display (UI Only)</p>
            </div>
            <Select disabled className="w-32">
              <option value="inr">₹ INR</option>
              <option value="usd">$ USD</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-emerald-500" /> Role Management
        </h2>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">Current Access Role</h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                <strong>Viewer</strong> can only view data and insights. <br />
                <strong>Admin</strong> can add, edit, delete transactions and see all controls.
              </p>
            </div>
            <Select 
              value={role} 
              onChange={(e) => {
                setRole(e.target.value);
                toast.success(`Role switched to ${e.target.value.toUpperCase()}`);
              }}
              className="w-full sm:w-40"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-rose-500/30">
        <h2 className="text-xl font-semibold text-rose-500 mb-6 flex items-center gap-2">
          <RotateCcw className="w-6 h-6" /> Data Management
        </h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-[var(--text-primary)]">Reset Mock Data</h3>
            <p className="text-sm text-[var(--text-muted)]">This will clear all your changes and restore the initial 6 months dataset.</p>
          </div>
          <Button variant="danger" onClick={handleReset} className="w-full sm:w-32">
            Reset Data
          </Button>
        </div>
      </Card>

    </div>
  );
}
