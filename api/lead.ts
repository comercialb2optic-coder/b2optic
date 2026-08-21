/**
 * Recebe o formulário da LP, avisa a Meta e entrega o lead no n8n.
 *
 * O navegador manda para cá em vez de mandar direto para o n8n por três
 * motivos concretos:
 *
 * 1. IP e user agent reais. A Meta usa os dois para casar o lead com a conta
 *    do Facebook da pessoa; do lado do cliente eles não existem.
 * 2. O evento chega mesmo com bloqueador de anúncio. O pixel do navegador é a
 *    primeira coisa que cai; esta chamada é para o próprio domínio da LP.
 * 3. A URL do webhook do n8n e o token da Meta param de viajar no bundle. Hoje
 *    a URL do n8n está literalmente dentro do JS público da página.
 *
 * O `Lead` sai em dois caminhos — pixel no navegador e Conversions API aqui —
 * carregando o MESMO `event_id`. É assim que a Meta deduplica: mesmo
 * `event_name` + mesmo `event_id` dentro de 48h contam como um evento só, e a
 * gente ganha a redundância sem inflar a conversão.
 */

import {
  buildFbc,
  buildUserData,
  clampEventTime,
  clientIpFrom,
  jsonResponse,
  sendCapiEvents,
} from './_lib/meta';

/**
 * Peso relativo de cada faixa de faturamento, em BRL.
 *
 * NÃO é receita prevista — é um placar para a Meta saber que uma ótica de
 * R$ 250 mil vale mais esforço que uma de R$ 20 mil. Serve para otimização por
 * valor e para separar lead bom de lead ruim no relatório. Ajustar quando
 * houver histórico real de fechamento por faixa.
 */
const VALOR_POR_FATURAMENTO: Record<string, number> = {
  'ate-30k': 20,
  '30-100k': 60,
  '100-250k': 120,
  'acima-250k': 200,
};

interface LeadPayload {
  name?: string;
  whatsapp?: string;
  opticsName?: string;
  revenue?: string;
  adsExperience?: string;
  eventId?: string;
  visitorId?: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  pageUrl?: string;
  attribution?: Record<string, string>;
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return jsonResponse(405, { ok: false, error: 'method_not_allowed' });
    }

    let body: LeadPayload;
    try {
      body = (await request.json()) as LeadPayload;
    } catch {
      return jsonResponse(400, { ok: false, error: 'json_invalido' });
    }

    const name = (body.name || '').trim();
    const whatsapp = (body.whatsapp || '').trim();
    const opticsName = (body.opticsName || '').trim();

    if (name.length < 2 || whatsapp.length < 8 || opticsName.length < 2) {
      return jsonResponse(400, { ok: false, error: 'campos_obrigatorios' });
    }

    const eventTime = clampEventTime();
    const eventId =
      body.eventId ||
      `lead-${eventTime}-${Math.random().toString(36).slice(2, 10)}`;

    const userData = buildUserData({
      phone: whatsapp,
      name,
      visitorId: body.visitorId,
      fbp: body.fbp,
      fbc: buildFbc(body.fbc, body.fbclid),
      clientIp: clientIpFrom(request),
      clientUserAgent: request.headers.get('user-agent'),
      country: 'br',
    });

    const valor = VALOR_POR_FATURAMENTO[body.revenue || ''] ?? 0;

    /**
     * `custom_data` carrega só o que qualifica o lead. Nome da ótica, nome da
     * pessoa e telefone em claro NÃO entram aqui — dado de pessoa vai hasheado
     * em `user_data` e mais nada.
     */
    const capiPromise = sendCapiEvents([
      {
        event_name: 'Lead',
        event_time: eventTime,
        event_id: eventId,
        event_source_url: body.pageUrl,
        action_source: 'website',
        user_data: userData,
        custom_data: {
          currency: 'BRL',
          value: valor,
          content_name: 'Diagnostico gratuito',
          content_category: 'lp-b2optic',
          faturamento: body.revenue,
          experiencia_ads: body.adsExperience,
        },
      },
    ]).catch((error: unknown) => ({
      ok: false,
      status: 0,
      body: String(error),
    }));

    /**
     * O n8n é a fonte de verdade do lead. Se a Meta falhar a gente perde
     * otimização; se o n8n falhar a gente perde o cliente — por isso só a
     * resposta do n8n decide o status devolvido para a página.
     */
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    const crmPromise = (async () => {
      if (!webhookUrl) {
        return { ok: false, status: 0, detail: 'LEAD_WEBHOOK_URL ausente' };
      }
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          whatsapp,
          opticsName,
          revenue: body.revenue,
          adsExperience: body.adsExperience,
          origem: 'lp-b2optic',
          enviadoEm: new Date().toISOString(),
          pagina: body.pageUrl,
          // Guardar isto no CRM é o que torna possível, semanas depois,
          // devolver "virou cliente" para a Meta ainda atribuído ao anúncio.
          meta: {
            eventId,
            visitorId: body.visitorId,
            fbp: body.fbp,
            fbc: buildFbc(body.fbc, body.fbclid),
            fbclid: body.fbclid,
            eventTime,
          },
          ...(body.attribution || {}),
        }),
      });
      return { ok: response.ok, status: response.status, detail: '' };
    })().catch((error: unknown) => ({
      ok: false,
      status: 0,
      detail: String(error),
    }));

    const [capi, crm] = await Promise.all([capiPromise, crmPromise]);

    if (!capi.ok) {
      console.error('[api/lead] CAPI falhou', capi.status, capi.body);
    }

    if (!crm.ok) {
      console.error('[api/lead] webhook do n8n falhou', crm.status, crm.detail);
      return jsonResponse(502, { ok: false, error: 'crm_indisponivel' });
    }

    return jsonResponse(200, { ok: true, eventId, capi: capi.ok });
  },
};
