---
name: b2optic-copy
description: Voz, estrutura de headline e regras de prova para os textos da LP da B2Optic. Ler ANTES de escrever qualquer headline, subtítulo, texto de card, label de campo ou CTA da página.
---

# Copy — LP B2Optic

## 1. Quem lê

Dono de ótica, 35-60 anos, fatura de R$30k a R$500k/mês. Provavelmente já foi queimado por agência de tráfego. Não tem intimidade técnica — mas identifica na hora se a marca é séria ou amadora.

O que ele pensa enquanto lê:
- "Já contratei agência e não deu em nada."
- "Vão me trazer lead que não vira venda no balcão."
- "Não tenho tempo pra virar especialista em marketing."
- "Quanto custa e quando eu vejo dinheiro?"

Toda seção precisa responder uma dessas. Se não responde nenhuma, ela não deveria existir.

## 2. Voz

**É:** direto, concreto, seguro. Fala de dinheiro e de balcão. Frase curta. Verbo no presente.

**Não é:** jargão de marketing ("ecossistema omnichannel de performance"), superlativo vazio ("a melhor solução do mercado"), motivacional ("chegou a hora de transformar seu negócio"), nem infantilizado.

Português do Brasil, coloquial mas não gíria. Tratamento por "você". Pode usar contração natural ("tá", "pra") em texto de apoio; em headline, escreva por extenso.

Escreva "ótica", não "óptica". A marca é B2Optic com C.

### Termos

| Use | Não use |
|---|---|
| vender mais no balcão | aumentar o faturamento |
| lead que aparece na loja | lead qualificado (sozinho, sem explicar) |
| a gente monta / a gente cuida | nós disponibilizamos |
| em até 12 horas | rapidamente |
| método | solução inovadora |
| aceleradora de vendas | agência de tráfego |

## 3. Headline

Fórmula base: **[resultado concreto] + [para quem] + [sem o custo que ele teme]**

- ✅ "Sua ótica vendendo mais no balcão, sem você virar gestor de tráfego."
- ✅ "A gente traz o cliente certo. Sua equipe fecha a venda."
- ❌ "Transformando o futuro do varejo óptico com inteligência."

Regras:
- Máximo 9 palavras em H1.
- No máximo **uma** palavra ou expressão destacada em azul, e ela carrega o significado — nunca destaque conectivo.
- H2 de seção diz o que a seção entrega, não anuncia que ela existe. "O que acontece nos primeiros 30 dias" > "Nosso processo".
- Sem pergunta retórica como headline principal.
- Sem dois pontos no meio da headline.

## 4. Prova

**Número específico bate número redondo.** "+R$ 13 milhões em vendas geradas" prova; "centenas de clientes satisfeitos" não.

**Fonte única de verdade.** Todo número da página sai de `client/src/content.ts`. Nunca escreva número solto no JSX.

(`client/src/const.ts` é sobra de template — helper de OAuth, não mexa nele.)

> ⚠️ A versão anterior tinha contradição na mesma página: a seção Números dizia "+40 óticas / +R$ 3 milhões" e o texto do Sobre dizia "+200 óticas / +R$ 13 milhões". Isso destrói credibilidade em público que já desconfia. Antes de publicar qualquer número, confirme qual é o real.

Hierarquia de prova, da mais forte pra mais fraca:
1. Depoimento em vídeo do dono, com nome da ótica
2. Print de painel real com métrica
3. Número agregado da operação
4. Logo de cliente
5. Adjetivo ("melhor", "líder") — vale zero, não use

## 5. CTA

- Primeira pessoa, o que ELE ganha: "Quero meu diagnóstico gratuito" > "Enviar".
- Verbo no infinitivo só em botão secundário.
- Diga o custo de tempo: "Leva 1 minuto".
- Diga o que acontece depois: "Um especialista liga em até 12h".
- Nunca "Saiba mais" nem "Clique aqui".
- O mesmo CTA principal se repete na página; não invente variação nova a cada seção — repetir cria memória.

## 6. Formulário

- Label acima do campo, curto, sem dois pontos.
- Placeholder mostra formato, não repete o label. Label "WhatsApp", placeholder "(47) 99999-9999".
- Erro diz o que fazer: "Informe o nome da sua ótica", não "Campo inválido".
- Botão de etapa intermediária: "Continuar". Botão final: o CTA de valor.
- Tela de sucesso diz o próximo passo concreto e quando: "Pronto. Um especialista liga no seu WhatsApp em até 12 horas." Nunca só "Enviado com sucesso".

## 7. Antes de dar o texto por pronto

- [ ] Responde a uma das 4 objeções da seção 1
- [ ] Nenhum número que contradiga `content.ts`
- [ ] Nenhum superlativo sem prova ao lado
- [ ] H1 com 9 palavras ou menos
- [ ] Uma única palavra destacada por headline
- [ ] CTA diz o que ele ganha e o que acontece depois
- [ ] Lido em voz alta, soa como pessoa falando
