"use client";

import { create } from "zustand";

interface UIStore {
  isDarkMode: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  closeMobileMenu: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isDarkMode: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,

  setDarkMode: (value: boolean) =>
    set(() => {
      document.documentElement.classList.toggle("dark", value);
      localStorage.setItem("skye-dark-mode", String(value));
      return { isDarkMode: value };
    }),

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.isDarkMode;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("skye-dark-mode", String(next));
      return { isDarkMode: next };
    }),

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  toggleSearch: () =>
    set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
}));
