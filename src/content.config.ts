import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const status = z.enum(["verified", "unverified", "conflict"]);

const fee = z.object({
  id: z.string(),
  label: z.string(),
  amount: z.number().nullable(),
  amountMin: z.number().nullable().optional(),
  amountMax: z.number().nullable().optional(),
  promoAmount: z.number().nullable().optional(),
  promoLabel: z.string().optional(),
  per: z.string(),
  status,
  note: z.string().optional(),
  sourceUrl: z.string(),
  sourceLabel: z.string(),
  lastVerified: date,
});

const unit = z.object({
  size: z.string(),
  climate: z.boolean().nullable(),
  access: z.string(),
  monthly: z.number().nullable(),
  onlineMonthly: z.number().nullable().optional(),
  inStoreMonthly: z.number().nullable().optional(),
  promo: z.string().optional(),
  availability: z.string().optional(),
  status,
  note: z.string().optional(),
  sourceUrl: z.string(),
  sourceLabel: z.string(),
  lastVerified: date,
});

const sourced = z.object({
  label: z.string(),
  value: z.string(),
  status,
  note: z.string().optional(),
  sourceUrl: z.string(),
  sourceLabel: z.string(),
  lastVerified: date,
});

const providers = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/providers" }),
  schema: z.object({
    name: z.string(),
    kind: z.enum(["pickup", "self-storage"]),
    schools: z.array(z.string()),
    cities: z.array(z.string()),
    summary: z.string(),
    website: z.string(),
    phone: z.string().nullable(),
    affiliateUrl: z.string().nullable(),
    address: z.string().nullable(),
    fees: z.array(fee),
    units: z.array(unit).default([]),
    facts: z.array(sourced).default([]),
    gaps: z.array(z.string()).default([]),
  }),
});

const schools = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/schools" }),
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    cityId: z.string(),
    place: z.string(),
    website: z.string(),
    summary: z.string(),
    independenceNote: z.string(),
  }),
});

const cities = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/cities" }),
  schema: z.object({
    name: z.string(),
    state: z.string(),
    summary: z.string(),
    regionNote: z.string(),
  }),
});

const cell = z.object({
  type: z.enum(["fee", "unit", "text"]),
  feeId: z.string().optional(),
  size: z.string().optional(),
  climate: z.boolean().nullable().optional(),
  field: z.enum(["monthly", "onlineMonthly", "inStoreMonthly"]).optional(),
  text: z.string().optional(),
  status: status.optional(),
  sourceUrl: z.string().optional(),
  sourceLabel: z.string().optional(),
  lastVerified: date.optional(),
});

const comparisons = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/comparisons" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: date,
    left: z.string(),
    right: z.string(),
    intro: z.array(z.string()),
    rows: z.array(
      z.object({
        label: z.string(),
        note: z.string().optional(),
        left: cell,
        right: cell,
      }),
    ),
    takeaway: z.array(z.string()),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string(),
    updated: date,
    order: z.number(),
    featured: z.boolean().default(false),
    schoolId: z.string().optional(),
    cityId: z.string().optional(),
    sources: z.array(
      z.object({
        label: z.string(),
        url: z.string(),
      }),
    ),
  }),
});

export const collections = { providers, schools, cities, comparisons, guides };
