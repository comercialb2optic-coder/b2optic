# B2Optic Landing Page — Contexto do Projeto

## Sobre o projeto
Landing page de captação de leads da **B2Optic**, uma aceleradora de vendas para óticas (lojas de óculos). A página recebe tráfego pago do Meta Ads, qualifica o lead via formulário/aplicação, e gera reunião comercial.

**Público-alvo:** donos de ótica no Brasil, geralmente entre 35-60 anos, faturamento de R$30k a R$500k/mês, com baixa intimidade técnica mas alta capacidade de avaliar uma marca premium vs amadora.

**Posicionamento:** premium, autoridade, ROI concreto. Não somos agência de tráfego — somos aceleradora de vendas com método próprio.

## Stack
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (config em `client/src/index.css` via `@theme`)
- **Framer Motion** para animações
- **shadcn/ui** + **Radix UI** para componentes base
- **React Hook Form** + **Zod** para formulários
- **pnpm** como gerenciador de pacotes

## Estrutura
```
client/src/
├── pages/Home.tsx              # Página principal (importa todos os componentes)
├── components/
│   ├── Header.tsx              # Cabeçalho com logo + CTA
│   ├── Hero.tsx                # Seção hero com headline principal
│   ├── ClientsCarousel.tsx     # Carrossel infinito de logos de clientes
│   ├── Ecosystem.tsx           # 3 cards: Triagem, Agendamento, Treinamento
│   ├── Certifications.tsx      # Selo Google/Meta + 5 passos
│   ├── Map.tsx                 # Mapa/depoimentos de óticas
│   ├── Guarantee.tsx           # Bullets de garantia
│   ├── DiagnosticForm.tsx      # Formulário de aplicação/diagnóstico
│   └── Footer.tsx              # Rodapé
└── index.css                   # Variáveis de tema (cores, raio, etc)
```

## Paleta de cores (NÃO ALTERAR — usar SEMPRE via variável CSS)
- `--background: #050505` (fundo principal, quase preto)
- `--card: #0A0A0A` (cards sobre o fundo)
- `--secondary: #111111` (seções alternadas)
- `--primary: #0055FF` (azul B2Optic — usar com moderação, só destaque)
- `--foreground: #A1A1AA` (texto principal)
- `--card-foreground: #ffffff` (títulos)
- `--muted-foreground: #71717A` (texto secundário)
- `--border: rgba(255, 255, 255, 0.08)` (bordas sutis)

**Sempre referencie via `bg-background`, `text-foreground`, `border-border` etc. Nunca hardcode hex.**

## Diretrizes de design — Estética Premium

A estética atual é funcional mas tem "cara de IA": gradientes genéricos, glassmorphism padrão, animações óbvias. O objetivo é elevar pra parecer feita por um estúdio sênior, mantendo cores e estrutura.

### Princípios
1. **Tipografia é o ativo principal.** Hierarquia com peso e tracking, não com gradient text colorido. Headlines em peso 600-700 com tracking levemente negativo (-0.02em). Subheadings em 400-500.
2. **Espaço respira.** Padding generoso entre seções (mínimo `py-24 md:py-32`). Largura máxima de conteúdo `max-w-6xl` ou `max-w-7xl`.
3. **Bordas sutis substituem cards berrantes.** Use `border border-border/50` com `bg-card/40` ao invés de cards opacos.
4. **Glassmorphism com moderação.** `backdrop-blur` só em elementos flutuantes (header sticky, modais). Não em cards de seção.
5. **Animação serve o conteúdo.** Entradas com `fadeInUp` (y: 20, opacity: 0 → y: 0, opacity: 1, duração 0.6s, ease `[0.22, 1, 0.36, 1]`). Stagger em listas (delay 0.08s entre itens). Nada de bounce, spring exagerado ou rotation gratuita.
6. **Azul primary é tempero, não pintura.** Usar em CTAs, ícones de destaque, números de stats — nunca em backgrounds grandes, nunca em texto longo.
7. **Microdetalhes:** linha-divisória de 1px com gradiente sutil entre seções, ring quase imperceptível em hover de cards (`hover:ring-1 hover:ring-white/10`), shadow só onde faz sentido físico (cards flutuantes, modal).

### O que evitar (cara de IA)
- ❌ Gradient text colorido (`bg-clip-text` com cores berrantes)
- ❌ Emoji decorativo nos títulos
- ❌ Cards com gradient background colorido
- ❌ Animações de "magic sparkles", confetti, partículas
- ❌ Headlines com 4+ tamanhos diferentes na mesma seção
- ❌ Mais de 2 pesos de fonte na mesma view

### O que abraçar (premium)
- ✅ Tipografia única e bem trabalhada (font feature settings, kerning, leading apertado em headlines, leading folgado em body)
- ✅ Números grandes como elementos visuais (`+R$ 13M`, `+200`, `+45%`)
- ✅ Bordas com gradiente sutil em cards selecionados
- ✅ Reveals com timing musical (stagger consistente)
- ✅ Estado vazio com personalidade (skeleton elegante, não spinner)
- ✅ Detalhes de baixo contraste que recompensam o olhar atento

## Convenções de código
- Componentes em **PascalCase**, arquivos `.tsx`
- Hooks customizados em `client/src/hooks/`
- Tipos compartilhados em `shared/`
- Imports absolutos via `@/` (configurado em `tsconfig.json`)
- Tailwind: ordenar classes por categoria (layout → spacing → typography → color → effects)
- Framer Motion: extrair `variants` em const fora do componente quando o objeto for reutilizado

## Como executar
```bash
pnpm dev          # rodar em desenvolvimento (porta 5173)
pnpm build        # build de produção
pnpm preview      # testar o build localmente
pnpm check        # checar tipos TypeScript
```

## Fluxo de trabalho com Claude Code
1. Sempre que for fazer mudança visual, **antes leia o componente atual** com `view` para entender o estado.
2. Mudanças grandes (refatorar uma seção inteira): proponha o plano primeiro, espere o ok, depois execute.
3. Após mudanças, **rodar `pnpm check`** para garantir que não quebrou tipos.
4. Nunca instalar dependências novas sem perguntar — o stack já está completo pra 90% das necessidades.

## Próximas fases (não fazer agora, só contexto)
- Fase 2: Formulário de aplicação multi-etapa com perguntas de qualificação real
- Fase 3: Pixel do Meta + GA4 + eventos de conversão
- Fase 4: Otimização de performance (Lighthouse 95+ em mobile)
- Fase 5: Deploy (Vercel ou similar)
