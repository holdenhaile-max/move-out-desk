// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import { rehypeBaseLinks } from "./rehype-base-links.mjs";

/**
 * GitHub Pages project site for holdenhaile-max.
 *
 * Default:
 *   site  https://holdenhaile-max.github.io
 *   base  /<repository name>
 *
 * GitHub Actions sets PUBLIC_BASE_PATH from the real repository name.
 * Local builds fall back to PUBLIC_REPO_NAME or "move-out-desk".
 *
 * Custom domain (one change): set PUBLIC_SITE_URL=https://your.domain
 * and leave PUBLIC_BASE_PATH unset. The base becomes "/" .
 * Set PUBLIC_BASE_PATH only if the site should keep a subpath.
 */
const pagesOrigin = "https://holdenhaile-max.github.io";
const fallbackRepo = "move-out-desk";

function cleanOrigin(value) {
  return value.replace(/\/+$/, "");
}

function normalizeBase(value) {
  if (!value || value === "/") return "/";
  let base = value.startsWith("/") ? value : `/${value}`;
  if (base.length > 1 && base.endsWith("/")) base = base.slice(0, -1);
  return base;
}

const customOrigin = process.env.PUBLIC_SITE_URL
  ? cleanOrigin(process.env.PUBLIC_SITE_URL)
  : "";

const repoName =
  process.env.PUBLIC_REPO_NAME ||
  process.env.GITHUB_REPOSITORY?.split("/")[1] ||
  fallbackRepo;

const site = customOrigin || pagesOrigin;
const usingProjectPage = !customOrigin || customOrigin === pagesOrigin;

const base =
  process.env.PUBLIC_BASE_PATH !== undefined
    ? normalizeBase(process.env.PUBLIC_BASE_PATH)
    : usingProjectPage
      ? `/${repoName}`
      : "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  markdown: {
    processor: unified({
      rehypePlugins: [[rehypeBaseLinks, { base }]],
    }),
  },
  integrations: [mdx(), sitemap()],
});
