# B2Optic Landing Page — Contexto do Projeto

## Sobre

Landing page de captação da **B2Optic**, aceleradora de vendas para óticas. Recebe tráfego pago do Meta Ads, qualifica o lead num formulário de 3 etapas e gera reunião comercial.

**Público:** dono de ótica, 35-60 anos, fatura de R$30k a R$500k/mês. Baixa intimidade técnica, alta capacidade de julgar se a marca é séria. Provavelmente já foi queimado por agência de tráfego.

**Posicionamento:** aceleradora de vendas com método próprio. Não é agência de tráfego.

## ⚠️ Leia as skills antes de mexer

Este projeto tem quatro skills em `.claude/skills/`. Elas são a fonte de verdade, não este arquivo:

| Skill | Quando ler |
|---|---|
| `b2optic-design` | antes de qualquer JSX de seção, cor, espaçamento ou animação |
| `b2optic-copy` | antes de escrever headline, texto de card, label ou CTA |
| `b2optic-dev` | antes de criar componente, editar seção ou tocar no Home.tsx |
| `b2optic-qa` | antes de dizer que algo está pronto |

E três agentes em `.claude/agents/`: `lp-section-builder`, `lp-design-review`, `lp-qa`.

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · Framer Motion · shadcn/ui · react-hook-form + Zod · **pnpm**

Não existe `tailwind.config.js` — os tokens ficam em `client/src/index.css` dentro de `@theme`.

```bash
pnpm dev      # → http://localhost:3000
pnpm check    # tsc --noEmit — obrigatório antes de concluir qualquer tarefa
pnpm build
```

## Tema: claro com blocos escuros

A página é **clara**. Duas seções são escuras de propósito, como respiro visual: `ToolsOrbit` e `PerformancePanel`.

O mecanismo: a classe `.section-dark` **redefine os mesmos tokens no escopo da seção**. Por isso o JSX dentro dela continua escrevendo `bg-background` / `text-heading` / `border-line` normalmente — não existe componente duplicado para claro e escuro.

A única exceção: **texto azul dentro do bloco escuro usa `text-primary-on-dark`**, não `text-primary`. `#0055FF` sobre `#080B14` dá 3,5:1 de contraste e reprova em acessibilidade; `#4D8AFF` dá 5,9:1.

Paleta completa e regras anti-cara-de-IA: `.claude/skills/b2optic-design/SKILL.md`.

## Estrutura

```
client/src/
├── pages/Home.tsx        # só a ordem das seções e a alternância de fundo
├── content.ts            # TODO texto e número da página — fonte única
├── lib/submitLead.ts     # único ponto de envio do formulário
├── components/
│   ├── motion/           # BlurFade, WordReveal, CountUp, StaggerGroup, EASE_OUT_QUINT
│   └── ui/               # shadcn — não editar à mão
└── index.css             # tokens (@theme) + .section-dark + utilitários
```

`client/src/const.ts` é sobra do template (helper de OAuth). Ignore.

### Ordem das seções

Hero → ClientsCarousel → DiagnosticPreview → Cases → **ToolsOrbit (escuro)** → Methodology → **PerformancePanel (escuro)** → Onboarding → CtaBanner → Numbers → Qualification → About → DiagnosticForm → Footer

Os fundos alternam de forma que nenhuma seção encoste em outra da mesma cor. Ao inserir uma seção nova, confira a vizinhança.

## Conteúdo

**Nenhuma string de conteúdo e nenhum número dentro de `.tsx`.** Tudo em `client/src/content.ts`. Um número existe em um lugar só — hero e seção de Números importam a mesma constante, então não têm como divergir.

## Formulário

3 etapas (identificação → faturamento → experiência com anúncios), react-hook-form + Zod.

O card vive em `components/LeadForm.tsx` e aparece em **dois lugares**: dentro do hero (o CTA da dobra — o hero não tem botão) e na seção `DiagnosticForm` do fim da página. Cada instância tem estado próprio, de propósito. Ao mexer no formulário, mexa só no `LeadForm` — as duas posições herdam.

O envio passa por `client/src/lib/submitLead.ts`, que lê `VITE_LEAD_WEBHOOK_URL`. Ele também normaliza o WhatsApp para o formato do CRM e captura UTM/fbclid/gclid da URL — o tráfego vem de anúncio, então saber de qual anúncio veio o lead importa tanto quanto o lead.

**Sem a variável definida, o envio falha de propósito e mostra erro na tela.** Isso é intencional: o pior cenário possível é a tela de sucesso aparecer e o lead não existir em lugar nenhum. Copie `.env.example` para `.env.local` para configurar.

## Pendências conhecidas

- [ ] `VITE_LEAD_WEBHOOK_URL` não configurada — formulário ainda não entrega lead
- [ ] `ONBOARDING_SECTION.steps` em `content.ts` é **conteúdo provisório**, deduzido do app e da metodologia. Precisa das etapas reais antes de publicar
- [ ] Logos das ferramentas do `ToolsOrbit` — os nós renderizam o nome em tipografia. Basta colocar arquivo em `public/ferramentas/` e preencher o campo `logo` de cada item
- [ ] Google e n8n em `TOOLS_SECTION.tools` estão com `confirmed: false` — confirmar se entram
- [ ] Links de redes sociais em `SOCIAL` (`content.ts`) apontam para `#`, e o WhatsApp está como `wa.me/55XXXXXXXXXXX`
- [ ] `Cases` carrega 5 iframes do YouTube — pesa no mobile. Avaliar troca por thumbnail com play
- [ ] `ManusDialog.tsx` é código morto (sobra do template, "Login with Manus"), não é importado em lugar nenhum
- [ ] `OpticalBackdrop.tsx` está fora do Home. Era o mesh azul de tela cheia que afogava a página no claro. Pode ser reaproveitado **dentro** dos blocos escuros
- [ ] Bloco `DEPRECIADO` no fim do `index.css` neutraliza classes da versão escura (`.text-gradient`, `.card-glass`, `.neon-glow`). Nenhum componente de seção usa mais — pode ser removido

## Imagens do painel

`public/painel/painel-desktop.jpg` e `painel-mobile.jpg` são recortes de screenshots do app **B2Performance**, da rede fictícia "Multfoco" usada no modo preview.

**São dados de demonstração e devem continuar sendo.** Nunca substitua por print de cliente real — expõe faturamento e investimento de terceiro numa página pública. A seção exibe o aviso "Dados de demonstração" por isso.
