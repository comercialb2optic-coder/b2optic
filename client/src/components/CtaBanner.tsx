import { motion } from 'framer-motion';
import { EASE_OUT_QUINT } from '@/components/motion';

type Variant = 'subtle' | 'card';

interface CtaBannerProps {
  titulo: string;
  subtitulo?: string;
  textoBotao: string;
  variant?: Variant;
}

const containerByVariant: Record<Variant, string> = {
  subtle: 'bg-background border-y border-line',
  card: 'bg-surface border-y border-line',
};

export default function CtaBanner({
  titulo,
  subtitulo,
  textoBotao,
  variant = 'subtle',
}: CtaBannerProps) {
  const scrollToForm = () => {
    document
      .getElementById('form-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className={`px-4 py-16 sm:px-6 sm:py-20 lg:px-8 ${containerByVariant[variant]}`}
    >
      <motion.div
        className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
        viewport={{ once: true, margin: '-80px' }}
      >
        <h2 className="max-w-2xl text-2xl sm:text-3xl lg:text-[36px]">
          {titulo}
        </h2>

        {subtitulo && (
          <p className="max-w-[60ch] text-[15px] leading-relaxed text-foreground sm:text-base">
            {subtitulo}
          </p>
        )}

        <button type="button" onClick={scrollToForm} className="btn-primary">
          {textoBotao}
        </button>
      </motion.div>
    </section>
  );
}
