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
      <div className="mx-auto max-w-7xl">
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
      <div className="relative">
        {/* Sem scroll-smooth no CSS de propósito: ele tornaria suave também o
            scroll de quem pediu "reduzir movimento". A suavidade fica no
            scrollBy, que consulta a preferência. */}
        <ul
          ref={trilhaRef}
          className="scroll-invisivel flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
        >
          {CASES_SECTION.items.map((c) => (
            <li
              key={c.id}
              className="w-[72%] shrink-0 snap-start sm:w-[46%] md:w-[32%] lg:w-[24%] xl:w-[20%]"
            >
              <CaseCard {...c} />
            </li>
          ))}
        </ul>

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

function CaseCard({ videoId, oticaName }: CaseItem) {
  return (
    <article className="elevated relative aspect-[9/16] overflow-hidden rounded-2xl border border-line bg-heading">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={`Case B2Optic — ${oticaName}`}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
      {/* Fica sobre o vídeo, então a pílula precisa do próprio contraste —
          é o único lugar da página com texto branco em fundo escuro fixo. */}
      <span className="pointer-events-none absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="text-[12px] font-medium leading-none text-white">
          {oticaName}
        </span>
      </span>
    </article>
  );
}
