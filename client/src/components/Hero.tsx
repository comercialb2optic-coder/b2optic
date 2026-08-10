import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { WordReveal, BlurFade, EASE_OUT_QUINT } from '@/components/motion';
import SectionBackdrop from '@/components/SectionBackdrop';
import CertificationBadges from '@/components/CertificationBadges';
import LeadForm from '@/components/LeadForm';
import { HERO, FORM } from '@/content';

/**
 * Estrutura emprestada da V4, que as duas referências seguem:
 * filtro de público → promessa com o ano → subtítulo que já manda agendar →
 * checks → selos → formulário. Sem botão de CTA: o próprio formulário é o CTA.
 *
 * O formulário aqui e o da seção do fim usam o mesmo `LeadForm`, cada um com
 * estado próprio.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32">
      <SectionBackdrop variant="rings" origin="30% 30%" />
      <SectionBackdrop variant="glow" origin="50% 0%" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Coluna de conteúdo */}
          <div>
            <BlurFade delay={0.05} y={12}>
              <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-muted-foreground sm:text-[13px]">
                {HERO.qualifierPre}{' '}
                <strong className="font-bold text-heading">
                  {HERO.qualifierBold}
                </strong>
              </p>
            </BlurFade>

            <h1 className="mt-5 text-[36px] leading-[1.05] sm:text-[46px] lg:text-[54px]">
              <WordReveal text={HERO.headlineBefore} delay={0.12} as="span" />{' '}
              <WordReveal
                text={HERO.highlight}
                delay={0.3}
                as="span"
                className="text-primary"
              />{' '}
              <WordReveal text={HERO.headlineAfter} delay={0.42} as="span" />
            </h1>

            <motion.p
              className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: EASE_OUT_QUINT }}
            >
              {HERO.subtitle}
            </motion.p>

            <motion.ul
              className="mt-8 space-y-3.5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.72, ease: EASE_OUT_QUINT }}
            >
              {HERO.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] leading-snug text-foreground sm:text-[16px]">
                    {benefit}
                  </span>
                </li>
              ))}
            </motion.ul>

            <BlurFade delay={0.86} y={14} className="mt-9">
              <CertificationBadges size="compact" align="left" />
            </BlurFade>
          </div>

          {/* Formulário — o CTA da dobra. No mobile cai abaixo do conteúdo. */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT_QUINT }}
          >
            <LeadForm title={FORM.heroTitle} subtitle={FORM.heroSubtitle} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
