---
name: b2optic-design
description: Sistema de design da LP da B2Optic — paleta clara, tipografia, espaçamento, motion e as regras que impedem a página de sair com cara de IA. Ler ANTES de escrever qualquer JSX de seção, escolher cor, definir espaçamento ou criar animação.
---

# Sistema de design — LP B2Optic

Tema **claro** com blocos escuros de respiro. O azul é tempero, não pintura.

## 1. Paleta

Nunca escreva hex no componente. Sempre via token Tailwind (`bg-surface`, `text-heading`, `border-line`).

### Claro (padrão da página)

| Token | Hex | Uso |
|---|---|---|
| `--background` | `#FFFFFF` | fundo padrão de seção |
| `--surface` | `#F6F8FC` | seção alternada (off-white frio) |
| `--card` | `#FFFFFF` | card sobre qualquer fundo claro |
| `--heading` | `#0B1220` | títulos (quase-preto com fundo azulado) |
| `--foreground` | `#3F4655` | corpo de texto |
| `--muted-foreground` | `#6B7385` | texto secundário, legendas |
| `--line` | `#E4E8F0` | bordas |
| `--primary` | `#0055FF` | CTA, ícone de destaque, número |
| `--primary-hover` | `#0047D6` | hover de botão preenchido |
| `--primary-soft` | `#EEF3FF` | fundo de badge/pill, hover sutil |

`#0055FF` sobre branco dá **5,6:1** de contraste — passa AA para texto normal. Pode usar em link e palavra destacada sem medo.

### Escuro (só nas seções Ferramentas e Painel CRM)

| Token | Hex | Uso |
|---|---|---|
| `--dark-bg` | `#080B14` | fundo do bloco escuro |
| `--dark-surface` | `#0F1420` | card dentro do bloco escuro |
| `--dark-heading` | `#FFFFFF` | título no escuro |
| `--dark-foreground` | `#A8B0C0` | corpo no escuro |
| `--dark-line` | `rgba(255,255,255,0.09)` | borda no escuro |
| `--primary-on-dark` | `#4D8AFF` | **texto** azul no escuro (5,9:1) |

Regra crítica: `#0055FF` sobre `#080B14` dá só **3,5:1** — ilegível como texto. No bloco escuro, texto azul usa `--primary-on-dark`. Botão preenchido continua `#0055FF` com texto branco.

### Onde o azul pode aparecer

✅ Fundo de botão primário · ícone de destaque · número de estatística · palavra-chave numa headline (uma por headline, no máximo) · borda de card selecionado · barra de progresso.

❌ Fundo de seção inteira · texto de parágrafo · gradiente cobrindo a tela · headline inteira em azul.

O erro da versão antiga foi exatamente esse: azul virou fundo de tudo e a página afogou.

## 2. Tipografia

Fonte única: **Plus Jakarta Sans**. Não adicione segunda família.

| Papel | Tamanho | Peso | Tracking | Leading |
|---|---|---|---|---|
| H1 hero | `clamp(2.25rem, 5vw, 3.75rem)` | 600 | `-0.03em` | 1.05 |
| H2 seção | `clamp(1.75rem, 3.5vw, 2.75rem)` | 600 | `-0.025em` | 1.1 |
| H3 card | `1.125rem` | 600 | `-0.01em` | 1.3 |
| Corpo | `1rem` / `1.0625rem` | 400 | 0 | 1.65 |
| Legenda | `0.875rem` | 400 | 0 | 1.5 |
| Eyebrow | `0.75rem` | 500 | `0.14em` | — |
| Número grande | `clamp(2.5rem, 6vw, 4.5rem)` | 700 | `-0.04em` | 1 |

**Máximo 2 pesos por viewport.** Se a seção já usa 600 e 400, não introduza 500 nem 700.

Largura de leitura: parágrafo nunca passa de `max-w-[65ch]`.

## 3. Espaçamento e grid

- Seção: `py-20 md:py-28 lg:py-32`. Bloco escuro pode ir a `lg:py-36` — ele é o momento de respiro.
- Container: `max-w-6xl` para conteúdo de leitura, `max-w-7xl` só quando houver grid de 4+ colunas.
- Gap entre cards: `gap-5 md:gap-6`. Nunca menos que 20px.
- Padding interno de card: `p-6 md:p-7`.

**Não centralize tudo.** Alterne: cabeçalho de seção centralizado em seções de prova (números, logos, depoimentos), alinhado à esquerda em seções explicativas (soluções, onboarding). Página inteira centralizada é assinatura de template.

## 3.1 Textura de fundo

Branco chapado do topo ao rodapé cansa. `SectionBackdrop` resolve isso com quatro camadas em CSS puro (sem canvas, sem imagem), todas com máscara radial pra nunca encostar com força na borda da seção:

| Variante | O que é | Onde cabe |
|---|---|---|
| `rings` | anéis concêntricos — motivo de lente | hero, seções de prova |
| `dots` | malha de pontos | seções explicativas |
| `grid` | grade de linhas finas | seções de processo |
| `glow` | lavagem radial azul (cor, não textura) | topo do hero, área do formulário |

**Regras:**
- No máximo **uma textura** por seção (`glow` é lavagem de cor, pode acompanhar uma textura).
- **Nunca em duas seções seguidas.** Se tudo tem textura, nada tem — vira ruído.
- A `<section>` precisa de `relative overflow-hidden`, e o conteúdo interno de `relative`, senão a textura cobre o texto.

`rings` é o único ornamento da página que diz algo sobre o negócio (lente) em vez de só preencher espaço. Prefira ele quando a seção comportar.

## 4. Superfícies

No claro, **borda define o card, não sombra**:

```
border border-line bg-card rounded-xl
hover:border-line-strong           /* #D3DAE7 */
```

Sombra só em coisa que realmente flutua: header sticky, modal, dropdown, e o mockup do painel em 3D. Nesses casos, sombra difusa e de baixa opacidade — `shadow-[0_24px_60px_-24px_rgba(11,18,32,0.18)]`. Nunca `shadow-2xl` do Tailwind puro: é escura e dura demais no claro.

Raio: `rounded-xl` (12px) em card, `rounded-full` em pill/botão, `rounded-2xl` só no mockup de painel.

## 5. Motion

Easing único do projeto: `EASE_OUT_QUINT` = `cubic-bezier(0.22, 1, 0.36, 1)`. Já existe em `@/components/motion`.

- Entrada padrão: `opacity 0→1`, `y 20→0`, duração `0.6s`.
- Stagger em lista: `0.08s` entre itens. Consistente na página inteira.
- Hover de card: só a borda muda de cor, `240ms`. Sem levitar, sem escalar.
- Hover de botão: `translateY(-2px)` + sombra cresce, `320ms`.
- Parallax: só no mockup do painel, deslocamento máximo de 40px.

Respeite `prefers-reduced-motion` em tudo que se move sozinho.

## 6. As regras anti-IA

Isto é o que separa a página de um template gerado. Cada item abaixo apareceu na versão anterior ou é vício comum de LP feita por IA.

❌ **Gradiente em headline.** A versão antiga tinha `.text-gradient` em todo h2 — azul virando branco. É o tell número um. Headline é preta sólida com no máximo uma palavra em azul.

❌ **Roxo/violeta.** Não existe roxo nesta marca. Se aparecer `#8B5CF6`, `#A855F7` ou qualquer gradiente azul→roxo, está errado.

❌ **Glassmorphism no claro.** `backdrop-blur` sobre fundo branco não produz efeito nenhum, só deixa a borda suja. Só no header sticky.

❌ **Emoji em título.** Nem em card, nem em bullet, nem em CTA.

❌ **Card com fundo colorido.** Card é branco com borda. Destaque se faz com borda azul, não com fundo azul-claro.

❌ **Glow/neon.** A classe `.neon-glow` morre nesta versão. Sombra azul difusa atrás de card é estética de 2021.

❌ **Ícone genérico em círculo colorido repetido em toda seção.** Se três seções seguidas usam o mesmo padrão "círculo azul + ícone Lucide + título + parágrafo", a página vira lista. Varie a forma de apresentar.

❌ **Números redondos e vagos.** "Mais de 200 clientes satisfeitos" não prova nada. "+R$ 13 milhões em vendas geradas" prova. Número específico > número redondo.

❌ **Todo texto centralizado.**

✅ **O que abraçar:** número grande como elemento gráfico · print de tela real ao lado do texto que o descreve · borda de 1px separando seção em vez de divisor decorativo · assimetria 60/40 em seção explicativa · um único detalhe de baixo contraste que recompensa quem olha de perto.

## 7. Checklist antes de dar seção por pronta

- [ ] Zero hex hardcoded no JSX
- [ ] Azul só em CTA / ícone / número / uma palavra da headline
- [ ] Máximo 2 pesos de fonte na seção
- [ ] Parágrafo com `max-w-[65ch]`
- [ ] Card com borda, sem sombra (a menos que flutue de verdade)
- [ ] Easing e stagger iguais aos do resto da página
- [ ] Nenhum item da lista ❌ da seção 6
- [ ] Legível em 360px de largura
