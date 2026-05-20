import { motion } from 'framer-motion';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type Variant = 'subtle' | 'card' | 'accent';

interface CtaBannerProps {
  titulo: string;
  subtitulo?: string;
  textoBotao: string;
  variant?: Variant;
}

const containerByVariant: Record<Variant, string> = {
  subtle: 'border-y border-border bg-background',
  card: 'border-y border-border bg-card/40',
  accent: 'border-y border-border bg-background',
};

export default function CtaBanner({
  titulo,
  subtitulo,
  textoBotao,
  variant = 'subtle',
}: CtaBannerProps) {
  const scrollToForm = () => {
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className={`relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 ${containerByVariant[variant]}`}
    >
      {variant === 'accent' && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      )}

      <motion.div
        className="max-w-4xl mx-auto flex flex-col items-center text-center gap-7"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        viewport={{ once: true, margin: '-80px' }}
      >
        <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-semibold tracking-[-0.025em] leading-[1.1] text-foreground max-w-2xl">
          {titulo}
        </h2>

        {subtitulo && (
          <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed max-w-xl">
            {subtitulo}
          </p>
        )}

        <button
          type="button"
          onClick={scrollToForm}
          className="btn-primary group text-[15px] px-6 py-3.5"
        >
          <span>{textoBotao}</span>
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </button>
      </motion.div>
    </section>
  );
}
