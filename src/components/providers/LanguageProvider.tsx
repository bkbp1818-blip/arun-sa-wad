"use client";

import { useEffect } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useLanguage((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <>{children}</>;
}
