/**
 * Recebe o formulário da LP, cria o lead no CRM e avisa a Meta.
 *
 * O navegador manda para cá em vez de falar direto com o CRM por três motivos
 * concretos:
 *
 * 1. IP e user agent reais. A Meta usa os dois para casar o lead com a conta
 *    do Facebook da pessoa; do lado do cliente eles não existem.
 * 2. O evento chega mesmo com bloqueador de anúncio. O pixel do navegador é a
 *    primeira coisa que cai; esta chamada é para o próprio domínio da LP.
 * 3. O token do CRM e o da Meta ficam no servidor. Chave de API dentro do JS
 *    público da página é chave vazada.
 *
 * O `Lead` sai em dois caminhos — pixel no navegador e Conversions API aqui —
 * carregando o MESMO `event_id`. É assim que a Meta deduplica: mesmo
 * `event_name` + mesmo `event_id` dentro de 48h contam como um evento só, e a
 * gente ganha a redundância sem inflar a conversão.
 */

import { criarLeadNoCrm } from './_lib/datacrazy.js';
import {
  buildFbc,
  buildUserData,
  clampEventTime,
  clientIpFrom,
  jsonResponse,
  normalizePhone,
  sendCapiEvents,
} from './_lib/meta.js';

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

/**
 * Os mesmos rótulos que a pessoa leu na tela, para a anotação do CRM.
 *
 * Espelham `REVENUE_OPTIONS` e `ADS_OPTIONS` de `client/src/content.ts`. São
 * duplicados de propósito: a função roda no servidor e importar o conteúdo do
 * bundle do navegador só para ler quatro strings arrastaria o alias do Vite
 * para dentro do runtime da Vercel. Se mudar um rótulo lá, mude aqui — o que
 * quebra é a leitura de quem atende, não o envio.
 */
const ROTULO_FATURAMENTO: Record<string, string> = {
  'ate-30k': 'Até R$ 30 mil',
  '30-100k': 'R$ 30 a 100 mil',
  '100-250k': 'R$ 100 a 250 mil',
  'acima-250k': 'Acima de R$ 250 mil',
};

const ROTULO_ADS: Record<string, string> = {
  agencia: 'Já anuncio com agência',
  'conta-propria': 'Já tentei por conta própria',
  nunca: 'Nunca anunciei',
  insatisfeito: 'Anuncio, mas estou insatisfeito',
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
     * O CRM é a fonte de verdade do lead. Se a Meta falhar a gente perde
     * otimização; se o CRM falhar a gente perde o cliente — por isso só a
     * resposta do CRM decide o status devolvido para a página.
     */
    const crmPromise = criarLeadNoCrm({
      name,
      phone: normalizePhone(whatsapp) || whatsapp.replace(/\D/g, ''),
      company: opticsName,
      faturamento: ROTULO_FATURAMENTO[body.revenue || ''] || body.revenue,
      experienciaAds: ROTULO_ADS[body.adsExperience || ''] || body.adsExperience,
      pageUrl: body.pageUrl,
      attribution: body.attribution,
      meta: {
        eventId,
        visitorId: body.visitorId,
        fbp: body.fbp,
        fbc: buildFbc(body.fbc, body.fbclid),
      },
    }).catch((error: unknown) => ({
      ok: false as const,
      status: 0,
      detail: String(error),
      avisos: [] as string[],
    }));

    const [capi, crm] = await Promise.all([capiPromise, crmPromise]);

    if (!capi.ok) {
      console.error('[api/lead] CAPI falhou', capi.status, capi.body);
    }

    if (crm.avisos?.length) {
      console.warn('[api/lead] CRM com avisos', crm.avisos.join(' | '));
    }

    if (!crm.ok) {
      /**
       * O lead não entrou no CRM. O log abaixo é a última cópia que existe
       * dele — sem isso, a pessoa preencheu e o dado sumiu para sempre.
       */
      console.error(
        '[api/lead] CRM falhou',
        crm.status,
        crm.detail,
        JSON.stringify({ name, whatsapp, opticsName, revenue: body.revenue }),
      );
      return jsonResponse(502, { ok: false, error: 'crm_indisponivel' });
    }

    return jsonResponse(200, { ok: true, eventId, capi: capi.ok });
  },
};
