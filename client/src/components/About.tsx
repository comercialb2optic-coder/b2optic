import { motion } from 'framer-motion';
import { UserRound } from 'lucide-react';
import { BlurFade, EASE_OUT_QUINT } from '@/components/motion';

export default function About() {
  return (
    <section
      id="about"
      data-backdrop-theme="form"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — photo placeholder */}
          <BlurFade>
            <PhotoPlaceholder />
          </BlurFade>

          {/* Right — content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT_QUINT }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="mb-6 flex">
              <span className="eyebrow">
                <span className="block h-px w-7 bg-primary/50" />
                Quem somos
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.025em] leading-[1.05] text-foreground mb-6">
              Não somos agência.<br />
              Somos <span className="text-primary">sócios</span> da sua ótica.
            </h2>

            <p className="text-[16px] text-muted-foreground leading-relaxed mb-5">
              A B2Optic nasceu pra resolver o problema real do dono de ótica: lead não paga conta — óculos paga. Por isso somos assessoria de marketing <em className="not-italic text-foreground/95">e vendas</em>, não agência de tráfego.
            </p>

            <p className="text-[16px] text-muted-foreground leading-relaxed mb-9">
              Nossa missão é uma só: fazer sua ótica vender mais óculos no balcão. Captação, estrutura comercial e treinamento — costurados pra esse único resultado, com risco assumido em contrato.
            </p>

            {/* Sign-off */}
            <div className="flex items-center gap-3 pt-6 border-t border-border">
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold tracking-[-0.005em] text-foreground">
                  [PREENCHER — Nome do fundador]
                </span>
                <span className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground mt-1">
                  Fundador · B2Optic
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PhotoPlaceholder() {
  return (
    <div className="relative aspect-[4/5] w-full max-w-[480px] mx-auto md:mx-0 overflow-hidden rounded-2xl border border-border bg-card/40">
      {/* Diagonal gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(145deg, rgba(0, 85, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(0, 0, 0, 0.3) 100%)',
        }}
      />

      {/* Corner accents */}
      <span className="pointer-events-none absolute left-5 top-5 h-3 w-3 border-l border-t border-primary/40" />
      <span className="pointer-events-none absolute right-5 top-5 h-3 w-3 border-r border-t border-primary/40" />
      <span className="pointer-events-none absolute bottom-5 left-5 h-3 w-3 border-b border-l border-primary/40" />
      <span className="pointer-events-none absolute bottom-5 right-5 h-3 w-3 border-b border-r border-primary/40" />

      {/* Center icon + label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-background/30 backdrop-blur-sm">
          <UserRound className="h-6 w-6 text-foreground/50" strokeWidth={1.5} />
        </div>
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
          [PREENCHER — foto do fundador]
        </span>
      </div>
    </div>
  );
}
