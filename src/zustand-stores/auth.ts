import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import type { currentUser } from "../types/current-user";

interface AuthStore {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  currentUser: currentUser | null;
  setCurrentUser: (value: currentUser | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        currentUser: null,
        setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
        setCurrentUser: (value: currentUser | null) =>
          set({ currentUser: value }),
      }),
      {
        name: "auth-storage",
      }
    )
  )
);

export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

export const useSetIsAuthenticated = () =>
  useAuthStore((state) => state.setIsAuthenticated);

export const useCurrentUser = () => useAuthStore((state) => state.currentUser);

export const useSetCurrentUser = () =>
  useAuthStore((state) => state.setCurrentUser);
