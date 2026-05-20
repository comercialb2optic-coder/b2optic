import { motion } from 'framer-motion';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const cards = [
  {
    index: '01',
    label: 'Triagem',
    title: 'Triagem Inteligente de Leads',
    description:
      'Não desperdice tempo com prospects frios. Nossa IA qualifica automaticamente cada lead, priorizando aqueles com maior probabilidade de conversão. Redução de 60% no tempo de prospecção e aumento de 3x na taxa de conversão.',
    image:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663538512901/kZM2v8qXuFHBjEWTxNfZYk/b2optic-ecosystem-card1-fmMJLCqxCQ5tTsxrNs2fQw.webp',
  },
  {
    index: '02',
    label: 'Atendimento',
    title: 'Atendimento Inteligente que Não Dorme',
    description:
      'Enquanto seus concorrentes dormem, sua ótica segue convertendo. Nossa IA responde dúvidas, agenda exames e qualifica leads automaticamente no WhatsApp, sem perder a humanidade na comunicação. Respostas em menos de 30 segundos.',
    image:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663538512901/kZM2v8qXuFHBjEWTxNfZYk/b2optic-ecosystem-card2-TDDB7S4KsXizySDifsNjVE.webp',
  },
  {
    index: '03',
    label: 'CRM',
    title: 'CRM Próprio Desenhado para Óticas',
    description:
      'Não é um CRM genérico adaptado. Desenvolvemos um sistema específico para o fluxo de vendas de óticas, com automações que transformam leads em clientes sem esforço manual repetitivo. Histórico completo e relatórios em tempo real.',
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
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-background">
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
              O que fazemos
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.02em] leading-[1.05] text-foreground">
            O Ecossistema <span className="text-primary">B2Optic</span>
          </h2>

          <p className="mt-6 text-[16px] text-muted-foreground leading-relaxed">
            Mostre, não apenas fale. Conheça as três pilares que transformam sua ótica em uma
            máquina de vendas.
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
