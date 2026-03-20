"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "th" | "en" | "zh";

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      locale: "th",
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "arunsawad-lang",
    }
  )
);
