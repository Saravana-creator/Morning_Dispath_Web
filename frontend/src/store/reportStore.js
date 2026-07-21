import { create } from 'zustand';
import api from '../core/api/axios';

export const useReportStore = create((set) => ({
  report: null,
  loading: false,

  fetch: async (date, month) => {
    set({ loading: true });
    const d = date || new Date().toISOString().split('T')[0];
    const m = month || d.slice(0, 7);
    try {
      const res = await api.get(`/reports?date=${d}&month=${m}`);
      set({ report: res.data.data, loading: false });
    } catch { set({ loading: false }); }
  },
}));
