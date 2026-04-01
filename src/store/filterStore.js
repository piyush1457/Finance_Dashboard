import { create } from 'zustand';

const initialFilters = {
  searchQuery: '',
  selectedType: 'All', // 'All' | 'income' | 'expense'
  selectedCategory: 'All',
  dateRange: null, // { start, end } or null
  sortBy: 'date', // 'date' | 'amount' | 'category'
  sortOrder: 'desc', // 'asc' | 'desc'
};

export const useFilterStore = create(
  (set) => ({
    ...initialFilters,
    setFilter: (key, value) => set({ [key]: value }),
    resetFilters: () => set(initialFilters),
  })
);
