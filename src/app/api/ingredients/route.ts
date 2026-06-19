import type { Ingredient } from '@/lib/types';
import { getPool } from '@/lib/db';
import { requireAuth, json } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  const pool = getPool();
  const { rows } = await pool.query(
    'SELECT id, name, category FROM ingredients ORDER BY position, id'
  );
  return json(rows as Ingredient[]);
}

export async function PUT(req: Request) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  let items: Ingredient[];
  try {
    items = await req.json();
    if (!Array.isArray(items)) throw new Error('expected an array');
  } catch {
    return json({ error: 'invalid body' }, 400);
  }

  // Whole-state save: delete + reinsert in one transaction.
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM ingredients');
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      await client.query(
        'INSERT INTO ingredients (id, name, category, position) VALUES ($1, $2, $3, $4)',
        [String(it.id), it.name, it.category, i]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
  return json({ ok: true, count: items.length });
}
