/**
 * Pixel da Meta — carregamento e disparo do lado do navegador.
 *
 * O pixel é METADE do rastreamento. A outra metade é a Conversions API, em
 * `api/lead.ts`. Os dois mandam o mesmo `Lead` com o mesmo `event_id`, e a
 * Meta descarta o segundo que chegar (mesmo `event_name` + mesmo `event_id`
 * dentro de 48h). Parece redundância inútil até o dia em que o visitante usa
 * bloqueador: aí o pixel não sai e só o servidor entrega o evento.
 *
 * Este arquivo nunca lê `.env` em produção sozinho — o ID entra por
 * VITE_META_PIXEL_ID no build.
 */

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

const VISITOR_KEY = 'b2o_vid';
const FBCLID_KEY = 'b2o_fbclid';

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

function lerCookie(nome: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  // Split em vez de regex: os nomes lidos aqui são fixos (_fbp, _fbc), então
  // escapar padrão seria complexidade sem uso.
  for (const parte of document.cookie.split(';')) {
    const [chave, ...resto] = parte.trim().split('=');
    if (chave === nome) return decodeURIComponent(resto.join('='));
  }
  return undefined;
}

/** Cookie do navegador (`fb.1.<ts>.<random>`), criado pelo próprio pixel. */
export function getFbp(): string | undefined {
  return lerCookie('_fbp');
}

/** Cookie do CLIQUE no anúncio (`fb.1.<ts>.<fbclid>`). É o elo com a campanha. */
export function getFbc(): string | undefined {
  return lerCookie('_fbc');
}

/**
 * O `fbclid` chega na URL do anúncio e some assim que a pessoa navega ou
 * compartilha o link. Guardar no localStorage salva o caso de quem entra pelo
 * anúncio, sai e volta direto — e o caso de bloqueador, em que o `_fbc` nunca
 * chega a ser gravado pelo pixel.
 */
export function rememberFbclid(): void {
  if (typeof window === 'undefined') return;
  const fbclid = new URLSearchParams(window.location.search).get('fbclid');
  if (!fbclid) return;
  try {
    window.localStorage.setItem(
      FBCLID_KEY,
      JSON.stringify({ fbclid, ts: Date.now() }),
    );
  } catch {
    /* modo anônimo com storage bloqueado — segue sem lembrar */
  }
}

export function getFbclid(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const daUrl = new URLSearchParams(window.location.search).get('fbclid');
  if (daUrl) return daUrl;
  try {
    const bruto = window.localStorage.getItem(FBCLID_KEY);
    if (!bruto) return undefined;
    const { fbclid, ts } = JSON.parse(bruto) as { fbclid: string; ts: number };
    // A janela de atribuição de clique da Meta é de no máximo 7 dias; guardar
    // um clique mais velho que isso só sujaria o dado.
    if (Date.now() - ts > 7 * 24 * 60 * 60 * 1000) return undefined;
    return fbclid;
  } catch {
    return undefined;
  }
}

/**
 * ID próprio e estável do visitante. É ele que amarra as três pontas: o
 * `Lead` de hoje, a ficha no CRM e o evento de "virou cliente" daqui a três
 * semanas. Vai como `external_id` (hasheado no servidor).
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const existente = window.localStorage.getItem(VISITOR_KEY);
    if (existente) return existente;
    const novo =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    window.localStorage.setItem(VISITOR_KEY, novo);
    return novo;
  } catch {
    // Sem storage não dá para ter ID estável; o resto do match (telefone,
    // fbp, fbc) continua valendo.
    return '';
  }
}

export function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `e-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function carregarSnippet(): void {
  if (window.fbq) return;

  const fbq: Fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, args);
    else (fbq.queue as unknown[]).push(args);
  } as Fbq;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.push = fbq;

  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
}

export function initMetaPixel(): void {
  if (typeof window === 'undefined') return;

  rememberFbclid();
  getVisitorId();

  if (!PIXEL_ID) {
    // Ruidoso de propósito: LP no ar sem pixel é dinheiro de anúncio andando
    // às cegas, e isso não pode passar despercebido em um deploy.
    console.error(
      '[metaPixel] VITE_META_PIXEL_ID não definida — o pixel NÃO foi carregado.',
    );
    return;
  }

  carregarSnippet();
  window.fbq?.('init', PIXEL_ID);
  window.fbq?.('track', 'PageView');
}

export interface PixelUserData {
  /** Cru e normalizado; o próprio pixel aplica SHA-256 antes de enviar. */
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  external_id?: string;
}

/**
 * Dispara o `Lead` no navegador com Advanced Matching.
 *
 * O `init` roda de novo de propósito: os dados da pessoa só existem no
 * submit, e a Meta só processa Advanced Matching manual quando ele vem no
 * `init`. Reinicializar com os dados preenchidos é a forma suportada de
 * enriquecer o evento que vem logo em seguida.
 */
export function trackLead(
  userData: PixelUserData,
  customData: Record<string, unknown>,
  eventId: string,
): void {
  if (typeof window === 'undefined' || !PIXEL_ID || !window.fbq) return;

  const limpo = Object.fromEntries(
    Object.entries(userData).filter(([, v]) => Boolean(v)),
  );

  window.fbq('init', PIXEL_ID, limpo);
  window.fbq('track', 'Lead', customData, { eventID: eventId });
}

/**
 * "Começou a preencher, não terminou."
 *
 * Evento customizado, só no navegador — não vale um caminho servidor porque
 * não é conversão, é sinal. Serve para dois usos concretos: público
 * personalizado de quem abandonou o formulário (o remarketing mais barato que
 * existe numa LP de lead) e denominador para medir a taxa de conclusão real
 * dos três passos.
 */
export function trackFormStart(): void {
  if (typeof window === 'undefined' || !PIXEL_ID || !window.fbq) return;
  window.fbq('trackCustom', 'IniciouFormulario', {
    content_category: 'lp-b2optic',
  });
}
