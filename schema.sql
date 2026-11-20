-- Jalankan sekali setelah membuat database:
--   wrangler d1 create leads
--   wrangler d1 execute leads --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  company      TEXT,
  project_type TEXT,
  budget       TEXT,
  timeline     TEXT,
  message      TEXT NOT NULL,
  received_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_received_at ON leads (received_at DESC);
