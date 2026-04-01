import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTransactions } from '../data/mockTransactions';

export const useTransactionStore = create(
  persist(
    (set) => ({
      transactions: initialTransactions,
      addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
      editTransaction: (id, updatedTx) => set((state) => ({
        transactions: state.transactions.map((tx) => (tx.id === id ? { ...tx, ...updatedTx } : tx)),
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id),
      })),
      resetTransactions: () => set({ transactions: initialTransactions }),
    }),
    {
      name: 'finance-app-transactions',
    }
  )
);
