#!/usr/bin/env node
/**
 * Buat draf artikel baru.
 *
 *   npm run new:post -- "How I Estimate Software Projects"
 *   npm run new:post -- "Judul artikel" Delivery
 *
 * Argumen kedua opsional: kategori (Building | Delivery | Build in Public).
 * Default: Building.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { join } from "node:path";

const CATEGORIES = ["Building", "Delivery", "Build in Public"];
const DIR = "src/content/blog";

const [titleArg, categoryArg] = process.argv.slice(2);

if (!titleArg) {
  console.error('Pakai: npm run new:post -- "Judul Artikel" [Kategori]');
  console.error(`Kategori: ${CATEGORIES.join(" | ")}`);
  process.exit(1);
}

const category = categoryArg ?? "Building";
if (!CATEGORIES.includes(category)) {
  console.error(`Kategori "${category}" tidak dikenal. Pilih: ${CATEGORIES.join(" | ")}`);
  process.exit(1);
}

const slug = titleArg
  .toLowerCase()
  .normalize("NFD")
  .replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 70);

const date = new Date().toISOString().slice(0, 10);
const file = join(DIR, `${slug}.md`);

try {
  await access(file);
  console.error(`Sudah ada: ${file}`);
  process.exit(1);
} catch {
  // belum ada — lanjut
}

const body = `---
title: ${JSON.stringify(titleArg)}
description: "Satu kalimat yang membuat orang mau membaca. Ini juga yang muncul di Google dan RSS."
date: ${date}
category: ${category}
draft: true
---

[TL;DR tiga poin. Tulis ini terakhir, setelah artikelnya jadi.]

-
-
-

## Masalahnya

Mulai dari situasi nyata, bukan definisi. Pembaca harus mengenali dirinya di paragraf pertama.

## Yang saya lakukan

Langkah konkret. Kalau ada kode, konfigurasi, atau angka, taruh di sini.

## Apa yang bisa Anda pakai

Tutup dengan sesuatu yang bisa langsung dipakai pembaca hari ini.

---

**Checklist sebelum terbit**

- [ ] \`description\` sudah diisi, bukan placeholder
- [ ] TL;DR terisi
- [ ] Tidak ada nama klien, logo, atau data perusahaan
- [ ] Ada satu ajakan di akhir (produk, newsletter, atau booking)
- [ ] Hapus \`draft: true\` dan hapus blok checklist ini
`;

await mkdir(DIR, { recursive: true });
await writeFile(file, body, "utf8");

console.log(`\n  ${file}`);
console.log(`  → http://localhost:4321/blog/${slug}  (setelah draft: true dihapus)\n`);
