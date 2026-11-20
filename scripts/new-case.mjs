#!/usr/bin/env node
/**
 * Buat draf studi kasus baru.
 *
 *   npm run new:case -- "Replacing a spreadsheet approval process"
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { join } from "node:path";

const DIR = "src/content/work";
const [titleArg] = process.argv.slice(2);

if (!titleArg) {
  console.error('Pakai: npm run new:case -- "Judul Studi Kasus"');
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
client: "[Jenis klien, bukan namanya — mis. Logistics company, 40 staff]"
industry: "[Industri]"
duration: "[mis. 6 minggu]"
role: "[Peran Anda]"
stack: ["Django", "PostgreSQL"]
result: "[Satu kalimat berangka. Mis: Cut approval turnaround from 3 days to 4 hours.]"
date: ${date}
draft: true
---

## The problem

Situasi sebelum proyek, dan dampak bisnisnya. Tulis seperti klien menceritakannya.

## Constraints

Anggaran, tenggat, sistem lama yang harus tetap jalan, regulasi, kapasitas tim.

## Approach and architecture

Bagaimana sistemnya dirancang. Satu diagram sederhana lebih berguna dari tiga paragraf.

## Key decisions

Dua sampai tiga keputusan teknis dan alasannya, termasuk alternatif yang ditolak.
Bagian inilah yang membedakan Anda dari portofolio berisi screenshot.

## Results

Angka sebelum dan sesudah. Kalau tidak ada angka, tulis perubahan yang bisa diverifikasi.

## What I'd do differently

Refleksi jujur. Ini menaikkan kepercayaan, bukan menurunkannya.

---

**Sebelum terbit:** pastikan ada izin tertulis dari klien, dan tidak ada nama,
logo, diagram, atau data yang berasal dari pekerjaan kantor. Lalu hapus \`draft: true\`.
`;

await mkdir(DIR, { recursive: true });
await writeFile(file, body, "utf8");

console.log(`\n  ${file}\n`);
