import { create } from 'zustand';
import api from '../core/api/axios';

export const usePosStore = create((set, get) => ({
  items: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/pos');
      set({ items: res.data.data, loading: false });
    } catch { set({ loading: false }); }
  },

  adjustQty: async (itemId, delta) => {
    try {
      const res = await api.put(`/pos/${itemId}/quantity`, { delta });
      set((s) => ({ items: s.items.map((it) => (it._id === itemId ? res.data.data : it)) }));
    } catch (err) { console.error(err); }
  },

  checkout: async () => {
    try {
      const res = await api.post('/pos/checkout');
      set({ items: res.data.data });
      return true;
    } catch (err) { console.error(err); return false; }
  },

  getTotal: () => get().items.reduce((sum, it) => sum + it.price * it.quantity, 0),
}));
