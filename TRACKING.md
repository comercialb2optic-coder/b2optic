# Rastreamento da LP → Meta

Como o lead do formulário vira sinal de otimização dentro do Meta Ads.

---

## O problema que isso resolve

Anunciar mandando tráfego para a LP sem devolver nada para a Meta faz o
algoritmo otimizar no escuro: ele entrega para quem clica, não para quem vira
cliente. O que corrige isso é fechar o ciclo — contar para a Meta que o
formulário foi enviado e, depois, o que aconteceu com aquele lead.

---

## O caminho do dado

```
  Visitante na LP
        │
        │  pixel carrega, grava _fbp e _fbc (o _fbc é o elo com o CLIQUE no anúncio)
        ▼
  Preenche o formulário
        │
        ├──► pixel do navegador: Lead  ─────────┐
        │                                        │  mesmo event_id
        └──► POST /api/lead (mesmo domínio)      │  → a Meta conta UM evento
                   │                             │
                   ├──► Conversions API: Lead ───┘
                   │
                   └──► DataCrazy (API direta)
                          ├── POST /leads              lead
                          ├── POST /leads/{id}/notes   anotação com fbp, fbc,
                          │                            visitorId e eventId
                          └── POST /businesses         negócio na etapa
                                     │                 "Entrada de Lead"
                        etiqueta/etapa muda no CRM
                                     │
                                     ▼
                       automação do CRM ──► POST /api/crm-event
                                     │
                                     ▼
                        Conversions API: LeadQualificado,
                        Schedule, Purchase, LeadDesqualificado
```

### Por que o formulário passa pela Vercel em vez de ir direto ao CRM

1. **IP e user agent reais.** A Meta usa os dois para casar o lead com a conta
   do Facebook da pessoa. No navegador eles não existem.
2. **Bloqueador de anúncio.** O pixel é a primeira coisa que cai. A chamada
   para `/api/lead` é para o próprio domínio da LP e passa.
3. **Segredo fora do bundle.** A chave da API do CRM e o token da Meta ficam no
   servidor. Chave de API dentro do JS público da página é chave vazada.

### Por que não tem n8n no meio

Tinha, no desenho anterior. Saiu em 23/08/2026: cada peça no caminho é uma
peça que pode cair, e o lead é a única coisa da página que não pode se perder.
Hoje é um salto só — Vercel → DataCrazy — e quem decide se a página mostra
sucesso ou erro é a resposta do próprio CRM.

### Por que os eventos do CRM também passam pela Vercel

Porque `api/_lib/meta.ts` é a **única** implementação de "normalizar e hashear
telefone". Se o n8n falasse direto com a Graph API existiriam duas — e no dia
em que elas divergirem por um espaço em branco a Meta silenciosamente para de
cruzar o `Lead` com o `Purchase`. Nenhum erro aparece; a atribuição só some.

---

## Variáveis de ambiente

Ver `.env.example`. Resumo do que precisa existir na Vercel:

| Variável | Onde vive | Para que serve |
|---|---|---|
| `VITE_META_PIXEL_ID` | navegador | carrega o pixel |
| `META_PIXEL_ID` | servidor | destino dos eventos da CAPI |
| `META_CAPI_ACCESS_TOKEN` | servidor | **segredo** — autentica na Graph API |
| `DATACRAZY_TOKEN` | servidor | **segredo** — chave da API do CRM |
| `DATACRAZY_STAGE_ID` | servidor | etapa do funil onde o negócio nasce |
| `CRM_EVENT_SECRET` | servidor | senha do header `x-b2o-secret` |
| `META_GRAPH_VERSION` | servidor | opcional, vazio = `v25.0` |
| `META_TEST_EVENT_CODE` | servidor | **só em teste**, ver abaixo |

> **Cuidado com `Sensitive` na Vercel em variável `VITE_`.** Variável `VITE_` é
> lida no *build*; variável marcada como Sensitive não volta legível. Se o build
> não enxergar o valor, o Vite compila `undefined` e elimina o código que
> dependia dela — sem erro nenhum no deploy. Foi exatamente isso que matou o
> formulário em produção antes desta mudança. `VITE_META_PIXEL_ID` deve ser
> **comum**, não Sensitive (e não é segredo: o ID do pixel aparece no código de
> qualquer site que anuncia).

---

## Passo a passo para ligar

### 1. Gerenciador de Eventos

1. Fontes de dados → o dataset da B2Optic → copiar o **ID do dataset**.
2. Configurações → Conversions API → **Gerar token de acesso**. Guardar bem:
   com ele dá para enviar evento em nome do dataset.

### 2. Vercel

```bash
vercel env add VITE_META_PIXEL_ID production   # comum, NAO sensitive
vercel env add META_PIXEL_ID production
vercel env add META_CAPI_ACCESS_TOKEN production --sensitive
vercel env add DATACRAZY_TOKEN production --sensitive
vercel env add DATACRAZY_STAGE_ID production
vercel env add CRM_EVENT_SECRET production --sensitive
```

> **Cuidado com BOM.** Token colado de arquivo salvo no Windows chega com o
> caractere invisível U+FEFF na frente. O `fetch` não diz "header inválido" —
> ele estoura `Cannot convert argument to a ByteString`, que não parece ter
> nada a ver. Já derrubou um deploy aqui. `api/_lib/datacrazy.ts` limpa isso
> na leitura, mas evite gravar sujo.

Depois, redeploy — `VITE_META_PIXEL_ID` só entra no bundle em um build novo.

### 3. DataCrazy — chave de API e etapa do funil

1. `crm.datacrazy.io` → **Configurações > Chaves de API** → *Gerar nova chave*.
   Ela **aparece uma vez só**: copie na hora.
2. Descubra a etapa onde o lead deve nascer:

```bash
curl -H "Authorization: Bearer $DATACRAZY_TOKEN" \
  https://api.g1.datacrazy.io/api/v1/pipelines
curl -H "Authorization: Bearer $DATACRAZY_TOKEN" \
  https://api.g1.datacrazy.io/api/v1/pipelines/<id-do-funil>/stages
```

Hoje: funil **Aquisição de Clientes** (`ad62cd56-…91ad`), etapa
**Entrada de Lead** (`99f01c7a-…0e5f`).

O que `api/_lib/datacrazy.ts` faz a cada envio:

| Chamada | Para quê |
|---|---|
| `POST /api/v1/leads` | cria o lead (`name`, `phone`, `company`, `source`) |
| `POST /api/v1/leads/{id}/notes` | anotação com faturamento, UTMs e IDs da Meta |
| `POST /api/v1/businesses` | põe o negócio na etapa do funil |

**Só a criação do lead decide o status devolvido para a página.** Anotação e
negócio são acessórios: se falharem, o lead já existe e o time atende. O que
falha vira log com `console.warn`.

**A anotação é o coração do loop.** A API do CRM não tem campo personalizado no
corpo do lead, então `meta_fbp`, `meta_fbc`, `meta_visitor_id` e
`meta_event_id` moram no texto da anotação — que volta pela API em
`GET /api/v1/leads/{id}/notes` (o campo se chama `history` na leitura e `note`
na escrita). Sem o `fbc` guardado, o evento de "virou cliente" três semanas
depois chega na Meta sem saber de qual anúncio veio — vira número solto em vez
de otimização.

Se o CRM não responder 2xx, a página mostra erro para o visitante, e é assim
que deve ser: melhor a pessoa tentar de novo do que a gente perder o lead
achando que deu certo. Quando isso acontece, o lead inteiro sai no log de erro
da função — é a última cópia que existe dele.

### 4. Fluxo de volta (etapa do funil → Meta)

Gatilho: automação do DataCrazy que dispara quando o negócio muda de etapa. Os
identificadores da Meta estão na anotação do lead, então busque as anotações
antes (`GET /api/v1/leads/{id}/notes`) e leia `meta_fbp` / `meta_fbc` do campo
`history`.

```
POST https://<dominio-da-lp>/api/crm-event
x-b2o-secret: <CRM_EVENT_SECRET>

{
  "stage": "qualificado",
  "whatsapp": "5547999999999",
  "name": "...",
  "visitorId": "<meta_visitor_id do CRM>",
  "fbp": "<meta_fbp do CRM>",
  "fbc": "<meta_fbc do CRM>"
}
```

Estágios aceitos (`api/crm-event.ts`) e a etapa do funil **Aquisição de
Clientes** que dispara cada um:

| Etapa no DataCrazy | `stage` | Evento na Meta | Tipo |
|---|---|---|---|
| Qualificado | `qualificado` | `LeadQualificado` | customizado |
| Reunião Agendada | `agendado` | `Schedule` | padrão |
| Reunião Executada | `compareceu` | `ReuniaoRealizada` | customizado |
| Ganho | `cliente` | `Purchase` | padrão (aceita `value`) |
| Desqualificado | `desqualificado` | `LeadDesqualificado` | customizado |
| Perdido | `perdido` | `LeadPerdido` | customizado |

Para `cliente`, mandar junto `"value": 4800, "currency": "BRL"` com o valor
real do contrato — é o que liga otimização por valor e ROAS de verdade.

Nomes de estágio novos: editar `EVENTO_POR_ESTAGIO` em `api/crm-event.ts`.

### 5. Conversões Personalizadas

Evento customizado não vira evento de otimização sozinho. No Gerenciador de
Eventos → Conversões personalizadas → criar uma em cima de `LeadQualificado`.
Aí ela aparece como opção de otimização no conjunto de anúncios.

---

## Testando antes de gastar mídia

1. Gerenciador de Eventos → o dataset → **Testar eventos** → copiar o código.
2. `vercel env add META_TEST_EVENT_CODE preview` e usar um deploy de preview.
3. Preencher o formulário. Devem aparecer:
   - `Lead` do **navegador** e `Lead` do **servidor**, marcados como
     **desduplicados** (é o certo — significa que o `event_id` bateu);
   - `IniciouFormulario` ao passar do passo 1.
4. Disparar um `/api/crm-event` de teste e ver o estágio aparecer.
5. **Apagar `META_TEST_EVENT_CODE`.** Com ele setado nada conta como conversão
   real.

Depois de no ar, acompanhar em Gerenciador de Eventos → **Qualidade da
correspondência de eventos (EMQ)**. Abaixo de 6 vale investigar; o que mais
puxa a nota para cima é telefone e `fbc` presentes.

---

## O que este desenho NÃO faz

**Otimizar a partir do lead ruim.** A Meta não aprende com evento negativo em
campanha de site. O objetivo que aprende com estágio de lead é o *Conversion
Leads*, e ele só existe para Lead Ads (formulário instantâneo), não para
formulário em site — está na
[doc da CAPI para CRM](https://developers.facebook.com/docs/marketing-api/conversions-api/conversion-leads-integration/payload-specification/).

O `LeadDesqualificado` serve para outras duas coisas, que valem: medir
qualidade por campanha e alimentar um público personalizado de lead ruim para
**excluir** da segmentação. A otimização em si vem de mandar o evento positivo
profundo e otimizar por ele.

**Ciclo de venda longo.** `event_time` só aceita até 7 dias no passado, e a
janela de atribuição padrão é 7 dias de clique. Um `Purchase` que acontece 30
dias depois do clique entra como evento, mas não é atribuído àquele anúncio.
Por isso o evento de otimização deve ser o mais fundo que ainda acontece
**dentro da janela** — na prática, `LeadQualificado` ou `Schedule`.

**Volume.** Um conjunto de anúncios precisa de ~50 conversões por semana para
sair do aprendizado. Otimizar por um evento que acontece 3 vezes por mês trava
a entrega e encarece. Por isso o plano é começar em `Lead` e subir para
`LeadQualificado` quando o volume permitir.

---

## LGPD

O formulário manda para a Meta telefone e nome **hasheados em SHA-256** (mais
IP e user agent, que a Meta exige em claro). Isso precisa estar escrito na
política de privacidade: que dados de contato são compartilhados de forma
pseudonimizada com a Meta para medição e otimização de anúncios. Hoje a LP diz
só "Seus dados ficam com a gente. Sem spam, sem repasse." — **essa frase
conflita com o que o sistema passa a fazer** e precisa ser ajustada.
