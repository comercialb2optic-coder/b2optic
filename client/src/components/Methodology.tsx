import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { useRef, useState } from 'react';
import { BlurFade, EASE_OUT_QUINT, useIsMobile } from '@/components/motion';

const STEPS = [
  {
    number: '01',
    label: 'CAPTAÇÃO',
    body: 'Anúncios de exame de vista + triagem de 3 perguntas (já usa óculos? prioridade pro exame? quer comprar óculos depois?) entregam lead qualificado.',
  },
  {
    number: '02',
    label: 'AGENDAMENTO',
    body: 'CRM próprio + IA de atendimento agendam o exame automaticamente — sem perder venda por demora na resposta.',
  },
  {
    number: '03',
    label: 'CONVERSÃO',
    body: 'Vendedoras treinadas com método sob medida fecham a venda do óculos no balcão. Atendimento consultivo, não roteiro.',
  },
  {
    number: '04',
    label: 'GESTÃO',
    body: 'App de acompanhamento de vendas e métricas em tempo real + ferramentas pra otimizar o que funciona.',
  },
];

const ARC_PATHS = [
  'M 460 170 C 580 170, 610 250, 510 290',
  'M 510 430 C 610 470, 580 550, 460 550',
  'M 260 550 C 140 550, 110 470, 210 430',
  'M 210 290 C 110 250, 140 170, 260 170',
];

const CARD_POS = [
  { top: 30, left: 260 },
  { top: 290, left: 510 },
  { top: 540, left: 260 },
  { top: 290, left: 10 },
] as const;

const CARD_WINDOWS: Array<[number, number]> = [
  [0, 0.18],
  [0.22, 0.4],
  [0.44, 0.62],
  [0.66, 0.84],
];

const ARC_WINDOWS: Array<[number, number]> = [
  [0.05, 0.22],
  [0.29, 0.46],
  [0.53, 0.7],
  [0.76, 0.92],
];

export default function Methodology() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  return (
    <section
      data-backdrop-theme="guarantee"
      className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <Header />
      {isMobile || reduced ? <MobileTimeline /> : <DesktopCycle />}
    </section>
  );
}

function Header() {
  return (
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
          Metodologia B2Optic
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.02em] leading-[1.05] text-foreground">
        O ciclo que faz sua ótica vender mais óculos
      </h2>
      <p className="mt-6 text-[16px] text-muted-foreground leading-relaxed">
        Captação, agendamento, conversão e gestão — costurados num ciclo previsível.
      </p>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────
// DESKTOP — circular cycle with scroll-linked reveals
// ────────────────────────────────────────────────────────

function DesktopCycle() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [logoError, setLogoError] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef as React.RefObject<HTMLElement>,
    offset: ['start 75%', 'start 15%'],
  });

  return (
    <div
      ref={sectionRef}
      className="relative mx-auto"
      style={{ width: 720, height: 720, maxWidth: '100%' }}
    >
      {/* SVG arcs + center logo */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        viewBox="0 0 720 720"
        fill="none"
        aria-hidden
      >
        {ARC_PATHS.map((d, i) => (
          <ScrollArc
            key={i}
            d={d}
            progress={scrollYProgress}
            range={ARC_WINDOWS[i]}
          />
        ))}

        {/* Logo backdrop circle */}
        <circle
          cx="360"
          cy="360"
          r="64"
          fill="rgba(0, 85, 255, 0.06)"
          stroke="rgba(0, 85, 255, 0.3)"
          strokeWidth="1"
        />
      </svg>

      {/* Logo placeholder (HTML, overlay center) */}
      <div
        className="absolute"
        style={{
          top: 'calc(50% - 56px)',
          left: 'calc(50% - 56px)',
          width: 112,
          height: 112,
        }}
      >
        {!logoError ? (
          <img
            src="/b2optic-logo.png"
            alt="B2Optic"
            className="h-full w-full object-contain"
            onError={() => setLogoError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full">
            <span className="text-[34px] font-bold tracking-[-0.04em] leading-none">
              <span className="text-primary">B2</span>
              <span className="text-foreground/85">Optic</span>
            </span>
          </div>
        )}
      </div>

      {/* Cards */}
      {STEPS.map((step, i) => (
        <ScrollCard
          key={step.number}
          step={step}
          pos={CARD_POS[i]}
          progress={scrollYProgress}
          range={CARD_WINDOWS[i]}
        />
      ))}
    </div>
  );
}

function ScrollArc({
  d,
  progress,
  range,
}: {
  d: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const pathLength = useTransform(progress, range, [0, 1]);
  return (
    <motion.path
      d={d}
      stroke="rgba(0, 85, 255, 0.5)"
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{ pathLength }}
    />
  );
}

function ScrollCard({
  step,
  pos,
  progress,
  range,
}: {
  step: (typeof STEPS)[number];
  pos: (typeof CARD_POS)[number];
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.25, 1]);
  const scale = useTransform(progress, range, [0.96, 1]);

  return (
    <motion.article
      className="absolute rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-5 transform-gpu will-change-transform"
      style={{
        top: pos.top,
        left: pos.left,
        width: 200,
        height: 140,
        opacity,
        scale,
      }}
    >
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Passo {step.number}
        </span>
      </div>
      <h3 className="mb-2 text-[15px] font-semibold tracking-[-0.01em] text-foreground">
        {step.label}
      </h3>
      <p className="text-[12.5px] leading-[1.45] text-muted-foreground line-clamp-3">
        {step.body}
      </p>
    </motion.article>
  );
}

// ────────────────────────────────────────────────────────
// MOBILE — vertical timeline with scroll-linked fill
// ────────────────────────────────────────────────────────

function MobileTimeline() {
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef as React.RefObject<HTMLElement>,
    offset: ['start 80%', 'end 60%'],
  });

  return (
    <div ref={timelineRef} className="max-w-2xl mx-auto relative">
      {/* Static line (bg) */}
      <div className="absolute left-[23px] top-2 bottom-2 w-px bg-border" />

      {/* Animated line (foreground) — scroll-linked scaleY, transform-only */}
      <motion.div
        className="absolute left-[23px] top-2 bottom-2 w-px bg-primary/70 origin-top transform-gpu will-change-transform"
        style={{ scaleY: scrollYProgress }}
      />

      {/* Steps */}
      <ul className="space-y-10 pl-16">
        {STEPS.map((step, i) => (
          <BlurFade key={step.number} delay={i * 0.08}>
            <li className="relative">
              <span className="absolute -left-[60px] top-0 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-card/80 backdrop-blur-sm text-[12px] font-semibold tracking-tight text-primary">
                {step.number}
              </span>
              <div className="pt-1.5">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-2.5">
                  {step.label}
                </h3>
                <p className="text-[15px] leading-relaxed text-foreground/85">
                  {step.body}
                </p>
              </div>
            </li>
          </BlurFade>
        ))}
      </ul>
    </div>
  );
}
