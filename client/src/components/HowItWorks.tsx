import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { BlurFade, StaggerGroup, EASE_OUT_QUINT } from '@/components/motion';

const STEPS = [
  {
    number: '01',
    title: 'Preencha o formulário',
    body: '3 minutos de perguntas pra entendermos seu cenário e qualificar a aplicação.',
  },
  {
    number: '02',
    title: 'Receba contato em até 24h',
    body: 'Nosso time chama no WhatsApp pra agendar a reunião de diagnóstico — sem custo, sem compromisso.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-backdrop-theme="form"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
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
              Como funciona
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.02em] leading-[1.05] text-foreground">
            Dois passos pra falar com a B2Optic
          </h2>
        </motion.div>

        <div className="relative">
          <StaggerGroup
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14"
            stagger={0.1}
          >
            {STEPS.map((step) => (
              <BlurFade key={step.number}>
                <article className="rounded-2xl border border-border bg-card/40 p-7 sm:p-9 h-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/22 hover:bg-card/60">
                  <span className="block text-[44px] sm:text-[52px] font-semibold tracking-[-0.04em] leading-none text-primary/40 mb-6 tabular-nums">
                    {step.number}
                  </span>
                  <h3 className="mb-3 text-xl font-semibold tracking-[-0.01em] text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </article>
              </BlurFade>
            ))}
          </StaggerGroup>

          {/* Connector — desktop only */}
          <div
            aria-hidden
            className="pointer-events-none hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2"
          >
            <div className="h-px w-12 bg-gradient-to-r from-border via-primary/60 to-border" />
            <ChevronRight className="h-3.5 w-3.5 text-primary/60" strokeWidth={2} />
          </div>
        </div>
      </div>
    </section>
  );
}
