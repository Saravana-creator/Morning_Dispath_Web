import { create } from 'zustand';
import api from '../core/api/axios';

export const useSalaryStore = create((set) => ({
  records: [],
  loading: false,

  fetch: async (month) => {
    set({ loading: true });
    const m = month || new Date().toISOString().slice(0, 7);
    try {
      const res = await api.get(`/salary?month=${m}`);
      set({ records: res.data.data, loading: false });
    } catch { set({ loading: false }); }
  },

  giveAdvance: async (id, amount = 500) => {
    try {
      const res = await api.put(`/salary/${id}/advance`, { amount });
      set((s) => ({ records: s.records.map((r) => (r._id === id ? res.data.data : r)) }));
      return res.data.data;
    } catch (err) { console.error(err); }
  },
}));
