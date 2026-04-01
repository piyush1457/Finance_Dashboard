import { useState, useMemo } from 'react';
import { Plus, Search, Filter, ArrowUpDown, Download, Edit2, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useTransactionStore } from '../store/transactionStore';
import { useFilterStore } from '../store/filterStore';
import { useAppStore } from '../store/appStore';
import { CATEGORIES, PAYMENT_METHODS } from '../data/mockTransactions';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from '../store/toastStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

function TransactionForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    title: '', amount: '', category: Object.values(CATEGORIES)[0], type: 'expense', paymentMethod: Object.values(PAYMENT_METHODS)[0], date: format(new Date(), 'yyyy-MM-dd')
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) {
      setError('Please fill all required fields');
      return;
    }
    if (Number(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      id: initialData?.id || Date.now().toString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-rose-500 bg-rose-500/10 p-3 rounded-lg">{error}</div>}
      <Input label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Swiggy Order" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Amount" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" />
        <Input label="Date" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Type" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </Select>
        <Select label="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
          {Object.values(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>
      <Select label="Payment Method" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
        {Object.values(PAYMENT_METHODS).map(c => <option key={c} value={c}>{c}</option>)}
      </Select>
      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Transaction</Button>
      </div>
    </form>
  );
}

export function Transactions() {
  const { transactions, addTransaction, editTransaction, deleteTransaction } = useTransactionStore();
  const filters = useFilterStore();
  const { role } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredAndSorted = useMemo(() => {
    let result = transactions.filter(tx => {
      const matchSearch = tx.title.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchType = filters.selectedType === 'All' || tx.type === filters.selectedType;
      const matchCategory = filters.selectedCategory === 'All' || tx.category === filters.selectedCategory;
      // Note: Add Date range filtering logic if dateRange is set
      return matchSearch && matchType && matchCategory;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'date') comparison = new Date(b.date) - new Date(a.date);
      else if (filters.sortBy === 'amount') comparison = b.amount - a.amount;
      else if (filters.sortBy === 'category') comparison = a.category.localeCompare(b.category);
      
      return filters.sortOrder === 'asc' ? -comparison : comparison;
    });

    return result;
  }, [transactions, filters]);

  const handleExport = () => {
    const headers = ['Date', 'Title', 'Category', 'Payment Method', 'Type', 'Amount'];
    const csvData = filteredAndSorted.map(tx => [
      tx.date, `"${tx.title}"`, `"${tx.category}"`, `"${tx.paymentMethod}"`, tx.type, tx.amount
    ].join(','));
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions_export.csv';
    link.click();
    toast.info('Export started successfully');
  };

  const onSaveTransaction = (data) => {
    if (editingTx) {
      editTransaction(data.id, data);
      toast.success('Transaction updated');
    } else {
      addTransaction(data);
      toast.success('Transaction added');
    }
    setIsModalOpen(false);
    setEditingTx(null);
  };

  const confirmDelete = () => {
    deleteTransaction(deleteConfirm);
    toast.success('Transaction deleted');
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <Input 
              placeholder="Search transactions..." 
              value={filters.searchQuery}
              onChange={e => filters.setFilter('searchQuery', e.target.value)}
              className="pl-9 w-full rounded-full"
            />
          </div>
          <Select 
            value={filters.selectedType} 
            onChange={e => filters.setFilter('selectedType', e.target.value)}
            className="w-full sm:w-32 rounded-full"
          >
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          <Select 
            value={filters.selectedCategory} 
            onChange={e => filters.setFilter('selectedCategory', e.target.value)}
            className="w-full sm:w-40 rounded-full"
          >
            <option value="All">All Categories</option>
            {Object.values(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleExport} className="whitespace-nowrap rounded-full shrink-0">
             <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          {role === 'admin' && (
            <Button onClick={() => { setEditingTx(null); setIsModalOpen(true); }} className="whitespace-nowrap rounded-full shrink-0">
              <Plus className="w-4 h-4 mr-2" /> Add Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Table Area */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm text-[var(--text-primary)]">
            <thead className="bg-[var(--bg-color)] border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium"><div className="flex items-center gap-2 cursor-pointer hover:text-[var(--text-primary)]" onClick={() => { filters.setFilter('sortBy', 'date'); filters.setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc'); }}>Date <ArrowUpDown className="w-4 h-4" /></div></th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium"><div className="flex items-center gap-2 cursor-pointer hover:text-[var(--text-primary)]" onClick={() => { filters.setFilter('sortBy', 'category'); filters.setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc'); }}>Category <ArrowUpDown className="w-4 h-4" /></div></th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium text-right"><div className="flex items-center justify-end gap-2 cursor-pointer hover:text-[var(--text-primary)]" onClick={() => { filters.setFilter('sortBy', 'amount'); filters.setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc'); }}>Amount <ArrowUpDown className="w-4 h-4" /></div></th>
                {role === 'admin' && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredAndSorted.map(tx => (
                <tr key={tx.id} className="hover:bg-[var(--bg-color)]/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{format(parseISO(tx.date), 'dd MMM yyyy')}</td>
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-md ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      {tx.title}
                    </div>
                  </td>
                  <td className="px-6 py-4"><Badge variant="default">{tx.category}</Badge></td>
                  <td className="px-6 py-4 text-[var(--text-muted)]">{tx.paymentMethod}</td>
                  <td className={`px-6 py-4 text-right font-semibold ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  {role === 'admin' && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditingTx(tx); setIsModalOpen(true); }} className="p-1.5 text-[var(--text-muted)] hover:text-blue-500 transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(tx.id)} className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredAndSorted.length === 0 && (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} className="px-6 py-12 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-10 h-10 opacity-20" />
                      <p>No transactions found matching your filters.</p>
                      <Button variant="ghost" size="sm" onClick={() => filters.resetFilters()}>Reset Filters</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTx(null); }} title={editingTx ? 'Edit Transaction' : 'Add Transaction'}>
        <TransactionForm initialData={editingTx} onSubmit={onSaveTransaction} onCancel={() => { setIsModalOpen(false); setEditingTx(null); }} />
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirm Delete">
        <div className="space-y-4">
          <p className="text-[var(--text-primary)]">Are you sure you want to delete this transaction? This cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
