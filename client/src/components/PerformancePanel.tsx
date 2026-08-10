import { motion } from 'framer-motion';
import { EASE_OUT_QUINT, useParallax } from '@/components/motion';
import { PANEL_SECTION } from '@/content';

export default function PerformancePanel() {
  const { ref, y } = useParallax(0.2);

  return (
    <section
      id="painel"
      className="section-dark overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <motion.header
          className="max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="eyebrow">
            <span className="block h-px w-7 bg-primary-on-dark/50" />
            {PANEL_SECTION.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[42px]">
            {PANEL_SECTION.title}
          </h2>
          <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-foreground">
            {PANEL_SECTION.subtitle}
          </p>
        </motion.header>

        {/* Composição 3D. A perspectiva fica no PAI e a rotação no filho —
            se as duas ficarem no mesmo elemento, o navegador aplica a
            perspectiva depois da rotação e o efeito some. */}
        <div
          ref={ref}
          className="relative mt-14 sm:mt-16"
          style={{ perspective: '1600px' }}
        >
          <motion.div
            style={{ y, transformStyle: 'preserve-3d' }}
            initial={{ opacity: 0, rotateX: 14, rotateY: -20, scale: 0.94 }}
            whileInView={{ opacity: 1, rotateX: 6, rotateY: -11, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: EASE_OUT_QUINT }}
            className="relative"
          >
            <img
              src="/painel/painel-desktop.jpg"
              alt="Painel B2Performance mostrando receita do período, retorno sobre investimento e custo por venda"
              width={1440}
              height={440}
              loading="lazy"
              decoding="async"
              className="w-full rounded-xl border border-white/10 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]"
            />

            {/* Telefone sobreposto. translateZ empurra pra frente no espaço 3D,
                então ele descola do painel em vez de parecer colado nele. */}
            <motion.img
              src="/painel/painel-mobile.jpg"
              alt="Painel B2Performance no celular, com funil de conversão e faturamento diário"
              width={520}
              height={1187}
              loading="lazy"
              decoding="async"
              className="absolute -bottom-16 right-2 hidden w-[136px] rounded-[18px] border border-white/15 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.95)] sm:block sm:w-[168px] lg:-bottom-20 lg:w-[196px]"
              style={{ transform: 'translateZ(90px)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE_OUT_QUINT }}
            />
          </motion.div>

          <p className="mt-6 text-right text-[12px] text-muted-foreground sm:mt-8">
            {PANEL_SECTION.disclaimer}
          </p>
        </div>

        <ul className="mt-16 grid gap-8 sm:mt-20 md:grid-cols-3 md:gap-10">
          {PANEL_SECTION.highlights.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: EASE_OUT_QUINT,
              }}
            >
              <h3 className="text-[17px]">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground">
                {item.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
