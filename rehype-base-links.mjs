/**
 * Prefix root-relative href/src in Markdown and MDX with Astro's `base`.
 * External, protocol-relative, hash, and already-prefixed links are left alone.
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
    if (!prefix) return value;
    if (value === prefix || value.startsWith(`${prefix}/`)) return value;
    return `${prefix}${value}`;
  }
}

function normalize(base) {
  if (!base || base === "/") return "";
  let value = base.startsWith("/") ? base : `/${base}`;
  if (value.endsWith("/")) value = value.slice(0, -1);
  return value;
}
