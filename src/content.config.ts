import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    priceFrom: z.string(),
    duration: z.string(),
    order: z.number().default(99),
    outcomes: z.array(z.string()),
    notIncluded: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    industry: z.string(),
    duration: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    result: z.string(), // satu kalimat berangka
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(["Building", "Delivery", "Build in Public"]),
    updated: z.coerce.date().optional(),
    video: z.url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, work, blog };
