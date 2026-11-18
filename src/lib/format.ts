export type Status = "verified" | "unverified" | "conflict";

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function money(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "not yet verified";
  const cents = Math.round(amount * 100) % 100;
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function moneyRange(
  min: number | null | undefined,
  max: number | null | undefined,
): string {
  if (min == null || max == null) return "not yet verified";
  return `${money(min)} to ${money(max)}`;
}

export function statusLabel(status: Status): string {
  if (status === "verified") return "Verified";
  if (status === "conflict") return "Sources disagree";
  return "Not yet verified";
}

export function kindLabel(kind: string): string {
  if (kind === "pickup") return "Pickup service";
  if (kind === "self-storage") return "Storage unit";
  return kind;
}
