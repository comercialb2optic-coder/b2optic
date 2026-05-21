import { motion } from 'framer-motion';
import { BlurFade, StaggerGroup, EASE_OUT_QUINT } from '@/components/motion';

const ITEMS = [
  {
    index: '01',
    title: 'Onde sua ótica está hoje',
    body: 'Análise da sua operação de marketing e vendas, identificando os gargalos que travam a venda de óculos no balcão.',
  },
  {
    index: '02',
    title: 'O que sua ótica precisa',
    body: 'O próximo passo concreto pra transformar fluxo em venda — sob medida pro momento atual do seu negócio, não receita genérica.',
  },
  {
    index: '03',
    title: 'Plano de ação pra escalar',
    body: 'Estratégia de captação + estrutura comercial + treinamento pra gerar venda previsível mês após mês.',
  },
];

export default function DiagnosticPreview() {
  return (
    <section
      data-backdrop-theme="hero"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16 sm:mb-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="mb-6 flex justify-center">
            <span className="eyebrow">
              <span className="block h-px w-7 bg-primary/50" />
              Diagnóstico gratuito
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-[-0.02em] leading-[1.05] text-foreground">
            O que você recebe no diagnóstico
          </h2>
          <p className="mt-6 text-[16px] text-muted-foreground leading-relaxed">
            Em 45 minutos de conversa com um especialista, três entregas concretas pro dono da ótica.
          </p>
        </motion.div>

        <StaggerGroup
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          stagger={0.1}
        >
          {ITEMS.map((item) => (
            <BlurFade key={item.index}>
              <article className="group relative rounded-2xl border border-border bg-card/40 p-7 sm:p-9 h-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/22 hover:bg-card/60 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_48px_-20px_rgba(0,0,0,0.55)]">
                <span className="block text-[56px] sm:text-[64px] font-semibold tracking-[-0.04em] leading-none text-primary/30 mb-7 tabular-nums">
                  {item.index}
                </span>
                <h3 className="mb-3 text-xl font-semibold tracking-[-0.01em] text-foreground">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </article>
            </BlurFade>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
