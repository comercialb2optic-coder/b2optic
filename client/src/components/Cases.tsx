import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BlurFade, EASE_OUT_QUINT } from '@/components/motion';
import { CASES_SECTION } from '@/content';

type CaseItem = (typeof CASES_SECTION.items)[number];

export default function Cases() {
  return (
    <section
      id="cases"
      className="bg-surface px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <motion.header
          className="mx-auto mb-14 max-w-2xl text-center sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="mb-5 flex justify-center">
            <span className="eyebrow">
              <span className="block h-px w-7 bg-primary/50" />
              {CASES_SECTION.eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px]">
            {CASES_SECTION.title}
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-[16px] leading-relaxed text-foreground">
            {CASES_SECTION.subtitle}
          </p>
        </motion.header>

        <CasesCarousel />
      </div>
    </section>
  );
}

function CasesCarousel() {
  const trilhaRef = useRef<HTMLUListElement | null>(null);
  const reduced = useReducedMotion();
  const [temAnterior, setTemAnterior] = useState(false);
  const [temProximo, setTemProximo] = useState(true);

  // Uma borda de folga: navegador arredonda scrollLeft e o "fim" quase nunca
  // bate exato no máximo, o que deixaria a seta da direita acesa para sempre.
  const atualizarSetas = useCallback(() => {
    const el = trilhaRef.current;
    if (!el) return;
    const folga = 8;
    setTemAnterior(el.scrollLeft > folga);
    setTemProximo(el.scrollLeft < el.scrollWidth - el.clientWidth - folga);
  }, []);

  useEffect(() => {
    const el = trilhaRef.current;
    if (!el) return;
    atualizarSetas();
    el.addEventListener('scroll', atualizarSetas, { passive: true });
    window.addEventListener('resize', atualizarSetas);
    return () => {
      el.removeEventListener('scroll', atualizarSetas);
      window.removeEventListener('resize', atualizarSetas);
    };
  }, [atualizarSetas]);

  // Anda um card por clique. A largura vem do próprio card em vez de um número
  // fixo, então continua certo em qualquer breakpoint.
  function mover(direcao: 1 | -1) {
    const el = trilhaRef.current;
    if (!el) return;
    const card = el.querySelector('li');
    const passo = card
      ? card.getBoundingClientRect().width + 20
      : el.clientWidth * 0.8;
    el.scrollBy({
      left: passo * direcao,
      behavior: reduced ? 'auto' : 'smooth',
    });
  }

  return (
    <BlurFade>
      <div>
        {/* Sem scroll-smooth no CSS de propósito: ele tornaria suave também o
            scroll de quem pediu "reduzir movimento". A suavidade fica no
            scrollBy, que consulta a preferência. */}
        <div className="relative">
          <ul
            ref={trilhaRef}
            className="scroll-invisivel flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3"
          >
            {CASES_SECTION.items.map((c) => (
              <li
                key={c.id}
                className="w-[74%] shrink-0 snap-start sm:w-[47%] md:w-[33%] lg:w-[26%] xl:w-[22%]"
              >
                <CaseCard {...c} />
              </li>
            ))}
          </ul>

          {/* Véus nas bordas: o card que fica meio de fora deixa de terminar
              num corte reto e vira um degradê para o fundo da seção — é isso
              que mostra que a trilha continua. Cada véu só acende do lado que
              ainda tem card escondido. */}
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-surface to-transparent transition-opacity duration-300 sm:w-14 ${
              temAnterior ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-surface to-transparent transition-opacity duration-300 sm:w-14 ${
              temProximo ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Setas abaixo da trilha, não sobre ela — sobrepor cobriria justamente
            o vídeo, que é o conteúdo. No toque o gesto já resolve, então elas
            existem para mouse e teclado. */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <BotaoCarrossel
            rotulo="Ver cases anteriores"
            ativo={temAnterior}
            onClick={() => mover(-1)}
            direcao="anterior"
          />
          <BotaoCarrossel
            rotulo="Ver mais cases"
            ativo={temProximo}
            onClick={() => mover(1)}
            direcao="proximo"
          />
        </div>
      </div>
    </BlurFade>
  );
}

function BotaoCarrossel({
  rotulo,
  ativo,
  onClick,
  direcao,
}: {
  rotulo: string;
  ativo: boolean;
  onClick: () => void;
  direcao: 'anterior' | 'proximo';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!ativo}
      aria-label={rotulo}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-background text-heading transition-[opacity,border-color,background-color] duration-200 hover:border-line-strong disabled:cursor-default disabled:opacity-35"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direcao === 'anterior' ? (
          <path d="M15 19l-7-7 7-7" />
        ) : (
          <path d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

/**
 * `oardefault.jpg` é a capa do YouTube na proporção ORIGINAL do vídeo — 720x1280
 * ou 1080x1920 nos cases. É por isso que ela preenche o card 9/16 sem tarja
 * preta, o que nenhuma das capas padrão (todas 4:3 ou 16:9) faria.
 * `hqdefault.jpg` entra como reserva: existe sempre, e `object-cover` no card
 * vertical recorta justamente a faixa central onde o vídeo está.
 */
const capaOriginal = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/oardefault.jpg`;
const capaReserva = (videoId: string) =>
  `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

/**
 * O card abre como pôster e só monta o iframe no clique.
 *
 * Isso tira da tela o botão vermelho gigante e a barra de título do YouTube —
 * era o que fazia a fileira parecer uma playlist embutida em vez de uma seção
 * da página — e ainda resolve o peso: os embeds carregavam todos de uma vez,
 * cada um puxando o player inteiro.
 *
 * O desenho do pôster: capa sangrando no card, véu escuro só no pé (onde os
 * vídeos têm legenda queimada, que sem isso briga com o nome da ótica) e o play
 * de vidro na mesma linha do nome. Play no meio cobria justamente o rosto de
 * quem dá o depoimento, que é o que vende o case.
 */
function CaseCard({ videoId, oticaName }: CaseItem) {
  const [tocando, setTocando] = useState(false);

  if (tocando) {
    return (
      <article className="elevated relative aspect-[9/16] overflow-hidden rounded-[22px] bg-heading ring-1 ring-black/5">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
          title={`Case B2Optic — ${oticaName}`}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </article>
    );
  }

  return (
    <article className="elevated group relative aspect-[9/16] overflow-hidden rounded-[22px] bg-heading ring-1 ring-black/5 transition-shadow duration-300">
      <button
        type="button"
        onClick={() => setTocando(true)}
        aria-label={`${CASES_SECTION.playLabel} ${oticaName}`}
        className="absolute inset-0 h-full w-full focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
      >
        {/* O leve zoom no hover é a única coisa que se move: a regra da página é
            trocar estado sem levitar o card. */}
        <img
          src={capaOriginal(videoId)}
          alt=""
          loading="lazy"
          draggable={false}
          onError={(e) => {
            e.currentTarget.src = capaReserva(videoId);
          }}
          className="absolute inset-0 h-full w-full scale-[1.01] object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
        />

        {/* Dois véus: um fino no topo, que apaga a marca queimada no canto de
            alguns vídeos, e um alto no pé, que segura o texto e some com a
            legenda do Shorts. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-black/35 to-transparent"
        />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/90 via-black/45 to-transparent"
        />

        {/* Aro azul no hover, por dentro da borda — dá o feedback de "clicável"
            sem mexer no tamanho nem na sombra do card. */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-[22px] ring-1 ring-inset ring-white/0 transition-colors duration-300 group-hover:ring-white/25"
        />

        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 pb-4">
          <span className="min-w-0 text-left">
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="h-1 w-1 shrink-0 rounded-full bg-primary-on-dark"
              />
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/65">
                {CASES_SECTION.cardKicker}
              </span>
            </span>
            <span className="mt-1 line-clamp-2 block text-[15px] font-medium leading-tight text-white">
              {oticaName}
            </span>
          </span>

          {/* Play de vidro, do tamanho de um botão de verdade. Vira azul da
              marca no hover — mesma gramática dos outros controles da página. */}
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-inset ring-white/50 backdrop-blur-md transition-colors duration-240 group-hover:bg-primary group-hover:ring-primary"
          >
            <svg
              viewBox="0 0 24 24"
              className="ml-0.5 h-[18px] w-[18px]"
              fill="currentColor"
            >
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        </span>
      </button>
    </article>
  );
}
