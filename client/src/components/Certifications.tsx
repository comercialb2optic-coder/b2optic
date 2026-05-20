import { motion } from 'framer-motion';
import { Check, CheckCircle2 } from 'lucide-react';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function GoogleLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="h-9 w-9"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function MetaLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="h-9 w-9"
    >
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.955.926-1.955 1.875v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
    </svg>
  );
}

function CertificationIcon({ id }: { id: number }) {
  if (id === 1) return <GoogleLogo />;
  return <MetaLogo />;
}

const certifications = [
  {
    id: 1,
    name: 'Google Ads Search Certified',
    description: 'Especialistas certificados em Google Ads Search',
  },
  {
    id: 2,
    name: 'Facebook Blueprint Certified',
    description: 'Profissionais certificados em Meta Ads Manager',
  },
];

const benefits = [
  'Profissionais sempre atualizados com melhores práticas',
  'Acesso a ferramentas e recursos exclusivos',
  'Estratégias baseadas em dados e tendências do mercado',
  'Conformidade com padrões internacionais de qualidade',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export default function Certifications() {
  const scrollToForm = () => {
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-background">
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <div className="mb-6 flex justify-center">
            <span className="eyebrow">
              <span className="block h-px w-7 bg-primary/50" />
              Certificações oficiais
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.02em] leading-[1.05] text-foreground">
            Seu marketing gerenciado pelos melhores especialistas do mercado
          </h2>

          <p className="mt-6 text-[16px] text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Nosso programa possui certificações oficiais do Google e Facebook, garantindo que nossos profissionais estejam sempre atualizados com as melhores práticas do mercado digital.
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-20 sm:mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {certifications.map((cert) => (
            <motion.article
              key={cert.id}
              className="group rounded-2xl border border-border bg-card/40 p-7 sm:p-9 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/22 hover:bg-card/60 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_48px_-20px_rgba(0,0,0,0.55)]"
              variants={itemVariants}
              whileHover={{ y: -3 }}
            >
              {/* Logo */}
              <div className="mb-7">
                <CertificationIcon id={cert.id} />
              </div>

              {/* Content */}
              <h3 className="mb-2.5 text-xl font-semibold tracking-[-0.01em] text-foreground">
                {cert.name}
              </h3>
              <p className="mb-7 text-[15px] text-muted-foreground leading-relaxed">
                {cert.description}
              </p>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span className="text-[12px] font-medium text-primary/90">
                  Certificado oficial
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Benefits Block */}
        <motion.div
          className="rounded-2xl border border-border bg-card p-8 sm:p-10 lg:p-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
        >
          <h3 className="mb-8 text-2xl font-semibold tracking-[-0.01em] text-foreground sm:mb-10">
            O que isso significa para você
          </h3>

          <motion.div
            className="grid sm:grid-cols-2 gap-x-10 gap-y-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 border-l border-primary/30 pl-4"
                variants={itemVariants}
              >
                <Check className="mt-1 h-4 w-4 flex-shrink-0 text-primary" strokeWidth={2.5} />
                <p className="text-[15px] leading-relaxed text-foreground/85">
                  {benefit}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 sm:mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
        >
          <p className="mb-7 text-[16px] text-muted-foreground">
            Quer trabalhar com especialistas certificados?
          </p>
          <button
            type="button"
            onClick={scrollToForm}
            className="btn-primary group text-[15px] px-6 py-3.5"
          >
            <span>Falar com um consultor</span>
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
