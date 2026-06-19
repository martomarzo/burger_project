import type { Burger } from '@/lib/types';
import { getPool } from '@/lib/db';
import { requireAuth, json } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  const pool = getPool();
  const { rows } = await pool.query(
    'SELECT id, person_name, data FROM burgers ORDER BY position, id'
  );
  const burgers: Burger[] = rows.map((r) => ({
    id: r.id,
    personName: r.person_name,
    bun: r.data.bun,
    patty: r.data.patty,
    toppings: r.data.toppings ?? [],
  }));
  return json(burgers);
}

export async function PUT(req: Request) {
  const unauthorized = requireAuth(req);
  if (unauthorized) return unauthorized;

  let items: Burger[];
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
    await client.query('DELETE FROM burgers');
    for (let i = 0; i < items.length; i++) {
      const b = items[i];
      const data = { bun: b.bun, patty: b.patty, toppings: b.toppings ?? [] };
      await client.query(
        'INSERT INTO burgers (id, person_name, data, position) VALUES ($1, $2, $3, $4)',
        [String(b.id), b.personName, JSON.stringify(data), i]
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
