import { json } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  return json({ ok: true });
}
