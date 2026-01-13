"use client";

import { Suspense } from "react";
import { useAffiliate } from "@/hooks/useAffiliate";

function ReferralTrackerInner() {
  // This hook will automatically track referral clicks when user visits with ?ref=CODE
  useAffiliate();
  return null;
}

export function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralTrackerInner />
    </Suspense>
  );
}
