import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const benefits = [
  'Especialistas no segmento óptico à sua disposição',
  'Uma equipe altamente qualificada e dedicada',
  'Um plano personalizado para sua ótica específica',
  'Comunidade com vários donos de óticas parceiras',
  'Encontros online e presenciais para troca de experiências',
  'Resultado garantido em contrato',
];

export default function Guarantee() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="mb-6 flex">
              <span className="eyebrow">
                <span className="block h-px w-7 bg-primary/50" />
                Garantia
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.025em] leading-[1.05] text-foreground mb-6">
              Garantia de Resultado com <span className="text-primary">Risco Zero</span>
            </h2>

            <p className="text-[16px] text-muted-foreground mb-10 leading-relaxed max-w-xl">
              Você só paga se obtiver retorno com nosso trabalho. Essa não é uma promessa vazia — é um contrato. Somos a única aceleradora de óticas que coloca sua confiança em primeiro lugar e assume o risco por você. Porque não somos uma agência comum.
            </p>

            {/* Benefit list */}
            <ul className="space-y-3.5">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.07, ease: EASE_OUT }}
                  viewport={{ once: true, margin: '-60px' }}
                >
                  <span
                    className="mt-[3px] inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-sm border border-primary/30 bg-primary/10"
                    aria-hidden
                  >
                    <Check className="h-3 w-3 text-primary" strokeWidth={2.5} />
                  </span>
                  <span className="text-[15px] leading-relaxed text-foreground/85">
                    {benefit}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Visual — Credencial */}
          <motion.div
            className="relative aspect-[4/5] w-full max-w-[440px] mx-auto md:mx-0 md:ml-auto overflow-hidden rounded-2xl border border-border bg-card/50 p-7 sm:p-9"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            {/* Noise texture overlay */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07] mix-blend-screen"
              aria-hidden
            >
              <filter id="credencial-grain">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.85"
                  numOctaves="2"
                  stitchTiles="stitch"
                />
                <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#credencial-grain)" />
            </svg>

            {/* Corner accents */}
            <span className="pointer-events-none absolute left-5 top-5 h-3 w-3 border-l border-t border-primary/50" />
            <span className="pointer-events-none absolute right-5 top-5 h-3 w-3 border-r border-t border-primary/50" />
            <span className="pointer-events-none absolute bottom-5 left-5 h-3 w-3 border-b border-l border-primary/50" />
            <span className="pointer-events-none absolute bottom-5 right-5 h-3 w-3 border-b border-r border-primary/50" />

            {/* Top row */}
            <div className="relative flex items-start justify-between text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span>B2Optic · Contrato</span>
              <span>Nº 0001 / 26</span>
            </div>

            {/* Center: title */}
            <div className="relative mt-10 sm:mt-14">
              <span className="eyebrow">
                <span className="block h-px w-5 bg-primary/50" />
                Garantia contratual
              </span>
              <h3 className="mt-4 text-3xl sm:text-[32px] font-semibold tracking-[-0.025em] leading-[1.04] text-foreground">
                Risco assumido<br />pela B2Optic.
              </h3>
              <p className="mt-5 text-[13px] text-muted-foreground leading-relaxed max-w-[26ch]">
                Você só paga se obtiver retorno. Está em contrato.
              </p>
            </div>

            {/* Bottom: signature */}
            <div className="absolute inset-x-7 bottom-7 sm:inset-x-9 sm:bottom-9">
              <svg
                viewBox="0 0 160 32"
                fill="none"
                aria-hidden
                className="mb-2 h-7 text-primary"
              >
                <path
                  d="M3 22 C 12 4, 22 28, 32 12 C 40 0, 48 24, 60 14 C 72 4, 80 26, 94 14 C 108 2, 122 22, 140 10 C 148 5, 154 12, 157 8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="h-px w-28 bg-border" />
              <div className="mt-2.5 flex items-baseline justify-between gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <span>Equipe B2Optic</span>
                <span className="flex items-center gap-1.5">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  Selado
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
