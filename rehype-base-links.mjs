import { pageHref } from "./src/lib/trailing-slash.mjs";

/**
 * Prefix root-relative href/src in Markdown and MDX with Astro's `base`,
 * and give page links a trailing slash. Files, external links, and hashes stay put.
 */
export function rehypeBaseLinks(options = {}) {
  const prefix = normalize(options.base);

  return (tree) => {
    walk(tree);
  };

  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (node.type === "element" && node.properties) {
      for (const key of ["href", "src"]) {
        const value = node.properties[key];
        if (typeof value === "string") node.properties[key] = apply(value);
      }
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
  }

  function apply(value) {
    if (!value.startsWith("/") || value.startsWith("//")) return value;
    if (prefix && (value === prefix || value.startsWith(`${prefix}/`))) {
      const rest = value.slice(prefix.length) || "/";
      return pageHref(rest, prefix);
    }
    return pageHref(value, prefix);
  }
}

function normalize(base) {
  if (!base || base === "/") return "";
  let value = base.startsWith("/") ? base : `/${base}`;
  if (value.endsWith("/")) value = value.slice(0, -1);
  return value;
}
