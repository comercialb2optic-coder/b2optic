import { motion, useReducedMotion } from 'framer-motion';

const OPTICAS_LOGOS = [
  { id: 1, name: 'Ótica Ipanema', url: '/oticas/otica-ipanema.png' },
  { id: 2, name: 'Clic Optical', url: '/oticas/clicoptical.png' },
  { id: 3, name: 'Mercadão dos Óculos', url: '/oticas/mercadao-dos-oculos.png' },
  { id: 4, name: 'Ótica Vitelli', url: '/oticas/otica-vitelli.png' },
  { id: 5, name: 'Ótica Visual', url: '/oticas/otica-visual.png' },
  { id: 6, name: 'Ótica Carol', url: '/oticas/otica-carol.png' },
  { id: 7, name: 'Instituto dos Óculos', url: '/oticas/instituto-dos-oculos.png' },
  { id: 8, name: '99 Óticas', url: '/oticas/99-oticas.png' },
  { id: 9, name: 'Ótica Visart', url: '/oticas/otica-visart.png' },
  { id: 10, name: 'Ótica Popular Mix', url: '/oticas/otica-popular-mix.png' },
  { id: 11, name: 'Ótica Verzara', url: '/oticas/otica-verzara.png' },
  { id: 12, name: 'Ótica Visão 44', url: '/oticas/otica-visao-44.png' },
  { id: 13, name: 'Fullab', url: '/oticas/fullab.png' },
  { id: 14, name: 'Holy Óptica', url: '/oticas/holy-optica.png' },
  { id: 15, name: 'Bella Ótica', url: '/oticas/bella-otica.png' },
];

const DUPLICATED_LOGOS = [...OPTICAS_LOGOS, ...OPTICAS_LOGOS];

/**
 * Os PNGs das logos são arte BRANCA sobre fundo transparente — foram feitos
 * para o tema escuro e sumiriam por completo no branco. Como são todos
 * monocromáticos, `invert` os converte em arte preta sem precisar de arquivo
 * novo. Se algum dia entrar uma logo COLORIDA nesta lista, o invert vai
 * distorcer as cores dela e o arquivo precisará vir já em versão escura.
 */
const LOGO_FILTER = 'invert(1) opacity(0.55)';

export default function ClientsCarousel() {
  const reduced = useReducedMotion();

  return (
    // Sem título: é uma faixa de prova, não uma seção. As marcas falam
    // sozinhas e o padding menor deixa claro que ela separa o hero dos Cases.
    <section className="overflow-hidden border-y border-line bg-surface py-11 sm:py-12">
      <div className="relative overflow-hidden">
        {/* Máscaras laterais — precisam casar com o fundo da seção (surface). */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r from-surface to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l from-surface to-transparent sm:w-32" />

        <motion.div
          className={`flex w-max items-center gap-14 py-2 sm:gap-20 ${
            reduced ? 'flex-wrap justify-center' : ''
          }`}
          animate={reduced ? undefined : { x: ['0%', '-50%'] }}
          transition={
            reduced
              ? undefined
              : {
                  duration: 110,
                  repeat: Infinity,
                  ease: 'linear',
                  repeatType: 'loop',
                }
          }
        >
          {(reduced ? OPTICAS_LOGOS : DUPLICATED_LOGOS).map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="flex h-8 flex-shrink-0 items-center justify-center sm:h-10"
            >
              <img
                src={logo.url}
                alt={logo.name}
                loading="lazy"
                draggable={false}
                className="h-full w-auto object-contain"
                style={{ filter: LOGO_FILTER }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
