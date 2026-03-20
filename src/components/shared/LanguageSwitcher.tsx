"use client";

import { useLanguage, type Locale } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages: { locale: Locale; label: string; flag: string }[] = [
  { locale: "th", label: "ไทย", flag: "🇹🇭" },
  { locale: "en", label: "English", flag: "🇬🇧" },
  { locale: "zh", label: "中文", flag: "🇨🇳" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const current = languages.find((l) => l.locale === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 px-2">
          <Globe className="h-4 w-4" />
          <span className="text-xs">{current.flag} {current.locale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.locale}
            onClick={() => setLocale(lang.locale)}
            className={locale === lang.locale ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
