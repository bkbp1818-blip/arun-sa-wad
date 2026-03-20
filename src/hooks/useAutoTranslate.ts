import { useCallback, useEffect, useRef, useState } from "react";

interface TranslateInput {
  [key: string]: string; // field name -> text value
}

interface UseAutoTranslateOptions {
  /** Fields to translate: e.g. { nameZh: "สวัสดี", descZh: "รายละเอียด" }
   *  Key = target field name, Value = source text to translate */
  sourceFields: { field: string; sourceText: string }[];
  /** Target language code (default: "zh") */
  targetLang?: string;
  /** Debounce delay in ms (default: 1000) */
  debounceMs?: number;
  /** Whether auto-translate is enabled (default: true) */
  enabled?: boolean;
}

interface UseAutoTranslateReturn {
  translations: Record<string, string>;
  isTranslating: boolean;
  triggerTranslate: () => void;
}

export function useAutoTranslate({
  sourceFields,
  targetLang = "zh",
  debounceMs = 1000,
  enabled = true,
}: UseAutoTranslateOptions): UseAutoTranslateReturn {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Track which fields user has manually edited
  const manualOverrideRef = useRef<Set<string>>(new Set());

  const doTranslate = useCallback(async () => {
    const textsToTranslate = sourceFields.filter(
      (f) => f.sourceText && f.sourceText.trim().length > 0
    );

    if (textsToTranslate.length === 0) return;

    // Cancel previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setIsTranslating(true);

    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts: textsToTranslate.map((f) => ({
            text: f.sourceText,
            field: f.field,
          })),
          targetLang,
        }),
        signal: controller.signal,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translations) {
          setTranslations((prev) => {
            const next = { ...prev };
            for (const [key, value] of Object.entries(data.translations)) {
              // Only update if user hasn't manually overridden this field
              if (!manualOverrideRef.current.has(key)) {
                next[key] = value as string;
              }
            }
            return next;
          });
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Translation error:", error);
      }
    } finally {
      setIsTranslating(false);
    }
  }, [sourceFields, targetLang]);

  // Auto-translate with debounce when source text changes
  useEffect(() => {
    if (!enabled) return;

    const hasText = sourceFields.some(
      (f) => f.sourceText && f.sourceText.trim().length > 0
    );
    if (!hasText) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      doTranslate();
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [sourceFields.map((f) => f.sourceText).join("|"), enabled, debounceMs]);

  // Manual trigger (resets override for all fields)
  const triggerTranslate = useCallback(() => {
    manualOverrideRef.current.clear();
    doTranslate();
  }, [doTranslate]);

  return { translations, isTranslating, triggerTranslate };
}
