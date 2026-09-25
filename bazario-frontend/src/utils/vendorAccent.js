const STALL_COLORS = [
  "var(--stall-1)",
  "var(--stall-2)",
  "var(--stall-3)",
  "var(--stall-4)",
  "var(--stall-5)",
  "var(--stall-6)",
  "var(--stall-7)",
  "var(--stall-8)",
];

/**
 * Every vendor gets the same color every time, everywhere in the app,
 * without us having to store or assign it manually. Same idea as a
 * consistent avatar color in a chat app, applied to "which stall is this."
 */
export function vendorAccent(vendorId) {
  if (!vendorId) return STALL_COLORS[0];
  let hash = 0;
  for (let i = 0; i < vendorId.length; i++) {
    hash = (hash << 5) - hash + vendorId.charCodeAt(i);
    hash |= 0;
  }
  return STALL_COLORS[Math.abs(hash) % STALL_COLORS.length];
}
