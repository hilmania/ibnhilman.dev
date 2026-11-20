import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

// GANTI `site` dengan domain Anda sebelum deploy — dipakai untuk sitemap, RSS, dan tag canonical.
export default defineConfig({
  site: "https://example.dev",
  output: "static",
  adapter: cloudflare({ imageService: "passthrough" }),
  // Situs ini tidak memakai session, jadi dimatikan supaya tidak butuh KV namespace.
  session: false,
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
  },
});
