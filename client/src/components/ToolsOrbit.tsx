import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT_QUINT, useIsMobile } from '@/components/motion';
import { TOOLS_SECTION } from '@/content';

const SIZE = 760;
const CENTER = SIZE / 2;
const HUB_R = 92;
const RING_R = 268;

/** Raio de cada nó — variado de propósito. Todos iguais viram "grade em
 *  círculo"; a variação leve é o que faz o conjunto parecer desenhado. */
const NODE_RADII = [54, 46, 58, 48, 56, 46, 52, 50];

interface NodePos {
  x: number;
  y: number;
  r: number;
}

function nodePositions(count: number): NodePos[] {
  return Array.from({ length: count }, (_, i) => {
    // Começa no topo e distribui no sentido horário.
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / count;
    return {
      x: CENTER + Math.cos(angle) * RING_R,
      y: CENTER + Math.sin(angle) * RING_R,
      r: NODE_RADII[i % NODE_RADII.length],
    };
  });
}

/**
 * Tubo do hub até o nó. Sai da BORDA do hub e termina na BORDA do nó (não nos
 * centros), senão o traço aparece por dentro dos círculos. A curva vem de um
 * ponto de controle deslocado na perpendicular — é o que dá o aspecto de
 * mangueira em vez de raio de bicicleta.
 */
function tubePath(node: NodePos, bend: number): string {
  const dx = node.x - CENTER;
  const dy = node.y - CENTER;
  const dist = Math.hypot(dx, dy);
  const ux = dx / dist;
  const uy = dy / dist;

  const start = { x: CENTER + ux * (HUB_R - 2), y: CENTER + uy * (HUB_R - 2) };
  const end = { x: node.x - ux * (node.r - 2), y: node.y - uy * (node.r - 2) };

  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  // Perpendicular ao segmento.
  const ctrlX = midX + -uy * bend;
  const ctrlY = midY + ux * bend;

  return `M ${start.x} ${start.y} Q ${ctrlX} ${ctrlY} ${end.x} ${end.y}`;
}

export default function ToolsOrbit() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  return (
    <section
      id="ferramentas"
      className="section-dark overflow-hidden px-4 py-24 sm:px-6 lg:px-8 lg:py-36"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="eyebrow">
            <span className="block h-px w-7 bg-primary-on-dark/50" />
            {TOOLS_SECTION.eyebrow}
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[42px]">
            {TOOLS_SECTION.title}
          </h2>
          <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-foreground">
            {TOOLS_SECTION.subtitle}
          </p>
        </motion.div>

        <div className="relative">
          {isMobile ? <ToolsGrid /> : <Orbit reduced={!!reduced} />}
        </div>
      </div>
    </section>
  );
}

function Orbit({ reduced }: { reduced: boolean }) {
  const tools = TOOLS_SECTION.tools;
  const nodes = nodePositions(tools.length);

  return (
    <motion.div
      className="relative mx-auto w-full"
      style={{ maxWidth: SIZE }}
      initial={reduced ? false : { opacity: 0, scale: 0.94 }}
      whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: EASE_OUT_QUINT }}
    >
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={`B2Optic conectada a ${tools.map((t) => t.label).join(', ')}`}
      >
        <defs>
          <radialGradient id="orbit-hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4D8AFF" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#4D8AFF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Halo atrás do hub */}
        <circle cx={CENTER} cy={CENTER} r={RING_R} fill="url(#orbit-hub-glow)" />

        {/* Tubos — desenhados antes dos nós pra ficarem por baixo. O sinal do
            bend alterna pra as curvas não penderem todas pro mesmo lado. */}
        <g>
          {nodes.map((node, i) => (
            <motion.path
              key={`tube-${tools[i].id}`}
              d={tubePath(node, i % 2 === 0 ? 34 : -34)}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={20}
              strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.9,
                delay: 0.2 + i * 0.07,
                ease: EASE_OUT_QUINT,
              }}
            />
          ))}
        </g>

        {/* Nós */}
        {nodes.map((node, i) => {
          const tool = tools[i];
          return (
            <motion.g
              key={tool.id}
              initial={reduced ? false : { opacity: 0, scale: 0.7 }}
              whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.5,
                delay: 0.45 + i * 0.07,
                ease: EASE_OUT_QUINT,
              }}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill="#141A28"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth={1}
              />
              {tool.logo ? (
                <image
                  href={tool.logo}
                  x={node.x - node.r * 0.5}
                  y={node.y - node.r * 0.5}
                  width={node.r}
                  height={node.r}
                  preserveAspectRatio="xMidYMid meet"
                />
              ) : (
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-white"
                  style={{
                    fontSize: tool.label.length > 8 ? 11 : 14,
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {tool.label}
                </text>
              )}
            </motion.g>
          );
        })}

        {/* Hub central — círculo claro, igual à referência: o miolo é o que
            tem contraste, o resto do anel é discreto. */}
        <circle cx={CENTER} cy={CENTER} r={HUB_R} fill="#FFFFFF" />
      </svg>

      {/* A logo vai em HTML sobre o SVG — <image> em SVG não respeita
          object-fit de forma confiável entre navegadores. */}
      <div
        className="pointer-events-none absolute flex items-center justify-center"
        style={{
          left: `${((CENTER - HUB_R) / SIZE) * 100}%`,
          top: `${((CENTER - HUB_R) / SIZE) * 100}%`,
          width: `${((HUB_R * 2) / SIZE) * 100}%`,
          height: `${((HUB_R * 2) / SIZE) * 100}%`,
        }}
      >
        <img
          src="/b2optic-logo.png"
          alt="B2Optic"
          className="w-[74%] select-none"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}

/** No mobile o orbital fica ilegível (texto do nó vira 6px). Vira grade. */
function ToolsGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {TOOLS_SECTION.tools.map((tool) => (
        <li
          key={tool.id}
          className="rounded-xl border border-line bg-card px-4 py-3.5"
        >
          <span className="block text-[15px] font-semibold text-heading">
            {tool.label}
          </span>
          <span className="block text-[13px] text-muted-foreground">
            {tool.note}
          </span>
        </li>
      ))}
    </ul>
  );
}
