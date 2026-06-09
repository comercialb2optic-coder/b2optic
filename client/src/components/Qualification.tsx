import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT_QUINT } from '@/components/motion';

const OPCOES = [
  'Aumentar o retorno dos seus investimentos em anúncios e parar de queimar verba',
  'Atrair mais clientes qualificados e lotar a agenda da sua ótica',
  'Estruturar seu comercial pra vender mais óculos no balcão',
  'Automatizar o agendamento e o atendimento da sua ótica',
  'Ter criativos validados que realmente trazem movimento pra loja',
] as const;

export default function Qualification() {
  const [marcadas, setMarcadas] = useState<boolean[]>(
    () => OPCOES.map(() => false),
  );
  const reduce = useReducedMotion();

  const toggle = (i: number) =>
    setMarcadas((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const scrollToForm = () => {
    document
      .getElementById('form-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  // Stagger leve nos itens — só opacity/translateY, respeitando reduced-motion.
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE_OUT_QUINT },
    viewport: { once: true, margin: '-80px' },
  });

  return (
    <section
      id="qualification"
      className="relative bg-background py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Badge */}
        <motion.div className="mb-7 flex justify-center" {...rise(0)}>
          <span className="inline-flex items-center gap-2 rounded-md border border-primary/70 bg-primary/[0.16] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.20em] text-[#4D8AFF] drop-shadow-[0_0_6px_rgba(77,138,255,0.45)]">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(0,85,255,0.8)]"
            />
            Dúvida?
          </span>
        </motion.div>

        {/* Título */}
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-[52px] font-bold tracking-[-0.025em] leading-[1.08] mb-5"
          {...rise(0.08)}
        >
          <span className="text-gradient">
            Ainda na dúvida se a B2Optic é a escolha ideal pra sua ótica?
          </span>
        </motion.h2>

        {/* Instrução */}
        <motion.p
          className="text-[16px] sm:text-[17px] font-medium leading-relaxed text-foreground/80 mb-10 sm:mb-12"
          {...rise(0.16)}
        >
          Marque as alternativas que mais condizem com a sua necessidade atual:
        </motion.p>

        {/* Checklist */}
        <div className="space-y-3.5 sm:space-y-4 text-left">
          {OPCOES.map((texto, i) => {
            const ativo = marcadas[i];
            return (
              <motion.button
                key={i}
                type="button"
                role="checkbox"
                aria-checked={ativo}
                onClick={() => toggle(i)}
                className={`group flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left transition-[border-color,background-color] duration-300 ${
                  ativo
                    ? 'border-primary/45 bg-primary/[0.06]'
                    : 'border-border/60 bg-card/40 hover:border-white/15'
                }`}
                {...rise(0.24 + i * 0.07)}
              >
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-[border-color,background-color] duration-300 ${
                    ativo
                      ? 'border-primary bg-primary'
                      : 'border-border bg-transparent group-hover:border-white/25'
                  }`}
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`h-3.5 w-3.5 transition-opacity duration-200 ${
                      ativo ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <path
                      d="M3 8.5L6.5 12L13 4.5"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-[15px] sm:text-[16px] font-medium leading-relaxed text-foreground/90">
                  {texto};
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Fecho */}
        <motion.p
          className="mt-10 sm:mt-12 text-[17px] sm:text-[19px] font-medium leading-relaxed text-foreground/90 max-w-2xl mx-auto"
          {...rise(0.24 + OPCOES.length * 0.07)}
        >
          <span className="text-primary font-semibold">
            Se você marcou pelo menos 3 alternativas,
          </span>{' '}
          a B2Optic é exatamente o que a sua ótica precisa.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-9 flex justify-center"
          {...rise(0.32 + OPCOES.length * 0.07)}
        >
          <button type="button" onClick={scrollToForm} className="btn-primary">
            Quero falar com a B2
          </button>
        </motion.div>
      </div>
    </section>
  );
}
