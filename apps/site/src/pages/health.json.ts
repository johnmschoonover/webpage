export const GET = () => {
  return new Response(
    JSON.stringify({ status: 'ok', version: '0.0.1' }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
