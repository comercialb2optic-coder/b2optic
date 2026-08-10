---
name: b2optic-qa
description: Como verificar que uma mudança na LP da B2Optic realmente funciona — tipos, checagem visual no navegador, responsivo, formulário, acessibilidade e performance. Ler ANTES de dizer que uma seção está pronta.
---

# QA — LP B2Optic

Regra que vale mais que todas: **não diga que está pronto sem ter visto rodando.** `pnpm check` passar significa que os tipos batem, não que a seção está certa. Página só se valida com olho na tela.

## 1. Estado atual do teste automatizado

Este projeto **não tem test runner**. Não há vitest, jest nem playwright instalados.

Isso é uma escolha em aberto, não um esquecimento. Para uma LP de página única, o retorno de teste unitário é baixo — o que quebra é layout, contraste e envio de formulário, e isso teste unitário não pega. As duas coisas que valeriam automação:

1. **Teste de envio do formulário** (validação Zod por etapa + payload correto) → `vitest`
2. **Teste visual de regressão** em 3 larguras → `playwright`

Instalar qualquer um dos dois é decisão do dono do projeto. **Pergunte antes.** Até lá, a verificação é a rotina manual abaixo, que é obrigatória.

## 2. Rotina mínima (toda mudança)

```bash
pnpm check     # tipos
pnpm dev       # sobe em http://localhost:3000
```

Com o dev server no ar, abra no navegador e confira a seção que você mexeu. Não confie em "o código parece certo".

## 3. Responsivo — as 3 larguras

Teste sempre nestas, nesta ordem:

| Largura | O que costuma quebrar |
|---|---|
| **360px** | headline estourando, card cortado, texto truncado com "...", botão saindo da tela |
| **768px** | grid que não colapsa direito, imagem esticada, espaçamento colado |
| **1440px** | conteúdo esparramado sem `max-w`, texto com linha longa demais, seção vazia no meio |

360px é o que mais pega problema e é a largura onde está a maior parte do tráfego de Meta Ads. Comece por ela.

Checagens:
- [ ] Nenhum scroll horizontal em nenhuma largura
- [ ] Nenhum texto truncado com reticências por falta de espaço
- [ ] Card mantém padding interno mínimo de 24px
- [ ] Botão de CTA com no mínimo 44px de altura (alvo de toque)

## 4. Contraste

O tema é claro — o erro fácil é texto cinza-claro sobre branco.

- Texto normal: mínimo **4,5:1**
- Texto grande (≥24px ou ≥19px bold): mínimo **3:1**

Pontos de atenção conhecidos:
- `--muted-foreground` (`#6B7385`) sobre branco: **5,2:1** ✅
- `--primary` (`#0055FF`) sobre branco: **5,6:1** ✅
- `--primary` sobre o fundo escuro (`#080B14`): **3,5:1** ❌ — no bloco escuro, texto azul usa `--primary-on-dark`
- Placeholder de input: precisa passar 4,5:1 também. Placeholder apagado demais é falha de acessibilidade, não estética.

## 5. Formulário — o teste que mais importa

É a única coisa na página que pode custar dinheiro se quebrar. Percorra o fluxo inteiro:

- [ ] Etapa 1 → 2 → 3 avança e volta sem perder o que foi preenchido
- [ ] Tentar avançar com campo vazio bloqueia e mostra a mensagem certa
- [ ] Erro de campo some ao corrigir
- [ ] Botão de envio desabilita durante o envio (sem duplo clique gerando dois leads)
- [ ] **Sucesso real:** conferir que o lead chegou no destino, não só que a tela de sucesso apareceu
- [ ] **Falha de rede:** com o webhook fora do ar, mostra erro visível e permite tentar de novo — nunca engole o erro nem mostra sucesso falso
- [ ] Teclado: dá pra preencher tudo com Tab e Enter
- [ ] No celular, campo de telefone abre teclado numérico (`inputMode="tel"`)

Para testar falha de rede, aponte `VITE_LEAD_WEBHOOK_URL` para uma URL inválida e recarregue.

## 6. Acessibilidade básica

- [ ] Toda `<img>` com `alt` descritivo (logo de cliente: nome da ótica; imagem decorativa: `alt=""`)
- [ ] Hierarquia de heading sem pular nível — um `h1` na página, seções em `h2`
- [ ] Foco visível em todo elemento interativo
- [ ] `prefers-reduced-motion` respeitado no que se move sozinho (carrossel, parallax, orbital)
- [ ] Vídeo não dá autoplay com som

## 7. Performance

Alvo: **Lighthouse mobile 90+**. O tráfego vem de anúncio no celular; cada segundo derruba conversão.

- [ ] Imagem em WebP quando possível
- [ ] `loading="lazy"` em tudo abaixo da dobra
- [ ] `width` e `height` explícitos em imagem (evita layout shift)
- [ ] Print do painel do CRM comprimido — é a imagem mais pesada da página
- [ ] Nenhum vídeo com `autoplay` carregando na dobra inicial

## 8. Antes de entregar

- [ ] `pnpm check` limpo
- [ ] Visto rodando no navegador, não só no código
- [ ] 360 / 768 / 1440 conferidos
- [ ] Fluxo do formulário percorrido inteiro
- [ ] Checklist da skill `b2optic-design` (seção 7) passado
- [ ] Se algo ficou por fazer, dito explicitamente — não deixe implícito
