import type { APIRoute } from "astro";

// Route ini berjalan di server (Cloudflare Worker), bukan di-prerender.
export const prerender = false;

interface Lead {
  name?: string;
  email?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  website?: string; // honeypot
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  let lead: Lead;
  try {
    lead = (await request.json()) as Lead;
  } catch {
    return json(400, { error: "Body tidak valid." });
  }

  // Bot mengisi field tersembunyi. Balas 200 supaya mereka tidak tahu.
  if (lead.website) return json(200, { ok: true });

  if (!lead.name || !lead.email || !lead.message) {
    return json(422, { error: "Nama, email, dan pesan wajib diisi." });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) {
    return json(422, { error: "Format email tidak valid." });
  }

  const record = {
    ...lead,
    website: undefined,
    receivedAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? "",
  };

  // --- Simpan ke D1 (opsional) ---
  // Buat dulu: wrangler d1 create leads
  //            wrangler d1 execute leads --file=./schema.sql
  // lalu daftarkan binding "DB" di wrangler.jsonc.
  const env = (locals as { runtime?: { env?: Record<string, unknown> } }).runtime?.env;
  const db = env?.DB as D1Database | undefined;

  if (db) {
    try {
      await db
        .prepare(
          `INSERT INTO leads (name, email, company, project_type, budget, timeline, message, received_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          record.name,
          record.email,
          record.company ?? "",
          record.projectType ?? "",
          record.budget ?? "",
          record.timeline ?? "",
          record.message,
          record.receivedAt
        )
        .run();
    } catch (error) {
      console.error("D1 insert gagal", error);
    }
  } else {
    console.log("Lead baru (D1 belum dikonfigurasi):", record);
  }

  // --- Notifikasi Telegram (opsional) ---
  const token = env?.TELEGRAM_BOT_TOKEN as string | undefined;
  const chatId = env?.TELEGRAM_CHAT_ID as string | undefined;

  if (token && chatId) {
    const text = [
      "Lead baru",
      `${record.name} <${record.email}>`,
      record.company ? `Perusahaan: ${record.company}` : "",
      `Jenis: ${record.projectType ?? "-"}`,
      `Anggaran: ${record.budget ?? "-"}`,
      `Timeline: ${record.timeline ?? "-"}`,
      "",
      record.message,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
    } catch (error) {
      console.error("Notifikasi Telegram gagal", error);
    }
  }

  return json(200, { ok: true });
};
