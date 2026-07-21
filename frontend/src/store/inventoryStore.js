import { create } from 'zustand';
import api from '../core/api/axios';

export const useInventoryStore = create((set) => ({
  items: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/inventory');
      set({ items: res.data.data, loading: false });
    } catch { set({ loading: false }); }
  },

  step: async (itemId, field, delta) => {
    try {
      const res = await api.put(`/inventory/${itemId}/step`, { field, delta });
      set((s) => ({
        items: s.items.map((it) => (it._id === itemId ? res.data.data : it)),
      }));
    } catch (err) { console.error(err); }
  },
}));
