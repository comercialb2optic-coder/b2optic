/**
 * Ponto ÚNICO de envio de lead.
 *
 * O componente do formulário não conhece a URL de destino nem o formato do
 * payload — só chama `submitLead(dados)`. Trocar o destino (n8n, CRM, outro
 * webhook) é mexer só aqui.
 *
 * Configuração: defina VITE_LEAD_WEBHOOK_URL em `.env.local`.
 *   VITE_LEAD_WEBHOOK_URL=https://seu-n8n.exemplo/webhook/b2optic-lead
 */

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

/** Parâmetros de campanha da URL — o tráfego vem de Meta Ads, então saber de
 *  qual anúncio veio o lead vale tanto quanto o lead. */
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

/** Só os dígitos, com DDI do Brasil — formato que CRM e WhatsApp esperam. */
function normalizeWhatsapp(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('55')) return digits;
  return `55${digits}`;
}

export async function submitLead(input: LeadInput): Promise<void> {
  const url = import.meta.env.VITE_LEAD_WEBHOOK_URL as string | undefined;

  // Sem destino configurado, falha de forma RUIDOSA. O pior cenário possível
  // é a tela de sucesso aparecer e o lead não existir em lugar nenhum.
  if (!url) {
    console.error(
      '[submitLead] VITE_LEAD_WEBHOOK_URL não está definida. ' +
        'O lead NÃO foi enviado. Defina a variável em .env.local.',
      input,
    );
    throw new LeadSubmitError('Webhook de leads não configurado');
  }

  const payload = {
    ...input,
    whatsapp: normalizeWhatsapp(input.whatsapp),
    origem: 'lp-b2optic',
    enviadoEm: new Date().toISOString(),
    pagina: typeof window !== 'undefined' ? window.location.href : '',
    ...captureAttribution(),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new LeadSubmitError(
        `Webhook respondeu ${response.status} ${response.statusText}`,
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
