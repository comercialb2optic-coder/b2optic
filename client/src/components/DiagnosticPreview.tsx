import { motion, useReducedMotion } from 'framer-motion';
import { type CSSProperties } from 'react';
import { EASE_OUT_QUINT } from '@/components/motion';

const ITEMS = [
  {
    index: '01',
    title: 'Entendendo onde você está',
    body: 'Começamos com uma análise completa da sua situação atual e juntos identificamos os desafios e os gargalos que estão limitando seu crescimento.',
  },
  {
    index: '02',
    title: 'O que sua ótica realmente precisa',
    body: 'Depois de entendermos onde sua ótica está, iremos te mostrar exatamente o que precisa ser feito e qual o próximo passo que sua ótica precisa dar.',
  },
  {
    index: '03',
    title: 'Plano de ação estratégico',
    body: 'Além de te dar o próximo passo, vamos criar um plano de ação estratégico para você aumentar a demanda qualificada e aumentar o número de vendas na sua ótica.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const BORDER_GLOW_STYLE: CSSProperties = {
  background:
    'radial-gradient(240px circle at 50% 0%, rgba(0, 85, 255, 0.55), transparent 72%)',
  padding: '1px',
  WebkitMask:
    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor',
  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  maskComposite: 'exclude',
};

interface DiagnosticCardProps {
  item: (typeof ITEMS)[number];
  index: number;
  reduced: boolean;
}

function DiagnosticCard({ item, index, reduced }: DiagnosticCardProps) {
  return (
    <motion.article
      className="group relative h-full overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.04] p-7 sm:p-9 shadow-[0_28px_60px_-26px_rgba(0,0,0,0.75),0_0_20px_-2px_rgba(0,85,255,0.16),inset_0_0_12px_-4px_rgba(0,85,255,0.14)] transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-primary/45 hover:shadow-[0_32px_80px_-24px_rgba(0,85,255,0.32),0_22px_50px_-20px_rgba(0,0,0,0.65),0_0_32px_-2px_rgba(0,85,255,0.30),inset_0_0_18px_-4px_rgba(0,85,255,0.22)] transform-gpu will-change-transform"
      variants={cardVariants}
      initial={reduced ? false : 'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE_OUT_QUINT }}
      whileHover={reduced ? undefined : { y: -3 }}
    >
      {/* Always-on border glow — pulso muito lento */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={BORDER_GLOW_STYLE}
        initial={{ opacity: 0.7 }}
        animate={reduced ? { opacity: 0.7 } : { opacity: [0.55, 0.9, 0.55] }}
        transition={
          reduced
            ? undefined
            : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      {/* Top reflex */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-2xl bg-gradient-to-b from-white/[0.07] to-transparent"
      />

      {/* Passo badge — TESTE azul mais vibrante. Reverter: border-primary/45, bg-primary/[0.06], text-primary, dot sem shadow. */}
      <span className="relative inline-flex items-center gap-2 rounded-md border border-primary/70 bg-primary/[0.16] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.20em] text-[#4D8AFF] drop-shadow-[0_0_6px_rgba(77,138,255,0.45)]">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(0,85,255,0.8)]" />
        Passo {item.index}
      </span>

      {/* Title em primary + body */}
      {/* Título do passo — TESTE branco→prata→azul. Reverter trocando "text-gradient-card" por "text-gradient". */}
      <h3 className="relative mt-7 text-xl font-bold tracking-[-0.015em] text-gradient-card">
        {item.title}
      </h3>
      <p className="relative mt-3 text-[15px] leading-relaxed text-muted-foreground">
        {item.body}
      </p>
    </motion.article>
  );
}

export default function DiagnosticPreview() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      data-backdrop-theme="hero"
      className="relative pt-6 sm:pt-12 md:pt-20 pb-16 sm:pb-24 md:pb-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* Anti-blur mobile DEFINITIVO: animação só com opacity — SEM translateY.
           Framer Motion deixa inline transform residual no parent depois do animate, o que
           promove o subtree a GPU layer e borra texto bg-clip do gradient em mobile. Removendo
           o y, o parent nunca ganha transform, e o span text-gradient renderiza no pixel grid. */}
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.02em] leading-[1.05]">
            <span className="text-gradient">
              O que você recebe no diagnóstico gratuito
            </span>
          </h2>
          <p className="mt-6 text-[16px] text-muted-foreground leading-relaxed">
            Em 45 minutos nosso especialista fará um diagnóstico do marketing e processo comercial da sua ótica, trazendo um plano de ação de aplicação imediata.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {ITEMS.map((item, i) => (
            <DiagnosticCard
              key={item.index}
              item={item}
              index={i}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
