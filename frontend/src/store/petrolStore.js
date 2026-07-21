import { create } from 'zustand';
import api from '../core/api/axios';

const today = () => new Date().toISOString().split('T')[0];

export const usePetrolStore = create((set) => ({
  records: [],
  loading: false,

  fetch: async (date) => {
    set({ loading: true });
    try {
      const res = await api.get(`/petrol?date=${date || today()}`);
      set({ records: res.data.data, loading: false });
    } catch { set({ loading: false }); }
  },

  pay: async (id) => {
    try {
      const res = await api.put(`/petrol/${id}/pay`);
      set((s) => ({
        records: s.records.map((r) => (r._id === id ? res.data.data : r)),
      }));
      return res.data.data;
    } catch (err) { console.error(err); }
  },
}));
