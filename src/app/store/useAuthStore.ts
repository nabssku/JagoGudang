import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthResponse } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  lastLogin: number | null;
  setAuth: (response: AuthResponse) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitializing: true,
      lastLogin: null,

      setAuth: (response) =>
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isInitializing: false,
          lastLogin: Date.now(),
        }),

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitializing: false,
          lastLogin: null,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isAuthenticated: false, isInitializing: false });
          return;
        }

        try {
          const api = (await import('../../lib/axios')).default;
          const { data } = await api.get('/auth/me');
          set({
            user: data.data || data.user || data,
            isAuthenticated: true,
            isInitializing: false,
            lastLogin: Date.now(),
          });
        } catch {
          // If server fails or offline, fallback to keeping session if token present
          set({ isAuthenticated: true, isInitializing: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
