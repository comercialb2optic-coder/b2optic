/**
 * Núcleo do envio para a Conversions API da Meta.
 *
 * Tudo que normaliza e faz hash de dado de pessoa mora AQUI, em um lugar só.
 * O motivo é match: a Meta só cruza o lead com o usuário dela se o hash que a
 * gente manda no `Lead` for idêntico ao que a gente manda semanas depois no
 * evento de "virou cliente". Duas implementações levemente diferentes de
 * "normalizar telefone" quebram esse cruzamento sem dar nenhum erro visível —
 * os eventos entram, a atribuição some.
 *
 * Regras de normalização conforme a doc oficial:
 * https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters/
 */

import { createHash } from 'node:crypto';

/** Versão da Graph API. v26.0 é a mais nova (jul/2026); v25.0 vive até 2028. */
export const GRAPH_VERSION = process.env.META_GRAPH_VERSION || 'v25.0';

export function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

/** Já veio hasheado? Não hasheia de novo — hash duplo não casa com nada. */
function hashOnce(value: string): string {
  return /^[a-f0-9]{64}$/i.test(value) ? value.toLowerCase() : sha256(value);
}

/**
 * Telefone: só dígitos, com DDI, sem `+` e sem zero à esquerda.
 * Números brasileiros chegam do formulário sem DDI; 55 entra aqui.
 */
export function normalizePhone(raw: string): string | null {
  let digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return null;
  digits = digits.replace(/^0+/, '');
  if (!digits.startsWith('55')) digits = `55${digits}`;
  // 55 + DDD(2) + 8 ou 9 dígitos.
  if (digits.length < 12 || digits.length > 13) return null;
  return digits;
}

export function normalizeEmail(raw: string): string | null {
  const email = String(raw || '')
    .trim()
    .toLowerCase();
  return email.includes('@') ? email : null;
}

/**
 * Nome: minúsculo, sem pontuação e sem dígitos. Acento FICA — a doc manda
 * enviar caractere especial em UTF-8, não transliterar.
 */
function normalizeNamePart(raw: string): string | null {
  const part = String(raw || '')
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, '')
    .trim();
  return part || null;
}

/** O formulário tem um campo de nome só; a Meta quer primeiro e último. */
export function splitName(full: string): {
  fn: string | null;
  ln: string | null;
} {
  const parts = String(full || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return { fn: null, ln: null };
  if (parts.length === 1) return { fn: normalizeNamePart(parts[0]), ln: null };
  return {
    fn: normalizeNamePart(parts[0]),
    ln: normalizeNamePart(parts[parts.length - 1]),
  };
}

/**
 * `_fbc` é o que liga o lead ao CLIQUE no anúncio — sem ele a Meta sabe que
 * houve conversão mas não de qual anúncio veio. O cookie só existe se o pixel
 * carregou; quando bloqueiam o pixel, dá para remontar o valor a partir do
 * `fbclid` que veio na URL, que é o mesmo formato que o pixel gravaria.
 */
export function buildFbc(
  cookieFbc: string | undefined,
  fbclid: string | undefined,
  clickTimeMs?: number,
): string | undefined {
  if (cookieFbc) return cookieFbc;
  if (!fbclid) return undefined;
  return `fb.1.${clickTimeMs || Date.now()}.${fbclid}`;
}

export interface UserDataInput {
  phone?: string | null;
  email?: string | null;
  name?: string | null;
  /** ID próprio e estável do visitante — o elo entre site, CRM e Meta. */
  visitorId?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  clientIp?: string | null;
  clientUserAgent?: string | null;
  country?: string | null;
}

export type CapiUserData = Record<string, string | string[]>;

/**
 * Monta o `user_data`. Campos identificáveis vão em SHA-256; `fbp`, `fbc`, IP
 * e user agent vão crus, que é como a doc pede.
 */
export function buildUserData(input: UserDataInput): CapiUserData {
  const out: CapiUserData = {};

  const phone = input.phone ? normalizePhone(input.phone) : null;
  if (phone) out.ph = [hashOnce(phone)];

  const email = input.email ? normalizeEmail(input.email) : null;
  if (email) out.em = [hashOnce(email)];

  if (input.name) {
    const { fn, ln } = splitName(input.name);
    if (fn) out.fn = [hashOnce(fn)];
    if (ln) out.ln = [hashOnce(ln)];
  }

  if (input.visitorId) out.external_id = [hashOnce(String(input.visitorId))];
  if (input.country) out.country = [hashOnce(input.country.toLowerCase())];

  if (input.fbp) out.fbp = input.fbp;
  if (input.fbc) out.fbc = input.fbc;
  if (input.clientIp) out.client_ip_address = input.clientIp;
  if (input.clientUserAgent) out.client_user_agent = input.clientUserAgent;

  return out;
}

export interface CapiEvent {
  event_name: string;
  event_time: number;
  event_id?: string;
  event_source_url?: string;
  action_source: string;
  user_data: CapiUserData;
  custom_data?: Record<string, unknown>;
}

export interface CapiResult {
  ok: boolean;
  status: number;
  body: unknown;
}

/**
 * `event_time` só pode ser até 7 dias no passado — a Meta rejeita o lote
 * inteiro se um evento estiver fora disso, então corta aqui.
 */
export function clampEventTime(seconds?: number): number {
  const now = Math.floor(Date.now() / 1000);
  if (!seconds || !Number.isFinite(seconds)) return now;
  const oldest = now - 7 * 24 * 60 * 60;
  return Math.min(now, Math.max(oldest, Math.floor(seconds)));
}

export async function sendCapiEvents(events: CapiEvent[]): Promise<CapiResult> {
  const pixelId = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !token) {
    return {
      ok: false,
      status: 0,
      body: 'META_PIXEL_ID ou META_CAPI_ACCESS_TOKEN não configurados',
    };
  }

  const payload: Record<string, unknown> = {
    data: events,
    access_token: token,
  };
  // Só em teste: faz os eventos aparecerem na aba "Testar eventos" e NÃO
  // contarem como conversão real. Nunca deixar setado em produção.
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = await response.text().catch(() => '');
  }

  return { ok: response.ok, status: response.status, body };
}

/** O IP real do visitante — sem ele o match cai bastante. */
export function clientIpFrom(request: Request): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') || undefined;
}

export function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
