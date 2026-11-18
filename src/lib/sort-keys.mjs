export function sizeSqft(size) {
  const match = String(size ?? "")
    .trim()
    .match(/^(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)$/i);
  if (!match) return null;
  return Number(match[1]) * Number(match[2]);
}

export function unitPriceSort(unit) {
  if (!unit || unit.status === "unverified") return { missing: true, value: null };
  const amount = unit.monthly ?? unit.inStoreMonthly ?? unit.onlineMonthly ?? null;
  if (amount == null || Number.isNaN(amount)) return { missing: true, value: null };
  return { missing: false, value: amount };
}

export function climateSortValue(climate) {
  if (climate === true) return { missing: false, value: 1 };
  if (climate === false) return { missing: false, value: 0 };
  return { missing: true, value: null };
}

export function textSortValue(text) {
  const value = String(text ?? "").trim();
  if (!value || value.toLowerCase() === "not yet verified") return { missing: true, value: null };
  return { missing: false, value: value.toLowerCase() };
}

export function compareSortValues(a, b, direction = "asc") {
  if (!a || !b) return 0;
  if (a.missing && b.missing) return 0;
  if (a.missing) return 1;
  if (b.missing) return -1;
  let cmp = 0;
  if (typeof a.value === "number" && typeof b.value === "number") {
    cmp = a.value - b.value;
  } else {
    cmp = String(a.value).localeCompare(String(b.value), "en", { numeric: true, sensitivity: "base" });
  }
  if (cmp === 0) return 0;
  return direction === "desc" ? -cmp : cmp;
}

export function sortRows(rows, key, direction) {
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const cmp = compareSortValues(a.row[key], b.row[key], direction);
      if (cmp !== 0) return cmp;
      return a.index - b.index;
    })
    .map((item) => item.row);
}
