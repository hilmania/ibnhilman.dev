import type { CollectionEntry } from "astro:content";

/** Perkiraan waktu baca. 200 kata/menit, dibulatkan ke atas, minimal 1. */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function sortByDate<T extends { data: { date: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Kelompokkan per tahun, tahun terbaru lebih dulu. */
export function groupByYear(posts: CollectionEntry<"blog">[]) {
  const map = new Map<number, CollectionEntry<"blog">[]>();
  for (const post of sortByDate(posts)) {
    const year = post.data.date.getFullYear();
    const bucket = map.get(year);
    if (bucket) bucket.push(post);
    else map.set(year, [post]);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}

/** Slug kategori untuk URL: "Build in Public" -> "build-in-public" */
export const categorySlug = (category: string) =>
  category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const formatDate = (date: Date, locale = "en-GB") =>
  date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
