import assert from "node:assert/strict";
import test from "node:test";
import {
  climateSortValue,
  compareSortValues,
  sizeSqft,
  sortRows,
  textSortValue,
  unitPriceSort,
} from "../src/lib/sort-keys.mjs";

test("size sorts by square feet, and a size we cannot read sorts as missing", () => {
  assert.equal(sizeSqft("5x5"), 25);
  assert.equal(sizeSqft("5 x 10"), 50);
  assert.equal(sizeSqft("10×10"), 100);
  assert.equal(sizeSqft("not listed"), null);
});

test("unverified prices sort last in both directions, and zero stays a real price", () => {
  const rows = [
    { name: "mid", price: unitPriceSort({ status: "verified", monthly: 100 }) },
    { name: "blank", price: unitPriceSort({ status: "unverified", monthly: 0 }) },
    { name: "low", price: unitPriceSort({ status: "verified", monthly: 40 }) },
    { name: "missing", price: unitPriceSort({ status: "verified", monthly: null }) },
    { name: "zero", price: unitPriceSort({ status: "verified", monthly: 0 }) },
  ];

  assert.deepEqual(
    sortRows(rows, "price", "asc").map((row) => row.name),
    ["zero", "low", "mid", "blank", "missing"],
  );
  assert.deepEqual(
    sortRows(rows, "price", "desc").map((row) => row.name),
    ["mid", "low", "zero", "blank", "missing"],
  );
});

test("price uses the in-store rate when the single monthly rate is absent", () => {
  const value = unitPriceSort({
    status: "verified",
    monthly: null,
    inStoreMonthly: 100,
    onlineMonthly: 60,
  });
  assert.deepEqual(value, { missing: false, value: 100 });
});

test("a conflict with a published number still sorts by that number", () => {
  const value = unitPriceSort({ status: "conflict", monthly: 37 });
  assert.deepEqual(value, { missing: false, value: 37 });
});

test("unknown climate sorts last, and not-climate is not treated as missing", () => {
  const rows = [
    { name: "yes", climate: climateSortValue(true) },
    { name: "unknown", climate: climateSortValue(null) },
    { name: "no", climate: climateSortValue(false) },
  ];
  assert.deepEqual(
    sortRows(rows, "climate", "asc").map((row) => row.name),
    ["no", "yes", "unknown"],
  );
  assert.deepEqual(
    sortRows(rows, "climate", "desc").map((row) => row.name),
    ["yes", "no", "unknown"],
  );
});

test("address sort ignores a missing address and does not treat it as empty-first", () => {
  const rows = [
    { name: "bryan", location: textSortValue("3810 Old College Road, Bryan, TX 77801") },
    { name: "none", location: textSortValue(null) },
    { name: "holleman", location: textSortValue("104 Holleman Dr, College Station, TX 77840") },
    { name: "gap", location: textSortValue("not yet verified") },
  ];
  assert.deepEqual(
    sortRows(rows, "location", "asc").map((row) => row.name),
    ["holleman", "bryan", "none", "gap"],
  );
  assert.equal(compareSortValues(rows[1].location, rows[2].location, "desc"), 1);
});
