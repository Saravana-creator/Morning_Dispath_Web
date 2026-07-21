import { create } from 'zustand';
import api from '../core/api/axios';

const today = () => new Date().toISOString().split('T')[0];

export const useTransactionStore = create((set) => ({
  transactions: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/transactions');
      set({ transactions: res.data.data, loading: false });
    } catch { set({ loading: false }); }
  },

  add: async (data) => {
    try {
      const res = await api.post('/transactions', { ...data, date: today() });
      set((s) => ({ transactions: [res.data.data, ...s.transactions] }));
      return res.data.data;
    } catch (err) { console.error(err); }
  },

  remove: async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      set((s) => ({ transactions: s.transactions.filter((t) => t._id !== id) }));
    } catch (err) { console.error(err); }
  },
}));
