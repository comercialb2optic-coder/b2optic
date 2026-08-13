/**
 * Fonte única de verdade do conteúdo da LP.
 *
 * Nenhuma string de conteúdo e nenhum número devem ser escritos dentro de um
 * componente. Se duas seções mostram a mesma métrica, as duas importam daqui.
 *
 * Ver .claude/skills/b2optic-copy/SKILL.md
 */

/**
 * Métricas da operação. Um número aparece em UM lugar só — hero e seção de
 * números importam daqui, então não há como as duas divergirem.
 */
export const METRICS = {
  oticas: {
    value: 200,
    prefix: '+',
    word: 'ÓTICAS',
    label: 'óticas aceleradas',
    sub: 'já aceleram com a B2',
  },
  vendas: {
    value: 13,
    prefix: '+R$ ',
    suffix: 'M',
    word: 'MILHÕES',
    label: 'em vendas geradas',
    sub: 'em vendas geradas',
  },
  leads: {
    value: 40000,
    prefix: '+',
    word: 'LEADS',
    sub: 'gerados para clientes todos os meses',
  },
  anos: {
    value: 4,
    prefix: '+',
    word: 'ANOS',
    sub: 'no mercado óptico',
  },
} as const;

export const NUMBERS_SECTION = {
  eyebrow: 'Resultados que comprovam',
  title: 'Números que falam por nós',
} as const;

export const NAV = [
  { id: 'solucoes', label: 'Soluções' },
  { id: 'onboarding', label: 'Como funciona' },
  { id: 'cases', label: 'Cases' },
] as const;

export const CTA = {
  primary: 'Quero meu diagnóstico gratuito',
  form: 'Quero meu diagnóstico gratuito',
  formNext: 'Continuar',
  formBack: 'Voltar',
} as const;

export const HERO = {
  /** Filtro de público no topo — a parte em `qualifierBold` sai em negrito.
   *  Estrutura emprestada da V4: dizer logo pra quem a página é já afasta
   *  quem não tem perfil e valoriza quem tem. */
  qualifierPre: 'Para óticas que faturam',
  qualifierBold: 'a partir de R$ 30 mil por mês',
  /** Enquadramento pelo ano — dá urgência sem inventar escassez falsa. */
  headlineBefore: 'Faça de 2026 o ano',
  highlight: 'mais lucrativo',
  headlineAfter: 'da sua ótica',
  /** Já manda agendar e diz o que muda na operação dela — mesma mecânica da
   *  V4, que não gasta o subtítulo descrevendo a empresa. */
  subtitle:
    'Agende seu diagnóstico gratuito e veja onde sua operação está perdendo venda hoje — e o que mudar pra vender mais no balcão.',
  benefits: [
    'Marketing e comercial focados em ROI, não em curtida',
    'Lead qualificado que entra na loja, não volume vazio',
    'Tecnologia e IA no atendimento e no agendamento',
  ],
} as const;

/** Certificações reais da operação — recuperadas do componente Certifications
 *  que existia antes de ser removido. Não adicionar selo que não exista. */
export const CERTIFICATIONS = {
  label: 'Certificados pelas maiores plataformas',
  items: [
    { id: 'google', name: 'Google Ads', sub: 'Search Certified' },
    { id: 'meta', name: 'Facebook', sub: 'Blueprint Certified' },
  ],
} as const;

export const CLIENTS_SECTION = {
  eyebrow: 'Quem já acelerou',
  title: 'Óticas que já vendem mais com a B2Optic',
} as const;

export const FORM = {
  /** Usados quando o formulário aparece dentro do hero. */
  heroTitle: 'Solicite seu diagnóstico gratuito',
  heroSubtitle: 'Leva 1 minuto. Um especialista liga em 10 minutos.',
  /** Usados na seção de formulário no fim da página. */
  eyebrow: 'Vamos acelerar?',
  title: 'Dar o próximo passo leva 1 minuto',
  subtitle:
    'Responde três perguntas rápidas e um especialista liga em 10 minutos pra montar seu diagnóstico.',
  steps: {
    1: { label: 'Seus dados', title: 'Como a gente fala com você?' },
    2: { label: 'Sua ótica', title: 'Qual o faturamento mensal hoje?' },
    3: { label: 'Seu momento', title: 'Você já anuncia?' },
  },
  fields: {
    name: { label: 'Nome', placeholder: 'Seu nome completo' },
    whatsapp: { label: 'WhatsApp', placeholder: '(47) 99999-9999' },
    opticsName: { label: 'Nome da ótica', placeholder: 'Como aparece na fachada' },
  },
  errors: {
    name: 'Informe seu nome',
    whatsapp: 'Informe um WhatsApp válido com DDD',
    opticsName: 'Informe o nome da sua ótica',
    revenue: 'Escolha uma faixa de faturamento',
    ads: 'Escolha uma opção',
    network: 'Não conseguimos enviar agora. Tenta de novo em instantes.',
  },
  success: {
    title: 'Pronto. Recebemos sua solicitação.',
    body: 'Um especialista liga no seu WhatsApp em cerca de 10 minutos pra montar o diagnóstico da sua ótica.',
  },
  privacy: 'Seus dados ficam com a gente. Sem spam, sem repasse.',
} as const;

export const REVENUE_OPTIONS = [
  { value: 'ate-30k', label: 'Até R$ 30 mil', sub: 'Começando' },
  { value: '30-100k', label: 'R$ 30 a 100 mil', sub: 'Estabelecida' },
  { value: '100-250k', label: 'R$ 100 a 250 mil', sub: 'Crescendo' },
  { value: 'acima-250k', label: 'Acima de R$ 250 mil', sub: 'Operação madura' },
] as const;

export const ADS_OPTIONS = [
  { value: 'agencia', label: 'Já anuncio com agência', sub: 'Tenho parceiro hoje' },
  { value: 'conta-propria', label: 'Já tentei por conta própria', sub: 'Sem agência atual' },
  { value: 'nunca', label: 'Nunca anunciei', sub: 'Vou começar agora' },
  { value: 'insatisfeito', label: 'Anuncio mas tô insatisfeito', sub: 'Quero trocar' },
] as const;

export const CASES_SECTION = {
  eyebrow: 'Cases de sucesso',
  title: 'Quem já vive o resultado',
  subtitle:
    'Donos de ótica contando, no formato deles, o que mudou depois do método B2Optic.',
  items: [
    { id: 1, videoId: 'RxmJEAwXWAQ', oticaName: 'Ótica Ipanema' },
    { id: 2, videoId: 'VfOnDZZUMwg', oticaName: 'Ótica Vitaliz' },
    { id: 3, videoId: '5z9TI2ATX40', oticaName: 'Ótica Brasil' },
    { id: 4, videoId: 'LCrl3aXCDCg', oticaName: 'Ótica Visão' },
    { id: 5, videoId: 'Y-deXtNVCfM', oticaName: 'Ótica Esquadra' },
  ],
} as const;

export const DIAGNOSTIC_PREVIEW = {
  eyebrow: 'Diagnóstico gratuito',
  title: 'O que você recebe no diagnóstico',
  subtitle:
    'Em 45 minutos um especialista analisa o marketing e o processo comercial da sua ótica e te entrega um plano de ação pra aplicar na semana.',
  items: [
    {
      index: '01',
      title: 'Onde sua ótica está hoje',
      body: 'Análise da situação atual pra identificar juntos os gargalos que estão travando o crescimento.',
    },
    {
      index: '02',
      title: 'O que ela realmente precisa',
      body: 'Mostramos exatamente o que precisa ser feito e qual o próximo passo — sem enrolação e sem pacote genérico.',
    },
    {
      index: '03',
      title: 'Plano de ação estratégico',
      body: 'Um plano concreto pra aumentar demanda qualificada e número de vendas, com prioridade e ordem de execução.',
    },
  ],
} as const;

export const ABOUT = {
  eyebrow: 'Quem é a B2Optic',
  title: 'Um time preparado para acelerar a sua ótica',
  highlight: 'acelerar',
  paragraphs: [
    'Unimos estratégia, tecnologia e execução pra transformar o marketing da sua ótica em venda real no balcão. Somos especialistas em captação qualificada, automação de agendamento e estruturação do processo comercial — tudo conectado.',
    'Nosso time trabalha lado a lado com cada ótica parceira. Mais de 200 óticas aceleradas e +R$ 13 milhões em vendas geradas comprovam: a gente vive aquilo que entrega.',
  ],
} as const;

export const METHODOLOGY = {
  eyebrow: 'Metodologia B2Optic',
  title: 'Um ciclo que não depende de sorte',
  subtitle:
    'Captação, agendamento, conversão e gestão conectados. Cada etapa alimenta a próxima.',
  steps: [
    {
      number: '01',
      label: 'Captação',
      body: 'Anúncios com criativos validados que atraem lead com intenção real de compra — não volume vazio, mas gente pronta pra entrar na sua loja.',
    },
    {
      number: '02',
      label: 'Agendamento',
      body: 'Uma IA conversa com o lead e marca a consulta 24h por dia, e nosso time de SDRs reforça o atendimento. O horário cai direto na sua agenda.',
    },
    {
      number: '03',
      label: 'Conversão',
      body: 'O lead chega aquecido e confirmado. Lembretes no WhatsApp avisam local, dia e horário — e sua equipe treinada fecha a venda no balcão.',
    },
    {
      number: '04',
      label: 'Gestão',
      body: 'Vendas e métricas em tempo real, com gestão de leads e oportunidades — pra você ver o que converte e escalar o que funciona.',
    },
  ],
} as const;

export const QUALIFICATION = {
  eyebrow: 'Ainda na dúvida?',
  title: 'A B2Optic é pra sua ótica?',
  instruction: 'Marque o que condiz com a sua necessidade hoje:',
  options: [
    'Aumentar o retorno dos anúncios e parar de queimar verba',
    'Atrair mais clientes qualificados e lotar a agenda da ótica',
    'Estruturar o comercial pra vender mais óculos no balcão',
    'Automatizar o agendamento e o atendimento',
    'Ter criativos validados que trazem movimento pra loja',
  ],
  /** Quantas opções marcadas fecham o argumento. */
  threshold: 3,
  closingHighlight: 'Marcou três ou mais?',
  closingRest: 'Então a B2Optic resolve exatamente o que trava a sua ótica.',
  cta: 'Quero falar com a B2',
} as const;

/**
 * Anel de ferramentas em volta da logo da B2.
 *
 * Meta, WhatsApp e ClickUp estão CONFIRMADOS — são integrações que existem no
 * código do B2Performance. Os demais são suposição e precisam de confirmação.
 *
 * `logo` é opcional: enquanto não houver arquivo, o nó renderiza o `label` em
 * tipografia. Para trocar por imagem, coloque o arquivo em
 * `public/ferramentas/` e preencha o campo — o componente não muda.
 */
/**
 * `logo` é `string | null` de propósito, mesmo com todas as ferramentas atuais
 * tendo arquivo. Sem essa anotação o `as const` infere só os literais, o ramo
 * de fallback tipográfico do ToolsOrbit vira `never` e o build quebra — e esse
 * fallback é o que segura uma ferramenta nova entrar antes da logo chegar.
 */
interface Tool {
  id: string;
  label: string;
  note: string;
  confirmed: boolean;
  logo: string | null;
}

export const TOOLS_SECTION = {
  eyebrow: 'Tecnologia',
  title: 'Uma estrutura inteira conectada na sua ótica',
  subtitle:
    'Não é ferramenta solta que você tem que aprender a usar. É captação, atendimento, agendamento e acompanhamento no mesmo fluxo — e a gente opera tudo.',
  tools: [
    { id: 'meta', label: 'Meta', note: 'Anúncios', confirmed: true, logo: '/ferramentas/meta.png' },
    { id: 'instagram', label: 'Instagram', note: 'Alcance', confirmed: true, logo: '/ferramentas/instagram.png' },
    { id: 'gemini', label: 'Gemini', note: 'Busca', confirmed: true, logo: '/ferramentas/gemini.png' },
    { id: 'openai', label: 'OpenAI', note: 'Agendamento 24h', confirmed: true, logo: '/ferramentas/openai.png' },
    { id: 'claude', label: 'Claude', note: 'Análise', confirmed: true, logo: '/ferramentas/claude.png' },
    { id: 'clickup', label: 'ClickUp', note: 'Operação', confirmed: true, logo: '/ferramentas/clickup.png' },
    { id: 'n8n', label: 'n8n', note: 'Automação', confirmed: true, logo: '/ferramentas/n8n.png' },
  ] as Tool[],
} as const;

// ⚠️ CONTEÚDO PROVISÓRIO — a sequência abaixo foi deduzida do que o app e a
// metodologia revelam, para a seção existir e poder ser avaliada visualmente.
// As etapas REAIS precisam vir do dono antes de publicar.
export const ONBOARDING_SECTION = {
  eyebrow: 'Depois que você entra',
  title: 'Da assinatura até a agenda cheia',
  subtitle:
    'Sem caixa-preta. Você sabe o que está acontecendo em cada semana e o que já está rodando.',
  steps: [
    {
      week: 'Semana 1',
      title: 'Diagnóstico e acessos',
      body: 'Reunião de kickoff, mapeamento da operação atual e conexão das contas — Meta, WhatsApp e o painel da sua ótica.',
      deliverable: 'Painel da sua ótica no ar',
    },
    {
      week: 'Semana 1–2',
      title: 'Estruturação da campanha',
      body: 'Definição de praça, público e oferta. Produção dos primeiros criativos com base no que já validamos em outras óticas da mesma região.',
      deliverable: 'Primeiros criativos aprovados',
    },
    {
      week: 'Semana 2',
      title: 'Anúncios no ar',
      body: 'Campanha publicada e o lead começa a entrar. A IA de atendimento assume o primeiro contato no WhatsApp em minutos, 24h por dia.',
      deliverable: 'Lead entrando e sendo atendido',
    },
    {
      week: 'Semana 3',
      title: 'Agenda e comercial',
      body: 'Agendamento automático conectado à sua agenda, com lembrete no WhatsApp pra reduzir falta. Treinamento do balcão pra fechar a venda.',
      deliverable: 'Agenda preenchida',
    },
    {
      week: 'Contínuo',
      title: 'Otimização com dado',
      body: 'Acompanhamento semanal no painel: o que converte escala, o que não converte sai. Criativo novo entra antes do atual fadigar.',
      deliverable: 'Ciclo previsível rodando',
    },
  ],
} as const;

export const PANEL_SECTION = {
  eyebrow: 'Acompanhamento',
  title: 'Você vê o dinheiro entrando, não um relatório no fim do mês',
  subtitle:
    'Painel próprio, aberto pra você a qualquer hora. Quanto entrou, quanto custou, quantos agendaram e quantos compraram.',
  highlights: [
    {
      title: 'Funil inteiro, não só lead',
      body: 'Lead → agendamento → comparecimento → venda. Dá pra ver exatamente em qual etapa você está perdendo dinheiro.',
    },
    {
      title: 'Retorno por real investido',
      body: 'ROAS, custo por venda e custo por agendamento calculados no período que você escolher.',
    },
    {
      title: 'Rede inteira ou loja a loja',
      body: 'Tem mais de uma unidade? Compare o desempenho entre elas na mesma tela.',
    },
  ],
  /** Rede fictícia usada no modo preview do app — dado de demonstração, nunca
   *  dado de cliente real. */
  disclaimer: 'Dados de demonstração',
} as const;

// ⚠️ LINKS PENDENTES — vieram como [PREENCHER] da versão anterior e nunca
// foram preenchidos. Hoje apontam para "#" no site no ar.
export const SOCIAL = [
  { label: 'WhatsApp', href: 'https://wa.me/55XXXXXXXXXXX', icon: 'whatsapp' },
  { label: 'YouTube', href: '#', icon: 'youtube' },
  { label: 'LinkedIn', href: '#', icon: 'linkedin' },
  { label: 'Instagram', href: '#', icon: 'instagram' },
] as const;

export const FOOTER = {
  copyright: `Copyright © ${new Date().getFullYear()} B2Optic`,
  terms: 'Termos de uso',
  privacy: 'Política de privacidade',
} as const;
