import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Filter, ArrowUpDown, Download, Edit2, Trash2, ArrowUpRight, ArrowDownRight, FileX, SearchX, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

function TransactionForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    title: '', amount: '', category: Object.values(CATEGORIES)[0], type: 'expense', paymentMethod: Object.values(PAYMENT_METHODS)[0], date: format(new Date(), 'yyyy-MM-dd')
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const newErrors = {};
    if (!data.title) newErrors.title = 'Title is required';
    else if (data.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    else if (data.title.length > 50) newErrors.title = 'Title cannot exceed 50 characters';

    if (!data.amount) newErrors.amount = 'Amount is required';
    else if (Number(data.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';

    if (!data.date) newErrors.date = 'Date is required';
    
    return newErrors;
  };

  useEffect(() => {
    setErrors(validate(formData));
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalErrors = validate(formData);
    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setTouched({ title: true, amount: true, date: true });
      return;
    }
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      id: initialData?.id || Date.now().toString(),
    });
  };

  const isInvalid = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <div className="flex justify-between items-end">
          <label className="text-sm font-medium text-[var(--text-primary)]">Title *</label>
          <span className={`text-[10px] font-bold ${formData.title.length > 45 ? 'text-rose-500' : 'text-[var(--text-muted)]'}`}>
            {formData.title.length}/50
          </span>
        </div>
        <Input 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
          onBlur={() => setTouched({...touched, title: true})}
          placeholder="e.g. Monthly Rent" 
          className={touched.title && errors.title ? 'border-rose-500 ring-rose-500/20' : ''}
        />
        {touched.title && errors.title && <p className="text-[10px] font-medium text-rose-500 mt-1">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text-primary)]">Amount *</label>
          <Input 
            type="number" 
            value={formData.amount} 
            onChange={e => setFormData({...formData, amount: e.target.value})} 
            onBlur={() => setTouched({...touched, amount: true})}
            placeholder="0.00" 
            className={touched.amount && errors.amount ? 'border-rose-500 ring-rose-500/20' : ''}
          />
          {touched.amount && errors.amount && <p className="text-[10px] font-medium text-rose-500 mt-1">{errors.amount}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text-primary)]">Date *</label>
          <Input 
            type="date" 
            value={formData.date} 
            onChange={e => setFormData({...formData, date: e.target.value})} 
            onBlur={() => setTouched({...touched, date: true})}
            className={touched.date && errors.date ? 'border-rose-500 ring-rose-500/20' : ''}
          />
        </div>
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

      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isInvalid} className={isInvalid ? 'opacity-50 cursor-not-allowed' : 'btn-primary-glow'}>
          Save Transaction
        </Button>
      </div>
    </form>
  );
}

export function Transactions() {
  const { transactions, addTransaction, editTransaction, deleteTransaction } = useTransactionStore();
  const filters = useFilterStore();
  const { role } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchQuery, filters.selectedType, filters.selectedCategory]);

  const { paginatedData, totalPages, totalResults } = useMemo(() => {
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

    const totalResults = result.length;
    const totalPages = Math.ceil(totalResults / itemsPerPage);
    const paginatedData = result.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return { paginatedData, totalPages, totalResults };
  }, [transactions, filters, currentPage]);

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
          <Button variant="secondary" onClick={handleExport} className="whitespace-nowrap rounded-full shrink-0 btn-hover-scale">
             <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <div className="relative group">
            <Button 
              onClick={() => { if (role === 'admin') { setEditingTx(null); setIsModalOpen(true); } }} 
              disabled={role !== 'admin'}
              className={`whitespace-nowrap rounded-full shrink-0 ${role === 'admin' ? 'btn-primary-glow btn-hover-scale' : 'opacity-50 cursor-not-allowed bg-[var(--border-color)]'}`}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Transaction
            </Button>
            {role !== 'admin' && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-slate-700">
                <p className="font-bold text-amber-400 mb-0.5">View-Only Mode</p>
                Switch to Admin role in Settings to add data.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Active Pills */}
      {(filters.searchQuery || filters.selectedType !== 'All' || filters.selectedCategory !== 'All') && (
        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mr-1">Filtered by:</span>
          
          {filters.searchQuery && (
            <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-full border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5">
              Search: "{filters.searchQuery}"
              <button onClick={() => filters.setFilter('searchQuery', '')} className="hover:bg-blue-500/20 rounded-full p-0.5"><Plus className="w-3 h-3 rotate-45" /></button>
            </Badge>
          )}

          {filters.selectedType !== 'All' && (
            <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-full border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5">
              Type: {filters.selectedType}
              <button onClick={() => filters.setFilter('selectedType', 'All')} className="hover:bg-blue-500/20 rounded-full p-0.5"><Plus className="w-3 h-3 rotate-45" /></button>
            </Badge>
          )}

          {filters.selectedCategory !== 'All' && (
            <Badge variant="secondary" className="pl-3 pr-1 py-1 gap-1 rounded-full border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5">
              Category: {filters.selectedCategory}
              <button onClick={() => filters.setFilter('selectedCategory', 'All')} className="hover:bg-blue-500/20 rounded-full p-0.5"><Plus className="w-3 h-3 rotate-45" /></button>
            </Badge>
          )}

          <button 
            onClick={() => filters.resetFilters()} 
            className="text-xs text-rose-500 hover:text-rose-600 font-bold hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

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
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
                    {role === 'admin' && <td className="px-6 py-4"><Skeleton className="h-8 w-16 ml-auto" /></td>}
                  </tr>
                ))
              ) : (
                paginatedData.map(tx => (
                  <tr key={tx.id} className="hover:bg-[var(--bg-color)]/50 transition-all border-b border-transparent hover:border-[var(--border-color)] group hover:translate-x-1">
                    <td className="px-6 py-4 whitespace-nowrap">{format(parseISO(tx.date), 'dd MMM yyyy')}</td>
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md transition-transform group-hover:scale-110 ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        {tx.title}
                      </div>
                    </td>
                    <td className="px-6 py-4"><Badge variant="default" className="font-semibold">{tx.category}</Badge></td>
                    <td className="px-6 py-4 text-[var(--text-muted)] font-medium">{tx.paymentMethod}</td>
                    <td className={`px-6 py-4 text-right font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>
                    {role === 'admin' && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingTx(tx); setIsModalOpen(true); }} 
                            className="p-1.5 text-[var(--text-muted)] hover:text-blue-500 transition-all hover:scale-110" 
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(tx.id)} 
                            className="p-1.5 text-[var(--text-muted)] hover:text-rose-500 transition-all hover:scale-110" 
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}

              {!isLoading && transactions.length === 0 && (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} className="px-6 py-20 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
                      <div className="p-4 bg-[var(--bg-color)] rounded-full">
                        <FileX className="w-12 h-12 opacity-40" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">No Transactions Yet</h3>
                        <p className="mt-1">Start by adding your first income or expense transaction.</p>
                      </div>
                      {role === 'admin' && (
                        <Button onClick={() => setIsModalOpen(true)} className="mt-2">Add My First Transaction</Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && transactions.length > 0 && paginatedData.length === 0 && (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} className="px-6 py-20 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
                      <div className="p-4 bg-[var(--bg-color)] rounded-full">
                        <SearchX className="w-12 h-12 opacity-40" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">No Results Found</h3>
                        <p className="mt-1">We couldn't find any transactions matching your current filters.</p>
                      </div>
                      <Button variant="outline" onClick={() => filters.resetFilters()} className="mt-2">Clear All Filters</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!isLoading && totalResults > itemsPerPage && (
          <div className="px-6 py-4 bg-[var(--bg-color)] border-t border-[var(--border-color)] flex items-center justify-between">
            <p className="text-sm text-[var(--text-muted)]">
              Showing <span className="font-medium text-[var(--text-primary)]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-[var(--text-primary)]">{Math.min(currentPage * itemsPerPage, totalResults)}</span> of <span className="font-medium text-[var(--text-primary)]">{totalResults}</span> results
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="rounded-lg px-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  // Show limited page numbers if there are too many
                  if (totalPages > 5 && Math.abs(pageNumber - currentPage) > 1 && pageNumber !== 1 && pageNumber !== totalPages) {
                    if (pageNumber === 2 || pageNumber === totalPages - 1) return <span key={pageNumber} className="px-1">...</span>;
                    return null;
                  }
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-8 h-8 rounded-lg p-0 ${currentPage === pageNumber ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="rounded-lg px-2"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
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
