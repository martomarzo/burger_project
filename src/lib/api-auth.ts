/**
 * Single shared bearer token (playbook pattern). Every /api/* route except
 * /api/health requires `Authorization: Bearer <API_TOKEN>`. The token is also
 * handed to the browser via /config.js, which is acceptable inside the
 * LAN/VPN trust boundary.
 *
 * Returns null when the request is authorized, or a Response to short-circuit.
 */
export function requireAuth(req: Request): Response | null {
  const expected = process.env.API_TOKEN;
  if (!expected) {
    // No token configured -> the app is running offline-only. Refuse API use.
    return json({ error: 'API not configured' }, 503);
  }
  const header = req.headers.get('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (token !== expected) {
    return json({ error: 'unauthorized' }, 401);
  }
  return null;
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
