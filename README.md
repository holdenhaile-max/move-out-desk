# Storage Price Check

An independent, static comparison of college move-out and summer storage. Version 1 covers Texas A&M and College Station. The pages are templates. Schools, cities, providers, comparisons, and guides live in data files, so the same shape can back a later directory (local porta potty rentals, Texas septic pumping) without a new layout for every city.

There is no server, no database, and no tracker. The built site is a `dist/` folder.

The default public URL is a GitHub Pages project site:

`https://holdenhaile-max.github.io/<repository-name>/`

The repository name is the base path. GitHub Actions fills it in from the repo you push. A local build uses `move-out-desk` unless you set `PUBLIC_REPO_NAME` or `PUBLIC_BASE_PATH`. Set `PUBLIC_SITE_URL` to a custom origin when you add a domain. That one change also drops the base path to `/`.

## Run it locally

Node.js 22.23.4 or newer.

```bash
npm install
npm run dev
```

The dev server defaults to port 4321. With the project-page base, open `http://localhost:4321/move-out-desk/` (or `/<PUBLIC_BASE_PATH>/` if you set one).

```bash
npm run build
npm run preview
```

Preview the path GitHub will publish, using the real repository name:

```bash
PUBLIC_BASE_PATH=/your-repo-name npm run build
```

`npm run check:copy` fails if page copy in `src/` contains an em dash or an en dash.

## Where the facts live

| What you are adding | File |
| --- | --- |
| A campus | `src/content/schools/<id>.json` |
| A city | `src/content/cities/<id>.json` |
| A company or facility | `src/content/providers/<id>.json` |
| A head-to-head page | `src/content/comparisons/<id>.json` |
| A written guide | `src/content/guides/<id>.mdx` |

Provider files hold every price, date, and gap. Each fee and unit has `sourceUrl`, `sourceLabel`, `lastVerified`, and a `status` of `verified`, `unverified`, or `conflict`. An unknown dollar amount is `null`. The templates render that as "not yet verified". Do not invent a price to fill a hole.

`affiliateUrl` is `null` on every provider today. When an affiliate program is joined, put the tracking URL in that field. The link component will use it and set `rel="sponsored nofollow"`. Leave it `null` and the link stays a normal link to the company's own page.

Schemas are in `src/content.config.ts`. A bad file fails the build.

## Add one new guide from the data files

1. If the company is new, add `src/content/providers/example-storage.json`. Copy an existing provider and replace the facts. Keep `affiliateUrl` null until you have a real program link. Set `schools` and `cities` to ids that already exist, or add those files too.
2. Create `src/content/guides/example-storage.mdx`. Front matter needs `title`, `description`, `eyebrow`, `updated` (`YYYY-MM-DD`), `order`, `featured`, and `sources`. Optional `schoolId` and `cityId` attach it to those pages.
3. In the guide body, pull tables instead of retyping rates:

```mdx
import FeeTable from "../../components/FeeTable.astro";
import UnitTable from "../../components/UnitTable.astro";

<FeeTable id="example-storage" />
<UnitTable climate="yes" sizes="5x5,5x10" cityId="college-station" />
```

`climate` can be `yes`, `no`, `unknown`, or `any`.

4. Run `npm run build`. The guide is served at `/guides/example-storage` under the base path, so the public URL is `https://holdenhaile-max.github.io/<repository-name>/guides/example-storage`. It is also listed on the guides index, and on the school page when `schoolId` matches. A Markdown link that starts with `/` is prefixed with that base. Links to other sites are left alone.

A new comparison is the same idea. Add `src/content/comparisons/example.json` with `left` and `right` set to provider ids, and rows whose cells are `{ "type": "fee", "feeId": "..." }`, `{ "type": "unit", "size": "5x10", "climate": true, "field": "inStoreMonthly" }`, or a `{ "type": "text" }` cell with its own source. The page is `/compare/example`. No new Astro file.

## Deploy on GitHub Pages

The site is static. GitHub Actions builds it and deploys with the official Pages actions (`actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`). The workflow is `.github/workflows/deploy.yml`. It runs on every push to `main`, and you can run it by hand from the Actions tab.

No GitHub account is created by this repo. Use the existing account `holdenhaile-max`.

1. Create an empty repository under that account if you do not already have one, and push this project to it. The repository name becomes the path, for example `https://holdenhaile-max.github.io/move-out-desk/` when the repo is named `move-out-desk`.
2. In the repository on GitHub, open **Settings**, then **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main`, or open **Actions**, choose **Deploy to GitHub Pages**, and run it. The workflow installs dependencies, runs `npm run build`, and publishes the `dist` folder.
5. The build sets `PUBLIC_BASE_PATH` from the Pages base path, so links, the favicon, canonical URLs, Open Graph URLs, `robots.txt`, and `sitemap-index.xml` include `/<repository-name>`.
6. When the job is green, open `https://holdenhaile-max.github.io/<repository-name>/`. Confirm `robots.txt` points at `https://holdenhaile-max.github.io/<repository-name>/sitemap-index.xml`.

Node 22 is selected in the workflow. The `engines` field in `package.json` asks for 22.23.4 or newer.

### Custom domain later

Switching off the project path is one environment change, plus DNS.

1. In the workflow file, add this to the **Build** step `env` block:

   ```yaml
   PUBLIC_SITE_URL: https://your.domain
   ```

   Leave `PUBLIC_BASE_PATH` unset for a domain that serves the site at `/`. `astro.config.mjs` then uses that origin and a base of `/`. If you still want a subpath, set `PUBLIC_BASE_PATH` as well (for example `/storage`).

2. Add a file named `public/CNAME` whose only line is the domain, with no `https://` and no path:

   ```text
   your.domain
   ```

   Astro copies `public/` into `dist/`, which is what GitHub Pages reads. Do not add this file until the domain is ready. A CNAME file turns off the `github.io` project URL.

3. At your DNS host, point the name at GitHub Pages:
   - For a subdomain such as `www`, add a CNAME record to `holdenhaile-max.github.io`.
   - For an apex domain, add A records for `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. GitHub's own docs are the list to recheck if those addresses change.
4. In **Settings**, then **Pages**, enter the same domain under **Custom domain** and wait until the DNS check passes. Turn on **Enforce HTTPS** after the certificate is issued.
5. Redeploy from Actions. Canonical links and the sitemap should use `https://your.domain` with no repository prefix.

## What this version checked

Facts were read from provider and facility pages on November 18, 2026. A row that could not be confirmed is marked not yet verified inside the provider file. The guides tell the story. Each provider page is the full table.
