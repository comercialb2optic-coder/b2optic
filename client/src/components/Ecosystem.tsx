import { motion } from 'framer-motion';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const cards = [
  {
    index: '01',
    label: 'Captação',
    title: 'Captação de Leads Qualificados',
    description:
      'Anúncios de exame de vista no Meta e Google + triagem de 3 perguntas filtram quem quer comprar óculos. O lead que chega no balcão já passou pela qualificação — sua vendedora atende quem está pronto pra fechar.',
    image:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663538512901/kZM2v8qXuFHBjEWTxNfZYk/b2optic-ecosystem-card1-fmMJLCqxCQ5tTsxrNs2fQw.webp',
  },
  {
    index: '02',
    label: 'Estrutura comercial',
    title: 'Estrutura Comercial Completa',
    description:
      'CRM próprio + IA de atendimento que agenda o exame automaticamente + app de acompanhamento de vendas e métricas. Ferramentas sob medida pro fluxo da ótica — não software genérico adaptado.',
    image:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663538512901/kZM2v8qXuFHBjEWTxNfZYk/b2optic-ecosystem-card2-TDDB7S4KsXizySDifsNjVE.webp',
  },
  {
    index: '03',
    label: 'Treinamento',
    title: 'Treinamento Comercial Sob Medida',
    description:
      'Vendedoras treinadas pra fechar a venda no balcão. Atendimento consultivo, abordagem específica pra óptica e fechamento — o que faz cliente sair com óculos, não só com cotação no WhatsApp.',
    image:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663538512901/kZM2v8qXuFHBjEWTxNfZYk/b2optic-ecosystem-card3-jU4brRhNgzWtEqWH9KVkLU.webp',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const IMAGE_MASK = 'linear-gradient(to bottom, black 72%, transparent)';

export default function Ecosystem() {
  return (
    <section
      data-backdrop-theme="ecosystem"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 sm:mb-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="mb-6 flex justify-center">
            <span className="eyebrow">
              <span className="block h-px w-7 bg-primary/50" />
              Os 3 pilares
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.02em] leading-[1.05] text-foreground">
            O ecossistema <span className="text-primary">B2Optic</span>
          </h2>

          <p className="mt-6 text-[16px] text-muted-foreground leading-relaxed">
            Captação, estrutura comercial e treinamento — costurados pra fazer sua ótica vender mais óculos no balcão.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <motion.article
              key={card.index}
              className="card-glass group flex flex-col cursor-pointer"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.7, delay: index * 0.08, ease: EASE_OUT }}
              viewport={{ once: true, margin: '-80px' }}
              whileHover={{ y: -3 }}
            >
              {/* Card Image with bottom fade mask */}
              <div
                className="mb-7 h-44 overflow-hidden rounded-md"
                style={{
                  maskImage: IMAGE_MASK,
                  WebkitMaskImage: IMAGE_MASK,
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>

              {/* Numbered eyebrow */}
              <div className="mb-3 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                <span className="text-primary">{card.index}</span>
                <span className="h-px w-4 bg-border" />
                <span>{card.label}</span>
              </div>

              {/* Title + body */}
              <h3 className="mb-3 text-xl font-semibold tracking-[-0.01em] text-foreground">
                {card.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
