import { Pool } from 'pg';

// Reuse a single pool across hot reloads / route invocations.
const globalForPg = globalThis as unknown as { _pgPool?: Pool };

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }
  if (!globalForPg._pgPool) {
    globalForPg._pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // LAN / tailnet Postgres, no TLS.
      ssl: false,
      max: 5,
      idleTimeoutMillis: 30_000,
    });
  }
  return globalForPg._pgPool;
}
