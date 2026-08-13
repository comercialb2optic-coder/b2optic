import { motion, useSpring, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { EASE_OUT_QUINT, useParallax } from '@/components/motion';
import { PANEL_SECTION } from '@/content';

const clamp = (v: number, limite: number) =>
  Math.max(-limite, Math.min(limite, v));

export default function PerformancePanel() {
  const { ref, y } = useParallax(0.2);
  const reduced = useReducedMotion();

  // Inclinação por arrasto. Mola em vez de valor cru para que soltar o
  // ponteiro volte sozinho ao repouso, sem animação imperativa.
  const mola = { stiffness: 180, damping: 20, mass: 0.6 };
  const tiltY = useSpring(0, mola);
  const tiltX = useSpring(0, mola);
  const origem = useRef<{ x: number; y: number } | null>(null);

  function aoPegar(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    origem.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function aoArrastar(e: React.PointerEvent<HTMLDivElement>) {
    const inicio = origem.current;
    if (!inicio) return;
    // Horizontal manda: é o gesto que o mouse faz naturalmente.
    tiltY.set(clamp((e.clientX - inicio.x) * 0.14, 20));
    tiltX.set(clamp((inicio.y - e.clientY) * 0.07, 10));
  }

  function aoSoltar(e: React.PointerEvent<HTMLDivElement>) {
    if (!origem.current) return;
    origem.current = null;
    tiltY.set(0);
    tiltX.set(0);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

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
            {/* Camada só do arrasto. Separada da entrada porque as duas mexem
                em rotateX/rotateY — no mesmo elemento uma anularia a outra.
                touch-action pan-y deixa o dedo rolar a página no vertical e
                reserva o horizontal pra inclinação. */}
            <motion.div
              onPointerDown={aoPegar}
              onPointerMove={aoArrastar}
              onPointerUp={aoSoltar}
              onPointerCancel={aoSoltar}
              style={{
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: 'preserve-3d',
                touchAction: 'pan-y',
              }}
              className="relative cursor-grab active:cursor-grabbing"
            >
              <img
                src="/painel/painel-desktop.jpg"
                alt="Painel B2Performance mostrando receita do período, retorno sobre investimento e custo por venda"
                width={1507}
                height={797}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="w-full select-none rounded-xl border border-white/10 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]"
              />
            </motion.div>
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
