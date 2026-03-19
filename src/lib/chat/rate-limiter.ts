const rateLimitMap = new Map<string, number[]>();

const RATE_LIMIT_PER_MINUTE = 10;
const RATE_LIMIT_PER_DAY = 50;

export function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const key = ip || "unknown";

  // Get or create timestamps array
  let timestamps = rateLimitMap.get(key) || [];

  // Clean up old entries (older than 24 hours)
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  timestamps = timestamps.filter((t) => t > oneDayAgo);

  // Check daily limit
  if (timestamps.length >= RATE_LIMIT_PER_DAY) {
    return {
      allowed: false,
      message: "คุณส่งข้อความเกินจำนวนที่กำหนดสำหรับวันนี้ (50 ข้อความ/วัน) กรุณาลองใหม่พรุ่งนี้ หรือติดต่อโรงแรมโดยตรง 02-222-1234",
    };
  }

  // Check per-minute limit
  const oneMinuteAgo = now - 60 * 1000;
  const recentMessages = timestamps.filter((t) => t > oneMinuteAgo);
  if (recentMessages.length >= RATE_LIMIT_PER_MINUTE) {
    return {
      allowed: false,
      message: "คุณส่งข้อความเร็วเกินไป กรุณารอสักครู่แล้วลองใหม่อีกครั้ง (จำกัด 10 ข้อความ/นาที)",
    };
  }

  // Record this request
  timestamps.push(now);
  rateLimitMap.set(key, timestamps);

  return { allowed: true };
}

// Cleanup stale entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const filtered = timestamps.filter((t) => t > oneDayAgo);
      if (filtered.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, filtered);
      }
    }
  }, 10 * 60 * 1000);
}
