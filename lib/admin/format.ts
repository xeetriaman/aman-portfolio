const TZ = "Australia/Sydney";

export function shortDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso.length === 10 ? `${iso}T00:00:00` : iso).toLocaleDateString("en-AU", { day: "numeric", month: "short", timeZone: TZ });
}

export function longToday() {
  return new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", timeZone: TZ });
}

/** Whole days from today (Sydney) to a yyyy-mm-dd date; negative when past. */
export function daysUntil(date: string) {
  const today = new Date(new Date().toLocaleDateString("en-CA", { timeZone: TZ }));
  return Math.round((new Date(date).getTime() - today.getTime()) / 86_400_000);
}

export function timeAgo(iso: string) {
  const hours = Math.round((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}
