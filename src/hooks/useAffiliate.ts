"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const AFFILIATE_KEY = "arunsawad_ref";
const AFFILIATE_EXPIRY_DAYS = 30;

interface AffiliateData {
  code: string;
  affiliateId: string;
  timestamp: number;
}

export function useAffiliate() {
  const searchParams = useSearchParams();
  const [affiliateId, setAffiliateId] = useState<string | null>(null);

  useEffect(() => {
    const refCode = searchParams.get("ref");

    if (refCode) {
      // Track the click and store affiliate info
      trackAndStore(refCode);
    } else {
      // Check for existing stored affiliate
      const stored = getStoredAffiliate();
      if (stored) {
        setAffiliateId(stored.affiliateId);
      }
    }
  }, [searchParams]);

  async function trackAndStore(code: string) {
    try {
      // Check if we already tracked this code recently
      const stored = getStoredAffiliate();
      if (stored && stored.code === code) {
        setAffiliateId(stored.affiliateId);
        return;
      }

      // Track the click
      const res = await fetch(`/api/affiliates/track?code=${code}`);
      if (res.ok) {
        const data = await res.json();

        // Store affiliate info in localStorage
        const affiliateData: AffiliateData = {
          code,
          affiliateId: data.affiliateId,
          timestamp: Date.now(),
        };

        localStorage.setItem(AFFILIATE_KEY, JSON.stringify(affiliateData));
        setAffiliateId(data.affiliateId);
      }
    } catch (error) {
      console.error("Failed to track affiliate:", error);
    }
  }

  function getStoredAffiliate(): AffiliateData | null {
    try {
      const stored = localStorage.getItem(AFFILIATE_KEY);
      if (!stored) return null;

      const data: AffiliateData = JSON.parse(stored);

      // Check if expired
      const expiryTime = AFFILIATE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (Date.now() - data.timestamp > expiryTime) {
        localStorage.removeItem(AFFILIATE_KEY);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  function clearAffiliate() {
    localStorage.removeItem(AFFILIATE_KEY);
    setAffiliateId(null);
  }

  return {
    affiliateId,
    clearAffiliate,
    getStoredAffiliate,
  };
}
