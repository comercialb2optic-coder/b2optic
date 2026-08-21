/** Sonda mínima, sem import nenhum: separa "a função quebrou" de "a rota não
 *  existe" quando algo der errado nas outras. Pode ser removida depois. */
export default {
  async fetch(): Promise<Response> {
    return new Response(
      JSON.stringify({ ok: true, runtime: process.version }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  },
};
