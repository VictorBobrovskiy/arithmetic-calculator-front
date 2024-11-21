import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token'),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  clearToken: () => {
    localStorage.removeItem('token');
    set({ token: null });
  }
}));

export const useAuth = () => {
  const { token, setToken, clearToken } = useAuthStore();

  return {
    isAuthenticated: !!token,
    login: (token) => setToken(token),
    logout: () => {
      clearToken();
      window.location.href = '/login';
    }
  };
};