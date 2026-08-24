/**
 * Criação do lead no CRM DataCrazy.
 *
 * O formulário da LP fala com a API do CRM direto daqui, sem n8n no meio. O
 * motivo é simples: cada peça no caminho é uma peça que pode cair, e o lead é
 * a única coisa da página que não pode se perder. Aqui existe um salto só —
 * Vercel → DataCrazy — e o token nunca sai do servidor.
 *
 * Contrato da API (https://docs.datacrazy.io):
 *   POST /api/v1/leads              cria o lead
 *   POST /api/v1/leads/{id}/notes   anota no lead  { note }
 *   POST /api/v1/businesses         cria o negócio no funil { leadId, stageId }
 *
 * Autenticação é Bearer. A chave é gerada em
 * crm.datacrazy.io/config/api e **aparece uma vez só**.
 *
 * ATENÇÃO ao que a API NÃO tem: não existe campo personalizado no corpo do
 * lead. Os identificadores da Meta (`fbp`, `fbc`, `event_id`) — que são o que
 * permite, semanas depois, devolver "virou cliente" ainda atribuído ao anúncio
 * — vão numa **anotação** do lead. É o único lugar que aceita texto livre e
 * volta pela API depois.
 */

const BASE_URL = (
  limpar(process.env.DATACRAZY_API_URL) || 'https://api.g1.datacrazy.io'
).replace(/\/+$/, '');

/** Etapa do funil onde o negócio nasce. Sem ela, cria só o lead. */
const STAGE_ID = limpar(process.env.DATACRAZY_STAGE_ID);

/** Tags aplicadas no lead, IDs separados por vírgula. Opcional. */
const TAG_IDS = limpar(process.env.DATACRAZY_TAG_IDS)
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

export interface CrmLeadInput {
  name: string;
  /** Só dígitos com DDI, como sai de `normalizePhone`. */
  phone: string;
  company: string;
  /** Rótulos legíveis para quem vai atender, não os `value` do formulário. */
  faturamento?: string;
  experienciaAds?: string;
  pageUrl?: string;
  /** utm_source, utm_campaign, gclid… o que veio na URL do anúncio. */
  attribution?: Record<string, string>;
  /** Identificadores da Meta, guardados para a atribuição futura. */
  meta?: {
    eventId?: string;
    visitorId?: string;
    fbp?: string;
    fbc?: string;
  };
}

export interface CrmResult {
  ok: boolean;
  status: number;
  leadId?: string;
  /** Preenchido quando algo deu errado — vai para o log da função. */
  detail?: string;
  /** Passos acessórios que falharam sem derrubar o lead. */
  avisos?: string[];
}

/**
 * Limpa o valor da variável de ambiente antes de virar header.
 *
 * Token colado à mão chega com espaço, quebra de linha ou BOM (U+FEFF, o
 * marcador invisível que o Windows enfia no começo de arquivo de texto) com
 * uma facilidade impressionante. O `fetch` não avisa que o header ficou
 * inválido: ele estoura um TypeError sobre ByteString que não tem nada a ver
 * com o problema. Já custou um deploy aqui.
 */
function limpar(valor: string | undefined): string {
  return (valor || '').replace(/^﻿/, '').trim();
}

function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

/**
 * O `id` do lead pode vir na raiz ou embrulhado em `data`, dependendo do
 * endpoint. Como a resposta do POST não está especificada na doc, a leitura
 * aceita as duas formas em vez de apostar em uma.
 */
function extrairId(payload: unknown): string | undefined {
  if (!payload || typeof payload !== 'object') return undefined;
  const raiz = payload as Record<string, unknown>;
  if (typeof raiz.id === 'string') return raiz.id;
  const data = raiz.data;
  if (data && typeof data === 'object') {
    const dentro = data as Record<string, unknown>;
    if (typeof dentro.id === 'string') return dentro.id;
  }
  return undefined;
}

/**
 * Texto da anotação. As três primeiras linhas são para o vendedor abrir o
 * lead e já saber com quem está falando; o bloco do fim é para a máquina.
 */
function montarAnotacao(input: CrmLeadInput): string {
  const linhas = ['Lead do formulário da landing page (lp-b2optic).'];

  if (input.faturamento) linhas.push(`Faturamento: ${input.faturamento}`);
  if (input.experienciaAds) linhas.push(`Anúncios hoje: ${input.experienciaAds}`);
  if (input.pageUrl) linhas.push(`Página: ${input.pageUrl}`);

  const utms = Object.entries(input.attribution || {}).filter(
    ([, valor]) => valor,
  );
  if (utms.length) {
    linhas.push(
      `Origem: ${utms.map(([chave, valor]) => `${chave}=${valor}`).join(' · ')}`,
    );
  }

  const meta = input.meta || {};
  if (meta.eventId || meta.fbp || meta.fbc || meta.visitorId) {
    linhas.push('');
    linhas.push('--- Rastreamento Meta (não apagar) ---');
    if (meta.eventId) linhas.push(`meta_event_id: ${meta.eventId}`);
    if (meta.visitorId) linhas.push(`meta_visitor_id: ${meta.visitorId}`);
    if (meta.fbp) linhas.push(`meta_fbp: ${meta.fbp}`);
    if (meta.fbc) linhas.push(`meta_fbc: ${meta.fbc}`);
  }

  return linhas.join('\n');
}

/**
 * Cria o lead e, quando configurado, o negócio no funil.
 *
 * Só a criação do lead decide o `ok`. Anotação e negócio são acessórios: se
 * falharem, o lead já existe e o time consegue atender — perder o atendimento
 * porque uma anotação não gravou seria trocar o essencial pelo detalhe. O que
 * falhar sai em `avisos` e vira log.
 */
export async function criarLeadNoCrm(input: CrmLeadInput): Promise<CrmResult> {
  const token = limpar(process.env.DATACRAZY_TOKEN);
  if (!token) {
    return { ok: false, status: 0, detail: 'DATACRAZY_TOKEN ausente' };
  }

  const avisos: string[] = [];

  const corpo: Record<string, unknown> = {
    name: input.name,
    phone: `+${input.phone}`,
    company: input.company,
    source: 'LP B2Optic',
  };

  if (input.pageUrl) {
    corpo.sourceReferral = { sourceUrl: input.pageUrl };
  }
  if (TAG_IDS.length) {
    corpo.tags = [{ id: TAG_IDS }];
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${BASE_URL}/api/v1/leads`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(corpo),
    });
  } catch (erro) {
    return { ok: false, status: 0, detail: `rede: ${String(erro)}` };
  }

  const texto = await resposta.text();

  if (!resposta.ok) {
    /**
     * Telefone repetido é o caso mais comum de 409 aqui: a mesma pessoa
     * preenchendo de novo. Ela já está no CRM, então não é erro para quem
     * está na página — mostrar falha faria a pessoa desistir de um lead que
     * a gente já tem.
     */
    if (resposta.status === 409) {
      return {
        ok: true,
        status: 409,
        detail: 'lead ja existia no CRM',
        avisos,
      };
    }
    return {
      ok: false,
      status: resposta.status,
      detail: texto.slice(0, 500),
    };
  }

  let leadId: string | undefined;
  try {
    leadId = extrairId(JSON.parse(texto));
  } catch {
    leadId = undefined;
  }

  if (!leadId) {
    avisos.push('resposta do CRM sem id do lead — anotação e negócio pulados');
    return { ok: true, status: resposta.status, avisos };
  }

  const acessorios: Promise<void>[] = [];

  acessorios.push(
    fetch(`${BASE_URL}/api/v1/leads/${leadId}/notes`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ note: montarAnotacao(input) }),
    })
      .then((r) => {
        if (!r.ok) avisos.push(`anotação falhou (${r.status})`);
      })
      .catch((erro) => {
        avisos.push(`anotação falhou (${String(erro)})`);
      }),
  );

  if (STAGE_ID) {
    acessorios.push(
      fetch(`${BASE_URL}/api/v1/businesses`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ leadId, stageId: STAGE_ID }),
      })
        .then((r) => {
          if (!r.ok) avisos.push(`negócio no funil falhou (${r.status})`);
        })
        .catch((erro) => {
          avisos.push(`negócio no funil falhou (${String(erro)})`);
        }),
    );
  } else {
    avisos.push('DATACRAZY_STAGE_ID ausente — lead criado fora do funil');
  }

  await Promise.all(acessorios);

  return { ok: true, status: resposta.status, leadId, avisos };
}
