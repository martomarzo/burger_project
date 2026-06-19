export const dynamic = 'force-dynamic';

// Runtime token injection (playbook pattern): the page loads /config.js and
// auto-connects without manual token entry. Empty token => app stays offline.
export async function GET() {
  const token = process.env.API_TOKEN ?? '';
  const body = `window.BURGER_CONFIG = ${JSON.stringify({ token })};`;
  return new Response(body, {
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
