/**
 * Devolve para a Meta o que aconteceu com o lead DEPOIS do formulário.
 *
 * Quem chama é o n8n, quando o status do lead muda no CRM. O n8n poderia falar
 * direto com a Graph API, mas então existiriam duas implementações de "como
 * normalizar e hashear telefone" — e no dia em que elas divergirem por um
 * espaço a Meta simplesmente para de cruzar o `Lead` com o `Purchase`, sem
 * erro nenhum aparecendo. Passando por aqui, é o mesmo código dos dois lados.
 *
 * Sobre "sinalizar quando NÃO converteu": a Meta não aprende com evento
 * negativo em otimização normal — quem aprende com estágio de lead é o
 * objetivo Conversion Leads, e ele só existe para Lead Ads (formulário
 * instantâneo), não para formulário em site. O que o evento de descarte
 * resolve de verdade é (a) medir qualidade por campanha e (b) alimentar um
 * público personalizado de lead ruim para EXCLUIR da segmentação. A
 * otimização em si vem de mandar o evento POSITIVO profundo e otimizar por
 * ele.
 */

import {
  buildFbc,
  buildUserData,
  clampEventTime,
  jsonResponse,
  sendCapiEvents,
} from './_lib/meta.js';

/**
 * Estágio do CRM -> nome do evento na Meta.
 *
 * `Schedule` e `Purchase` são eventos padrão: aparecem prontos no Gerenciador
 * de Eventos e podem virar evento de otimização direto. Os outros são
 * customizados e precisam de uma Conversão Personalizada em cima para serem
 * otimizáveis.
 */
const EVENTO_POR_ESTAGIO: Record<string, string> = {
  qualificado: 'LeadQualificado',
  agendado: 'Schedule',
  compareceu: 'ReuniaoRealizada',
  cliente: 'Purchase',
  desqualificado: 'LeadDesqualificado',
  perdido: 'LeadPerdido',
};

interface CrmPayload {
  /** Um dos dois: `stage` (mapeado acima) ou `eventName` cru. */
  stage?: string;
  eventName?: string;
  whatsapp?: string;
  email?: string;
  name?: string;
  visitorId?: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  /** Unix em segundos. Ausente = agora. Mais de 7 dias atrás é cortado. */
  eventTime?: number;
  value?: number;
  currency?: string;
  eventId?: string;
  clientIp?: string;
  clientUserAgent?: string;
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
      return jsonResponse(405, { ok: false, error: 'method_not_allowed' });
    }

    const secret = process.env.CRM_EVENT_SECRET;
    if (!secret) {
      return jsonResponse(500, {
        ok: false,
        error: 'CRM_EVENT_SECRET ausente',
      });
    }
    if (request.headers.get('x-b2o-secret') !== secret) {
      return jsonResponse(401, { ok: false, error: 'nao_autorizado' });
    }

    let body: CrmPayload;
    try {
      body = (await request.json()) as CrmPayload;
    } catch {
      return jsonResponse(400, { ok: false, error: 'json_invalido' });
    }

    const eventName =
      body.eventName || EVENTO_POR_ESTAGIO[(body.stage || '').toLowerCase()];

    if (!eventName) {
      return jsonResponse(400, {
        ok: false,
        error: 'estagio_desconhecido',
        estagios: Object.keys(EVENTO_POR_ESTAGIO),
      });
    }

    const userData = buildUserData({
      phone: body.whatsapp,
      email: body.email,
      name: body.name,
      visitorId: body.visitorId,
      fbp: body.fbp,
      fbc: buildFbc(body.fbc, body.fbclid),
      clientIp: body.clientIp,
      clientUserAgent: body.clientUserAgent,
      country: 'br',
    });

    // Sem nenhum identificador não existe evento: a Meta não tem em quem casar.
    const temIdentificador = ['ph', 'em', 'external_id', 'fbc', 'fbp'].some(
      (key) => key in userData,
    );
    if (!temIdentificador) {
      return jsonResponse(400, { ok: false, error: 'sem_identificador' });
    }

    const eventTime = clampEventTime(body.eventTime);

    const custom: Record<string, unknown> = {
      // Campos que a doc de CRM pede — dizem à Meta de onde veio o estágio.
      lead_event_source: 'n8n',
      event_source: 'crm',
      estagio: body.stage || eventName,
    };
    if (typeof body.value === 'number') {
      custom.value = body.value;
      custom.currency = body.currency || 'BRL';
    }

    let result;
    try {
      result = await sendCapiEvents([
        {
          event_name: eventName,
          event_time: eventTime,
          event_id: body.eventId,
          action_source: 'system_generated',
          user_data: userData,
          custom_data: custom,
        },
      ]);
    } catch (error) {
      console.error('[api/crm-event] falha ao chamar a Meta', error);
      return jsonResponse(502, { ok: false, error: 'capi_indisponivel' });
    }

    if (!result.ok) {
      console.error('[api/crm-event] CAPI recusou', result.status, result.body);
      return jsonResponse(502, {
        ok: false,
        error: 'capi_recusou',
        status: result.status,
        detalhe: result.body,
      });
    }

    return jsonResponse(200, { ok: true, eventName, eventTime });
  },
};
