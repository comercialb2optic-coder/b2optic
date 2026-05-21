import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const REVENUE_OPTIONS = [
  { value: 'ate-30k', label: 'Até R$ 30 mil' },
  { value: '30-100k', label: 'R$ 30 mil – R$ 100 mil' },
  { value: '100-250k', label: 'R$ 100 mil – R$ 250 mil' },
  { value: 'acima-250k', label: 'Acima de R$ 250 mil' },
];

const STATS = [
  { label: 'Óticas Atendidas', value: '+200' },
  { label: 'Taxa de Conversão', value: '+45%' },
  { label: 'Tempo de Implementação', value: '30 dias' },
];

const labelClass =
  'mb-2.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground';

export default function DiagnosticForm() {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    opticsName: '',
    revenue: '',
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section
      id="form-section"
      data-backdrop-theme="form"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left — Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="mb-6 flex">
              <span className="eyebrow">
                <span className="block h-px w-7 bg-primary/50" />
                Diagnóstico gratuito
              </span>
            </div>

            <h2 className="mb-5 text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.025em] leading-[1.05] text-foreground">
              Pronto para impulsionar sua <span className="text-primary">ótica</span>?
            </h2>
            <p className="mb-10 text-[16px] text-muted-foreground leading-relaxed max-w-md">
              Preencha o formulário abaixo e nós entraremos em contato para discutir soluções personalizadas para o momento atual do seu negócio. Fique tranquilo, todos os dados preenchidos estão seguros.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05, ease: EASE_OUT }}
                viewport={{ once: true }}
              >
                <label htmlFor="name" className={labelClass}>
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className="spotlight-input w-full"
                  required
                />
              </motion.div>

              {/* WhatsApp */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12, ease: EASE_OUT }}
                viewport={{ once: true }}
              >
                <label htmlFor="whatsapp" className={labelClass}>
                  WhatsApp
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="spotlight-input w-full"
                  required
                />
              </motion.div>

              {/* Optics Name */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.19, ease: EASE_OUT }}
                viewport={{ once: true }}
              >
                <label htmlFor="opticsName" className={labelClass}>
                  Nome da Ótica
                </label>
                <input
                  id="opticsName"
                  type="text"
                  name="opticsName"
                  value={formData.opticsName}
                  onChange={handleChange}
                  placeholder="Ótica Vista Bela"
                  className="spotlight-input w-full"
                  required
                />
              </motion.div>

              {/* Revenue — select */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.26, ease: EASE_OUT }}
                viewport={{ once: true }}
              >
                <label htmlFor="revenue" className={labelClass}>
                  Faturamento Atual (Mensal)
                </label>
                <div className="relative">
                  <select
                    id="revenue"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleChange}
                    className="spotlight-input w-full appearance-none pr-11"
                    required
                  >
                    <option value="" disabled>
                      Selecione uma faixa
                    </option>
                    {REVENUE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  />
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.33, ease: EASE_OUT }}
                viewport={{ once: true }}
                className="pt-2"
              >
                <button
                  type="submit"
                  className="btn-primary group w-full text-[15px] py-3.5"
                >
                  <span>Solicitar diagnóstico gratuito</span>
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </button>
              </motion.div>
            </form>
          </motion.div>

          {/* Right — Visual / Stats */}
          <motion.div
            className="relative h-full min-h-[460px] overflow-hidden rounded-2xl border border-border bg-card/60 p-8 sm:p-10"
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            {/* Top accent line — substituting the animated border */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {/* Spotlight follower (reduced intensity, wider radius) */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle 280px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 85, 255, 0.08) 0%, transparent 70%)`,
              }}
            />

            {/* Content */}
            <div className="relative flex h-full flex-col justify-between gap-10">
              {/* Big number */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25, ease: EASE_OUT }}
                viewport={{ once: true }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-medium text-primary/70">
                    +R$
                  </span>
                  <span className="text-[72px] sm:text-[88px] font-semibold tracking-[-0.04em] leading-none text-primary">
                    13M
                  </span>
                </div>
                <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  em vendas geradas
                </p>
              </motion.div>

              {/* Stats */}
              <div className="space-y-1">
                {STATS.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="flex items-baseline justify-between border-b border-border py-3"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.35 + index * 0.08,
                      ease: EASE_OUT,
                    }}
                    viewport={{ once: true }}
                  >
                    <span className="text-[14px] text-foreground/75">{stat.label}</span>
                    <span className="text-base font-semibold tracking-[-0.01em] text-primary">
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
