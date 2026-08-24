/**
 * Ponto ÚNICO de envio de lead.
 *
 * O formulário não sabe para onde o lead vai nem o que a Meta precisa saber —
 * só chama `submitLead(dados)`.
 *
 * O caminho é: navegador -> `/api/lead` (função na Vercel, mesmo domínio) ->
 * de lá saem em paralelo o evento para a Conversions API e o lead para o CRM.
 * Antes daqui ir para a rede, o pixel dispara o mesmo `Lead` no navegador com
 * o MESMO `event_id`, que é como a Meta deduplica os dois caminhos.
 *
 * Por que não postar direto no CRM: do lado do cliente não existe
 * IP nem user agent reais (os dois pesam no match da Meta), o bloqueador de
 * anúncio derruba a chamada, e a chave da API do CRM não pode viver no bundle.
 *
 * Em `pnpm dev` a rota `/api/lead` não existe — Vite não roda função da
 * Vercel. Para testar o fluxo inteiro localmente, use `vercel dev`.
 */

import {
  getFbc,
  getFbclid,
  getFbp,
  getVisitorId,
  newEventId,
  trackLead,
} from '@/lib/metaPixel';

export interface LeadInput {
  name: string;
  whatsapp: string;
  opticsName: string;
  revenue: string;
  adsExperience: string;
}

export class LeadSubmitError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'LeadSubmitError';
  }
}

const TIMEOUT_MS = 15000;
const ENDPOINT =
  (import.meta.env.VITE_LEAD_ENDPOINT as string | undefined) || '/api/lead';

/**
 * Peso relativo por faixa de faturamento. Espelha `VALOR_POR_FATURAMENTO` em
 * `api/lead.ts` — os dois lados mandam o mesmo `value` porque é o mesmo
 * evento; divergir aqui faria o número do relatório depender de qual dos dois
 * caminhos chegou primeiro.
 */
const VALOR_POR_FATURAMENTO: Record<string, number> = {
  'ate-30k': 20,
  '30-100k': 60,
  '100-250k': 120,
  'acima-250k': 200,
};

/** Parâmetros de campanha da URL — saber de qual anúncio veio o lead vale
 *  tanto quanto o lead. */
function captureAttribution(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const keys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'fbclid',
    'gclid',
  ];

  const out: Record<string, string> = {};
  for (const key of keys) {
    const value = params.get(key);
    if (value) out[key] = value;
  }
  return out;
}

/** Só os dígitos, com DDI do Brasil — formato que CRM, WhatsApp e Meta esperam. */
function normalizeWhatsapp(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('55')) return digits;
  return `55${digits}`;
}

/** Minúsculo e sem pontuação, que é como a Meta normaliza antes do hash. */
function normalizeNamePart(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, '')
    .trim();
}

export async function submitLead(input: LeadInput): Promise<void> {
  const eventId = newEventId();
  const whatsapp = normalizeWhatsapp(input.whatsapp);
  const partes = input.name.trim().split(/\s+/).filter(Boolean);

  const customData = {
    currency: 'BRL',
    value: VALOR_POR_FATURAMENTO[input.revenue] ?? 0,
    content_name: 'Diagnostico gratuito',
    content_category: 'lp-b2optic',
    faturamento: input.revenue,
    experiencia_ads: input.adsExperience,
  };

  // Dispara antes do await: se a pessoa fechar a aba durante o envio, o
  // evento do navegador já saiu.
  trackLead(
    {
      ph: whatsapp,
      fn: normalizeNamePart(partes[0] || ''),
      ln:
        partes.length > 1 ? normalizeNamePart(partes[partes.length - 1]!) : '',
      external_id: getVisitorId(),
    },
    customData,
    eventId,
  );

  const payload = {
    ...input,
    whatsapp,
    eventId,
    visitorId: getVisitorId(),
    fbp: getFbp(),
    fbc: getFbc(),
    fbclid: getFbclid(),
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    attribution: captureAttribution(),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      // Nunca mostrar sucesso quando o envio falhou — a pessoa precisa poder
      // tentar de novo, e a gente precisa não perder o lead.
      throw new LeadSubmitError(
        `/api/lead respondeu ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    if (error instanceof LeadSubmitError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new LeadSubmitError('Tempo esgotado ao enviar o lead', error);
    }
    throw new LeadSubmitError('Falha de rede ao enviar o lead', error);
  } finally {
    clearTimeout(timeout);
  }
}
