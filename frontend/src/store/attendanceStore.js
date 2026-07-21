import { create } from 'zustand';
import api from '../core/api/axios';

const today = () => new Date().toISOString().split('T')[0];

export const useAttendanceStore = create((set) => ({
  records: [],
  filter: 'all',
  loading: false,
  date: today(),

  fetch: async (date) => {
    set({ loading: true, date: date || today() });
    try {
      const res = await api.get(`/attendance?date=${date || today()}`);
      set({ records: res.data.data, loading: false });
    } catch { set({ loading: false }); }
  },

  updateStatus: async (staffId, status) => {
    const date = today();
    try {
      const res = await api.put(`/attendance/${staffId}`, { date, status });
      set((s) => ({
        records: s.records.map((r) =>
          r.staffId.toString() === staffId.toString()
            ? { ...r, status: res.data.data.status }
            : r
        ),
      }));
    } catch (err) { console.error(err); }
  },

  setFilter: (filter) => set({ filter }),

  getFiltered: (records, filter) => {
    if (filter === 'all') return records;
    return records.filter((r) => r.status === filter);
  },
}));
