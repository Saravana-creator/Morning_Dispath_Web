import { create } from 'zustand';
import api from '../core/api/axios';

export const useRouteStore = create((set) => ({
  routes: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/routes');
      set({ routes: res.data.data, loading: false });
    } catch { set({ loading: false }); }
  },

  assignDp: async (routeId, dpId) => {
    try {
      const res = await api.put(`/routes/${routeId}/assign`, { dpId });
      set((s) => ({
        routes: s.routes.map((r) => (r._id === routeId ? res.data.data : r)),
      }));
      return res.data.data;
    } catch (err) { console.error(err); }
  },
}));
