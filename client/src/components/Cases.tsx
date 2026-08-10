import { motion } from 'framer-motion';
import { BlurFade, StaggerGroup, EASE_OUT_QUINT } from '@/components/motion';
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

        <StaggerGroup
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-5"
          stagger={0.09}
        >
          {CASES_SECTION.items.map((c) => (
            <BlurFade key={c.id}>
              <CaseCard {...c} />
            </BlurFade>
          ))}
        </StaggerGroup>
      </div>
    </section>
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
