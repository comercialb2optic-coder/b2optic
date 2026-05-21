import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { BlurFade, StaggerGroup, EASE_OUT_QUINT } from '@/components/motion';

interface CaseItem {
  id: number;
  oticaName: string;
  outcome: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

const CASES: CaseItem[] = [
  {
    id: 1,
    oticaName: '[PREENCHER — nome ótica 1]',
    outcome: '[PREENCHER — resultado em 1 linha]',
  },
  {
    id: 2,
    oticaName: '[PREENCHER — nome ótica 2]',
    outcome: '[PREENCHER — resultado em 1 linha]',
  },
  {
    id: 3,
    oticaName: '[PREENCHER — nome ótica 3]',
    outcome: '[PREENCHER — resultado em 1 linha]',
  },
  {
    id: 4,
    oticaName: '[PREENCHER — nome ótica 4]',
    outcome: '[PREENCHER — resultado em 1 linha]',
  },
  {
    id: 5,
    oticaName: '[PREENCHER — nome ótica 5]',
    outcome: '[PREENCHER — resultado em 1 linha]',
  },
  {
    id: 6,
    oticaName: '[PREENCHER — nome ótica 6]',
    outcome: '[PREENCHER — resultado em 1 linha]',
  },
];

export default function Cases() {
  return (
    <section
      id="cases"
      data-backdrop-theme="hero"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16 sm:mb-20 max-w-2xl mx-auto"
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
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.02em] leading-[1.05] text-foreground">
            Nossos resultados falam por nós
          </h2>
          <p className="mt-6 text-[16px] text-muted-foreground leading-relaxed">
            Donos de óticas contando, no formato deles, o que mudou depois do método B2Optic.
          </p>
        </motion.div>

        <StaggerGroup
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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

function CaseCard({ oticaName, outcome }: CaseItem) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 aspect-[9/16] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/22 hover:bg-card/60 cursor-pointer">
      {/* Placeholder thumbnail — diagonal gradient + play */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(0, 85, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />

      {/* Play button — center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-background/50 backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-primary/40 group-hover:bg-primary/10">
          <Play className="h-5 w-5 translate-x-0.5 text-foreground/85" strokeWidth={1.5} />
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-5 pb-6 bg-gradient-to-t from-background via-background/85 to-transparent">
        <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-primary/85 mb-2">
          Cliente B2Optic
        </span>
        <h3 className="mb-1.5 text-[15px] font-semibold tracking-[-0.01em] text-foreground leading-tight">
          {oticaName}
        </h3>
        <p className="text-[13px] leading-snug text-muted-foreground">
          {outcome}
        </p>
      </div>
    </article>
  );
}
