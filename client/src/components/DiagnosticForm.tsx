import { motion } from 'framer-motion';
import { EASE_OUT_QUINT } from '@/components/motion';
import SectionBackdrop from '@/components/SectionBackdrop';
import LeadForm from '@/components/LeadForm';
import { FORM } from '@/content';

/**
 * Ponto de conversão do fim da página. O card em si é o `LeadForm`, o mesmo
 * que aparece no hero — aqui a seção só entrega o cabeçalho e o fundo.
 */
export default function DiagnosticForm() {
  return (
    <section
      id="form-section"
      className="relative overflow-hidden bg-surface px-4 py-20 sm:px-6 md:py-28 lg:px-8 lg:py-32"
    >
      <SectionBackdrop variant="glow" origin="50% 20%" />

      <div className="relative mx-auto max-w-lg">
        <motion.header
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="mb-5 flex justify-center">
            <span className="eyebrow">
              <span className="block h-px w-7 bg-primary/50" />
              {FORM.eyebrow}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl">{FORM.title}</h2>
          <p className="mx-auto mt-4 max-w-[50ch] text-[16px] leading-relaxed text-foreground">
            {FORM.subtitle}
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <LeadForm />
        </motion.div>
      </div>
    </section>
  );
}
