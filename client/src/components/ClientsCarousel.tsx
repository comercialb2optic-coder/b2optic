import { motion } from 'framer-motion';

const OPTICAS_LOGOS = [
  { id: 1, name: 'Master Ótica', url: '/manus-storage/master-optica.png' },
  { id: 2, name: 'Óticas Bom Pastor', url: '/manus-storage/opticas-bom-pastor.png' },
  { id: 3, name: 'Instituto Visão Solidária', url: '/manus-storage/instituto-visao.png' },
  { id: 4, name: 'Óticas Diniz', url: '/manus-storage/opticas-diniz.png' },
  { id: 5, name: 'Óticas Ipanema', url: '/manus-storage/opticas-ipanema.png' },
  { id: 6, name: 'Ver+ Optical Store', url: '/manus-storage/ver-plus.png' },
  { id: 7, name: 'FortÓtica', url: '/manus-storage/fortotica.png' },
  { id: 8, name: 'Campo Ótica', url: '/manus-storage/campo-optica.png' },
  { id: 9, name: 'SL Vision', url: '/manus-storage/sl-vision.png' },
  { id: 10, name: 'Labelle Ótica', url: '/manus-storage/labelle-optica.png' },
  { id: 11, name: 'Centro da Visão', url: '/manus-storage/centro-visao.png' },
  { id: 12, name: 'Ótica Webber', url: '/manus-storage/optica-webber.png' },
  { id: 13, name: 'Ótica & Cia', url: '/manus-storage/optica-cia.png' },
  { id: 14, name: 'Ponto do Óculos', url: '/manus-storage/ponto-oculos.png' },
  { id: 15, name: 'Ótica Barreiro', url: '/manus-storage/optica-barreiro.png' },
];

const DUPLICATED_LOGOS = [...OPTICAS_LOGOS, ...OPTICAS_LOGOS];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export default function ClientsCarousel() {
  return (
    <section
      data-backdrop-theme="hero"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <div className="mb-6 flex justify-center">
            <span className="eyebrow">
              <span className="block h-px w-7 bg-primary/50" />
              Prova social
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.02em] leading-[1.05] text-foreground max-w-2xl mx-auto">
            Mais de 200 óticas multiplicaram suas vendas
          </h2>

          <p className="mt-6 text-[16px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
            De óticas independentes a redes com múltiplas filiais — todas com um resultado em comum: mais óculos vendidos no balcão, mês após mês.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          {/* Side fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

          {/* Track */}
          <motion.div
            className="flex items-center gap-16 sm:gap-20 py-8 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: 'linear',
              repeatType: 'loop',
            }}
          >
            {DUPLICATED_LOGOS.map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 h-12 sm:h-14 flex items-center justify-center"
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="h-full w-auto object-contain opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="text-muted-foreground/60 text-xs text-center">${logo.name}</div>`;
                    }
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="mt-16 sm:mt-20 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent origin-center"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: EASE_OUT }}
        />
      </div>
    </section>
  );
}
