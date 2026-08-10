---
name: b2optic-dev
description: Convenções de código da LP da B2Optic — anatomia de um componente de seção, tokens, motion, conteúdo, envio de lead e comandos. Ler ANTES de criar componente novo, editar seção existente, adicionar dependência ou mexer no Home.tsx.
---

# Dev — LP B2Optic

Stack: React 19 + TypeScript + Vite + Tailwind v4 + Framer Motion + shadcn/ui + react-hook-form/Zod. Gerenciador: **pnpm**.

## 1. Comandos

```bash
pnpm dev      # dev server → http://localhost:3000 (porta definida no vite.config.ts)
pnpm check    # tsc --noEmit  ← rodar SEMPRE antes de dar tarefa por pronta
pnpm build    # build de produção
pnpm format   # prettier
```

`pnpm check` é obrigatório depois de qualquer mudança em `.ts`/`.tsx`. Não conclua tarefa com erro de tipo.

## 2. Onde fica cada coisa

```
client/src/
├── pages/Home.tsx           # ordem das seções, nada mais
├── components/              # uma seção = um arquivo PascalCase
│   ├── motion/              # BlurFade, WordReveal, CountUp, StaggerGroup, EASE_OUT_QUINT
│   └── ui/                  # shadcn — não editar à mão
├── content.ts               # TODO texto e número da página  ← fonte única
├── lib/submitLead.ts        # único ponto de envio do formulário
└── index.css                # tokens de tema (@theme) e utilitários
```

`client/src/const.ts` é sobra do template (helper de OAuth). Ignore.

## 3. Anatomia de um componente de seção

Todo componente de seção segue esta forma:

```tsx
import { motion } from 'framer-motion';
import { EASE_OUT_QUINT } from '@/components/motion';
import { ONBOARDING } from '@/content';

export default function Onboarding() {
  return (
    <section id="onboarding" className="bg-background py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* ... */}
        </motion.header>
      </div>
    </section>
  );
}
```

Regras:
- `export default`, um componente de seção por arquivo.
- A `<section>` carrega o fundo e o padding vertical. O `<div>` interno carrega largura e padding horizontal. Não misture.
- `id` na section só quando houver link âncora apontando pra ela.
- Texto vem de `content.ts`. Se você digitou uma frase dentro do JSX, está no lugar errado.
- `viewport={{ once: true }}` sempre — animação que repete a cada scroll cansa.

### Seção em bloco escuro

As seções Ferramentas e Painel CRM usam a classe `.section-dark`, que troca os tokens localmente:

```tsx
<section className="section-dark py-24 lg:py-36">
```

Dentro dela, `bg-background`, `text-heading`, `text-foreground` e `border-line` continuam funcionando — apontam para os valores escuros. **Não** escreva `bg-[#080B14]` no componente.

Atenção: texto azul dentro do bloco escuro usa `text-primary-on-dark`, não `text-primary` (contraste 3,5:1 é ilegível). Botão preenchido continua `bg-primary`.

## 4. Motion

Use os utilitários existentes em vez de reescrever variants:

- `<BlurFade>` — entrada padrão de bloco
- `<WordReveal>` — headline palavra a palavra (só no hero, não abuse)
- `<CountUp>` — número que conta ao entrar na viewport
- `<StaggerGroup>` — lista com atraso progressivo
- `useParallax()` — deslocamento no scroll
- `useIsMobile()` — decisões de layout que dependem de tela

Easing sempre `EASE_OUT_QUINT`. Duração 0.6s em entrada, 0.24s em hover.

Objeto de `variants` reutilizado vira `const` fora do componente.

## 5. Conteúdo

`client/src/content.ts` exporta objetos tipados por seção:

```ts
export const METRICS = {
  oticas: { value: 200, label: 'óticas aceleradas' },
  vendas: { value: 13, unit: 'milhões', label: 'em vendas geradas' },
} as const;
```

Um número aparece em um lugar só. Se duas seções mostram a mesma métrica, as duas importam a mesma constante.

## 6. Envio de lead

Todo envio passa por `client/src/lib/submitLead.ts`. O componente do formulário não conhece a URL de destino nem o formato do payload.

```ts
const url = import.meta.env.VITE_LEAD_WEBHOOK_URL;
```

Sem a variável definida, `submitLead` falha de forma visível em dev (`console.error` + rejeita) para não dar falsa sensação de que capturou. Nunca engula erro de envio silenciosamente — o usuário precisa ver estado de erro e poder tentar de novo.

Variáveis de ambiente do Vite exigem prefixo `VITE_`. `.env.local` não vai pro git.

## 7. Tailwind v4

Tokens ficam em `client/src/index.css` dentro de `@theme`. Não existe `tailwind.config.js` neste projeto — não crie um.

Ordem das classes: layout → espaçamento → tipografia → cor → efeito.

Valor arbitrário (`text-[15px]`) só quando não houver token. Cor arbitrária, nunca.

## 8. Dependências

**Não instale nada sem perguntar.** O stack já cobre praticamente tudo:

| Precisa de | Já tem |
|---|---|
| gráfico | `recharts` |
| carrossel | `embla-carousel-react` |
| ícone | `lucide-react` |
| toast | `sonner` |
| formulário + validação | `react-hook-form` + `zod` |
| accordion / FAQ | `@radix-ui/react-accordion` |
| animação | `framer-motion` |

Diagrama (o orbital de ferramentas) é SVG escrito à mão. Não instale lib de diagrama.

## 9. Antes de dar a tarefa por pronta

- [ ] `pnpm check` limpo
- [ ] Nenhum hex no `.tsx`
- [ ] Nenhuma string de conteúdo no `.tsx`
- [ ] Testado em 360px, 768px e 1440px
- [ ] Skill `b2optic-design` conferida (seção 7)
- [ ] Skill `b2optic-qa` rodada
