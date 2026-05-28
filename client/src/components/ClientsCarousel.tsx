import { motion } from 'framer-motion';

const OPTICAS_LOGOS = [
  { id: 1, name: 'Ótica Ipanema', url: '/OTICAS/otica-ipanema.png' },
  { id: 2, name: 'Clic Optical', url: '/OTICAS/clicoptical.png' },
  { id: 3, name: 'Mercadão dos Óculos', url: '/OTICAS/mercadao-dos-oculos.png' },
  { id: 4, name: 'Ótica Vitelli', url: '/OTICAS/otica-vitelli.png' },
  { id: 5, name: 'Ótica Visual', url: '/OTICAS/otica-visual.png' },
  { id: 6, name: 'Ótica Carol', url: '/OTICAS/otica-carol.png' },
  { id: 7, name: 'Instituto dos Óculos', url: '/OTICAS/instituto-dos-oculos.png' },
  { id: 8, name: '99 Óticas', url: '/OTICAS/99-oticas.png' },
  { id: 9, name: 'Ótica Visart', url: '/OTICAS/otica-visart.png' },
  { id: 10, name: 'Ótica Popular Mix', url: '/OTICAS/otica-popular-mix.png' },
  { id: 11, name: 'Ótica Verzara', url: '/OTICAS/otica-verzara.png' },
  { id: 12, name: 'Ótica Visão 44', url: '/OTICAS/otica-visao-44.png' },
  { id: 13, name: 'Fullab', url: '/OTICAS/fullab.png' },
  { id: 14, name: 'Holy Óptica', url: '/OTICAS/holy-optica.png' },
  { id: 15, name: 'Bella Ótica', url: '/OTICAS/bella-otica.png' },
];

const DUPLICATED_LOGOS = [...OPTICAS_LOGOS, ...OPTICAS_LOGOS];

export default function ClientsCarousel() {
  return (
    <section
      data-backdrop-theme="hero"
      className="relative overflow-hidden py-8 sm:py-10 md:py-12"
    >
      <div className="relative overflow-hidden">
        {/* Side fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-20 w-24 bg-gradient-to-r from-background to-transparent sm:w-40" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-24 bg-gradient-to-l from-background to-transparent sm:w-40" />

        {/* Track */}
        <motion.div
          className="flex w-max items-center gap-16 py-4 sm:gap-20"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 110,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          }}
        >
          {DUPLICATED_LOGOS.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="flex h-10 flex-shrink-0 items-center justify-center sm:h-12 md:h-14"
            >
              <img
                src={logo.url}
                alt={logo.name}
                loading="lazy"
                draggable={false}
                className="h-full w-auto object-contain opacity-70"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
