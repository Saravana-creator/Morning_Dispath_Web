import { create } from 'zustand';
import api from '../core/api/axios';

export const useStaffStore = create((set) => ({
  staff: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/staff');
      set({ staff: res.data.data, loading: false });
    } catch { set({ loading: false }); }
  },

  add: async (data) => {
    try {
      const res = await api.post('/staff', data);
      set((s) => ({ staff: [res.data.data, ...s.staff] }));
      return res.data.data;
    } catch (err) { console.error(err); }
  },

  toggle: async (id, currentActive) => {
    try {
      const res = await api.put(`/staff/${id}`, { isActive: !currentActive });
      set((s) => ({ staff: s.staff.map((m) => (m._id === id ? res.data.data : m)) }));
    } catch (err) { console.error(err); }
  },
}));
