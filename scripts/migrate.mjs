// Applies db/schema.sql against DATABASE_URL. Idempotent. Run: npm run migrate
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, '..', 'db', 'schema.sql');

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const sql = readFileSync(schemaPath, 'utf8');
const client = new pg.Client({ connectionString: DATABASE_URL, ssl: false });

try {
  await client.connect();
  await client.query(sql);
  console.log('[migrate] schema applied');
} catch (err) {
  console.error('[migrate] failed:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
