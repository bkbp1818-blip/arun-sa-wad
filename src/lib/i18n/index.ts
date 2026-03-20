import { th, type TranslationKey } from "./th";
import { en } from "./en";
import { zh } from "./zh";
import { useLanguage, type Locale } from "@/hooks/useLanguage";

const translations: Record<Locale, Record<TranslationKey, string>> = {
  th,
  en,
  zh,
};

/**
 * Hook สำหรับแปลภาษา UI
 * ใช้: const { t } = useTranslation();
 *      t("nav.rooms") → "ห้องพัก" / "Rooms" / "客房"
 */
export function useTranslation() {
  const locale = useLanguage((s) => s.locale);

  function t(key: TranslationKey): string {
    return translations[locale]?.[key] ?? translations.th[key] ?? key;
  }

  return { t, locale };
}

/**
 * ดึงชื่อสินค้าตามภาษาปัจจุบัน
 * ถ้าไม่มีภาษาจีน → fallback เป็นอังกฤษ → ไทย
 */
export function getLocalizedName(
  locale: Locale,
  item: { name?: string | null; nameTh?: string | null; nameZh?: string | null }
): string {
  if (locale === "zh") return item.nameZh || item.name || item.nameTh || "";
  if (locale === "en") return item.name || item.nameTh || "";
  return item.nameTh || item.name || "";
}

/**
 * ดึงคำอธิบายสินค้าตามภาษาปัจจุบัน
 * ถ้าไม่มีภาษาจีน → fallback เป็นอังกฤษ → ไทย
 */
export function getLocalizedDesc(
  locale: Locale,
  item: { description?: string | null; descTh?: string | null; descZh?: string | null }
): string {
  if (locale === "zh") return item.descZh || item.description || item.descTh || "";
  if (locale === "en") return item.description || item.descTh || "";
  return item.descTh || item.description || "";
}

export type { TranslationKey };
