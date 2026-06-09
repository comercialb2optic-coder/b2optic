import { motion } from 'framer-motion';
import { BlurFade, StaggerGroup, EASE_OUT_QUINT } from '@/components/motion';

interface CaseItem {
  id: number;
  videoId: string;
  oticaName: string;
}

const CASES: CaseItem[] = [
  { id: 1, videoId: 'RxmJEAwXWAQ', oticaName: 'Ótica Ipanema' },
  { id: 2, videoId: 'VfOnDZZUMwg', oticaName: 'Ótica Vitaliz' },
  { id: 3, videoId: '5z9TI2ATX40', oticaName: 'Ótica Brasil' },
  { id: 4, videoId: 'LCrl3aXCDCg', oticaName: 'Ótica Visão' },
  { id: 5, videoId: 'Y-deXtNVCfM', oticaName: 'Ótica Esquadra' },
];

export default function Cases() {
  return (
    <section
      id="cases"
      data-backdrop-theme="hero"
      className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="mb-6 flex justify-center">
            <span className="eyebrow">
              <span className="block h-px w-7 bg-primary/50" />
              Cases de sucesso
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.02em] leading-[1.05] text-gradient">
            Nossos resultados falam por si só
          </h2>
          <p className="mt-6 text-[16px] text-muted-foreground leading-relaxed">
            Donos de óticas contando, no formato deles, o que mudou depois do método B2Optic.
          </p>
        </motion.div>

        <StaggerGroup
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto"
          stagger={0.09}
        >
          {CASES.map((c) => (
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
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 aspect-[9/16] shadow-[0_20px_50px_-22px_rgba(0,0,0,0.7)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/22">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={`Case B2Optic — ${oticaName}`}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
      <span className="pointer-events-none absolute bottom-3 left-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 shadow-lg shadow-black/40 backdrop-blur-md">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="text-[12px] font-medium tracking-[-0.005em] leading-none text-white">
          {oticaName}
        </span>
      </span>
    </article>
  );
}
