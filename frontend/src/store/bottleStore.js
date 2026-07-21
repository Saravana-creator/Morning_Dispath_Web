import { create } from 'zustand';
import api from '../core/api/axios';

const today = () => new Date().toISOString().split('T')[0];

export const useBottleStore = create((set, get) => ({
  records: [],
  loading: false,

  fetch: async (date) => {
    set({ loading: true });
    try {
      const res = await api.get(`/bottles?date=${date || today()}`);
      set({ records: res.data.data, loading: false });
    } catch { set({ loading: false }); }
  },

  step: async (id, field, delta) => {
    try {
      const res = await api.put(`/bottles/${id}/step`, { field, delta });
      set((s) => ({ records: s.records.map((r) => (r._id === id ? res.data.data : r)) }));
    } catch (err) { console.error(err); }
  },

  getTotalPending: () =>
    get().records.reduce((sum, r) => sum + Math.max(0, r.issuedYesterday - r.collectedToday - r.missing - r.broken), 0),
}));
