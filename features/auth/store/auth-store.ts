"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  usuario: string;
  oficinaId: string;
  prefeituraId: string;
  mustChangePassword?: boolean;
};

type AuthStore = {
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  clearMustChangePassword: () => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      clearMustChangePassword: () =>
        set((state) => ({
          user: state.user
            ? { ...state.user, mustChangePassword: false }
            : null,
        })),
      clearSession: () => set({ token: null, user: null }),
    }),
    {
      name: "postoapp-auth",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export function getAuthToken() {
  return useAuthStore.getState().token;
}

export function getAuthUser() {
  return useAuthStore.getState().user;
}
