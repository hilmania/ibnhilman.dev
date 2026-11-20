# Personal site — Astro 7 + Cloudflare

Butuh **Node.js 22.12 atau lebih baru** (syarat Astro 7).

Boilerplate untuk website personal: halaman layanan, studi kasus, blog, dan
formulir kualifikasi lead. Statis seluruhnya, kecuali satu endpoint untuk formulir.

## Jalankan

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # type check
```

## Hal pertama yang harus diubah

1. **`src/site.config.ts`** — nama, email, domain, positioning, angka, tautan Cal.com.
   Semua angka hanya ditulis di file ini. Jangan tulis ulang di halaman, supaya tidak
   ada "5+ tahun" di satu halaman dan "6+ tahun" di halaman lain.
2. **`astro.config.mjs`** — ganti `site` dengan domain Anda.
3. **`public/robots.txt`** — ganti URL sitemap.
4. **`src/styles/global.css`** — palet dan font ada di blok `:root` paling atas.
   Ganti di situ saja; seluruh halaman mengikuti.

## Struktur

```
src/
  site.config.ts        Satu sumber kebenaran: nama, angka, nav, FAQ, proses
  content.config.ts     Skema untuk services, work, blog
  lib/posts.ts          Waktu baca, urutan, pengelompokan per tahun
  content/
    services/*.md       Satu file per paket layanan
    work/*.md           Satu file per studi kasus
    blog/*.md           Satu file per artikel
  pages/
    index.astro         Beranda
    services/           Daftar + detail per layanan
    work/               Daftar + detail studi kasus
    blog/               Daftar, arsip, kategori, dan detail artikel
    book.astro          Formulir kualifikasi + booking
    about, uses, faq
    api/lead.ts         Endpoint formulir (satu-satunya route non-statis)
    rss.xml.ts          Feed RSS
```

Menambah layanan, studi kasus, atau artikel = menambah satu file markdown.
Tidak perlu menyentuh kode halaman.

Semua konten punya `draft: true`. Selama masih draft, halamannya tidak dibuat.

## Menulis

Satu artikel = satu file markdown. Tidak ada CMS, tidak ada database, tidak ada
dasbor yang harus dijaga.

```bash
npm run new:post -- "Judul Artikel" Delivery
npm run new:case -- "Judul Studi Kasus"
```

Script-nya membuat file dengan frontmatter terisi (tanggal hari ini, kategori,
`draft: true`) plus kerangka tulisan dan checklist sebelum terbit. Tulis isinya,
hapus `draft: true`, push. Selesai.

Kategori: `Building`, `Delivery`, `Build in Public`. Ubah daftarnya di
`site.config.ts → blogCategories` **dan** di enum pada `content.config.ts` —
keduanya harus sama.

### Yang sudah jalan otomatis

| Fitur | Keterangan |
| --- | --- |
| Draf | `draft: true` → halamannya tidak dibuat sama sekali |
| Waktu baca | Dihitung dari jumlah kata, 200 kata/menit |
| Kategori | Halaman per kategori di `/blog/category/[slug]` dengan jumlah artikel |
| Arsip | `/blog/archive`, dikelompokkan per tahun — muncul setelah 20 artikel |
| Daftar isi | Otomatis dari heading, muncul kalau ada minimal 3 h2/h3 |
| Prev / next | Navigasi antar artikel di bagian bawah |
| RSS | `/rss.xml`, lengkap dengan kategori |
| Tautan video | Isi `video:` di frontmatter → tombol ke YouTube muncul di artikel |
| Kode | Syntax highlighting bawaan Astro, tema terang dan gelap |

### Menulis dari ponsel

Buka repo di aplikasi GitHub atau github.dev, tambahkan file `.md` di
`src/content/blog/`, commit. Cloudflare build dan terbit otomatis. Tidak perlu
laptop, tidak perlu CMS.

### Kalau nanti butuh editor visual

Decap CMS atau Tina bisa ditambahkan di atas struktur ini tanpa mengubah konten
yang sudah ada — keduanya menulis ke file markdown yang sama. Jangan pasang
sebelum benar-benar terasa perlu; satu `npm run new:post` sudah cukup untuk
ritme satu artikel per minggu.

## Deploy ke Cloudflare

Build menghasilkan dua folder: `dist/client` (file statis) dan `dist/server`
(Worker). Adapter yang mengatur keduanya — jangan menambahkan `main` atau
`assets` ke `wrangler.jsonc`.

**Lewat CLI:**

```bash
npm run build
npx wrangler deploy
```

Cek dulu tanpa benar-benar deploy:

```bash
npx wrangler deploy --dry-run
```

**Lewat repo GitHub** — sambungkan di dasbor Cloudflare (Workers → Builds):

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Setiap push ke `main` otomatis ter-deploy.

### Setelah mengubah wrangler.jsonc

Jalankan `npm run cf-typegen` supaya tipe binding (D1, KV, dan lainnya)
ikut diperbarui di `worker-configuration.d.ts`. Tanpa itu, `npm run check`
akan mengeluh tipe tidak dikenal.

## Formulir lead

`/api/lead` menerima POST, menolak bot lewat honeypot, lalu:

- menyimpan ke **D1** kalau binding `DB` ada;
- mengirim **notifikasi Telegram** kalau `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_CHAT_ID` ada;
- selalu mencatat ke log sebagai cadangan.

Tanpa konfigurasi apa pun, formulirnya tetap jalan — isinya masuk ke log Worker.

Mengaktifkan D1:

```bash
npx wrangler d1 create leads
npx wrangler d1 execute leads --remote --file=./schema.sql
# tempel database_id ke wrangler.jsonc
```

Secret untuk produksi:

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
```

## Catatan versi

Proyek ini memakai Astro 7. Beberapa hal yang berbeda dari tutorial lama:

- **Sesi dimatikan** (`session: false` di `astro.config.mjs`). Situs ini tidak
  memakainya, dan mematikannya menghilangkan kebutuhan KV namespace saat deploy.
  Hapus baris itu kalau nanti Anda butuh session.
- **zod diimpor langsung** dari paket `zod`, bukan dari `astro:content` yang
  sudah deprecated.
- **Compiler baru lebih ketat soal HTML.** Tag yang tidak ditutup sekarang jadi
  error, bukan diperbaiki diam-diam. Ini bagus — kesalahan ketahuan lebih awal.

## Tema

Tiga blok warna di `global.css`, sesuai tiga kondisi: tanpa `data-theme`
(mengikuti sistem), `data-theme="light"`, dan `data-theme="dark"`. Setiap token
didefinisikan lebih dulu di `:root`, lalu hanya ditimpa di blok gelap. Jangan
menulis warna literal di komponen — pakai `var(--token)`.

## Checklist sebelum terbit

- [ ] `site.config.ts` terisi semua
- [ ] Domain diganti di `astro.config.mjs` dan `robots.txt`
- [ ] Tautan Cal.com aktif dan diuji dari ponsel sampai dapat email konfirmasi
- [ ] Formulir diuji sampai datanya benar-benar masuk
- [ ] Email berdomain sendiri aktif (Cloudflare Email Routing)
- [ ] Minimal satu artikel terbit (hapus `draft: true`)
- [ ] `newsletter.embedUrl` diisi, atau komponennya disembunyikan
- [ ] `npm run check` bersih
- [ ] `npx wrangler deploy --dry-run` lolos
- [ ] Lighthouse mobile ≥ 90 di beranda
