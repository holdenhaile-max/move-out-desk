import assert from "node:assert/strict";
import test from "node:test";
import { pageHref } from "../src/lib/trailing-slash.mjs";

test("internal pages get a trailing slash and keep the base path", () => {
  assert.equal(pageHref("/about", "/move-out-desk"), "/move-out-desk/about/");
  assert.equal(pageHref("/guides/texas-am-summer-storage", "/move-out-desk"), "/move-out-desk/guides/texas-am-summer-storage/");
  assert.equal(pageHref("/", "/move-out-desk"), "/move-out-desk/");
  assert.equal(pageHref("/about/", "/move-out-desk"), "/move-out-desk/about/");
});

test("files and off-site links are not given a trailing slash", () => {
  assert.equal(pageHref("/favicon.svg", "/move-out-desk"), "/move-out-desk/favicon.svg");
  assert.equal(pageHref("/sitemap-index.xml", "/move-out-desk"), "/move-out-desk/sitemap-index.xml");
  assert.equal(pageHref("https://www.uhaul.com/Locations/x/", "/move-out-desk"), "https://www.uhaul.com/Locations/x/");
  assert.equal(pageHref("#main", "/move-out-desk"), "#main");
});

test("a site served at the domain root still uses a trailing slash", () => {
  assert.equal(pageHref("/about", ""), "/about/");
  assert.equal(pageHref("/", ""), "/");
  assert.equal(pageHref("/", "/"), "/");
});
