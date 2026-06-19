-- Burger Sorter schema. Client-supplied TEXT primary keys; whole-state saves.
-- Idempotent: safe to re-run on every deploy.

CREATE TABLE IF NOT EXISTS ingredients (
  id        TEXT PRIMARY KEY,
  name      TEXT    NOT NULL,
  category  TEXT    NOT NULL,
  position  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS burgers (
  id          TEXT    PRIMARY KEY,
  person_name TEXT    NOT NULL,
  data        JSONB   NOT NULL,   -- { bun, patty, toppings }
  position    INTEGER NOT NULL DEFAULT 0
);
