import { create } from 'zustand';
import api from '../core/api/axios';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('mm_user') || 'null'),
  token: localStorage.getItem('mm_token') || null,
  loading: false,
  error: null,

  login: async (phone, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { phone, password });
      const { token, user } = res.data;
      localStorage.setItem('mm_token', token);
      localStorage.setItem('mm_user', JSON.stringify(user));
      set({ user, token, loading: false });
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_user');
    set({ user: null, token: null });
  },

  isAuthenticated: () => !!get().token,
}));
