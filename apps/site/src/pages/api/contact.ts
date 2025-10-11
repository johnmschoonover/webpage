import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const submission = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? '')
  };

  console.warn('Contact submission received (stub handler)', submission);

  return new Response(
    JSON.stringify({ ok: true, message: 'Thanks for reaching out — the team will reply shortly.' }),
    {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
