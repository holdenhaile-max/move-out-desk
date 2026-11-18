import type { CollectionEntry } from "astro:content";
import { money, moneyRange, type Status } from "./format";

export type ProviderData = CollectionEntry<"providers">["data"];
export type Fee = ProviderData["fees"][number];
export type Unit = ProviderData["units"][number];

export interface CellInput {
  type: "fee" | "unit" | "text";
  feeId?: string;
  size?: string;
  climate?: boolean | null;
  field?: "monthly" | "onlineMonthly" | "inStoreMonthly";
  text?: string;
  status?: Status;
  sourceUrl?: string;
  sourceLabel?: string;
  lastVerified?: string;
}

export interface CellView {
  primary: string;
  detail: string;
  status: Status;
  sourceUrl: string;
  sourceLabel: string;
  lastVerified: string;
}

export function formatFeeAmount(fee: Fee): string {
  if (fee.amount == null && fee.amountMin != null && fee.amountMax != null) {
    return moneyRange(fee.amountMin, fee.amountMax);
  }
  if (fee.amount != null && fee.promoAmount != null) {
    return `${money(fee.amount)} list, ${money(fee.promoAmount)} with the published discount`;
  }
  return money(fee.amount);
}

export function climateLabel(value: boolean | null): string {
  if (value === true) return "Climate controlled";
  if (value === false) return "Not climate controlled";
  return "Not labeled";
}

export function unitMonthly(unit: Unit, field: CellInput["field"] = "monthly"): string {
  if (field === "onlineMonthly") {
    return unit.onlineMonthly == null ? "not yet verified" : `${money(unit.onlineMonthly)} per month online`;
  }
  if (field === "inStoreMonthly") {
    return unit.inStoreMonthly == null
      ? "not yet verified"
      : `${money(unit.inStoreMonthly)} per month in store`;
  }
  if (unit.monthly != null) return `${money(unit.monthly)} per month`;
  if (unit.inStoreMonthly != null) return `${money(unit.inStoreMonthly)} per month in store`;
  if (unit.onlineMonthly != null) return `${money(unit.onlineMonthly)} per month online`;
  return "not yet verified";
}

export function resolveCell(provider: ProviderData, cell: CellInput): CellView {
  if (cell.type === "text") {
    return {
      primary: cell.text || "not yet verified",
      detail: "",
      status: cell.status || "unverified",
      sourceUrl: cell.sourceUrl || provider.website,
      sourceLabel: cell.sourceLabel || provider.name,
      lastVerified: cell.lastVerified || "",
    };
  }

  if (cell.type === "fee") {
    const fee = provider.fees.find((item) => item.id === cell.feeId);
    if (!fee) {
      return {
        primary: "not yet verified",
        detail: "That fee is not in the data file.",
        status: "unverified",
        sourceUrl: provider.website,
        sourceLabel: provider.name,
        lastVerified: "",
      };
    }
    return {
      primary: formatFeeAmount(fee),
      detail: `${fee.label}. ${fee.per}${fee.note ? `. ${fee.note}` : ""}`,
      status: fee.status,
      sourceUrl: fee.sourceUrl,
      sourceLabel: fee.sourceLabel,
      lastVerified: fee.lastVerified,
    };
  }

  const unit = provider.units.find((item) => {
    if (item.size !== cell.size) return false;
    if (cell.climate === undefined) return true;
    return item.climate === cell.climate;
  });
  if (!unit) {
    return {
      primary: "not yet verified",
      detail: "No matching unit was published.",
      status: "unverified",
      sourceUrl: provider.website,
      sourceLabel: provider.name,
      lastVerified: "",
    };
  }
  return {
    primary: unitMonthly(unit, cell.field),
    detail: `${unit.size}, ${climateLabel(unit.climate)}${unit.promo ? `. ${unit.promo}` : ""}`,
    status: unit.status,
    sourceUrl: unit.sourceUrl,
    sourceLabel: unit.sourceLabel,
    lastVerified: unit.lastVerified,
  };
}
