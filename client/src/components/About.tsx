import { motion } from 'framer-motion';
import { EASE_OUT_QUINT } from '@/components/motion';

export default function About() {
  return (
    <section
      id="about"
      data-backdrop-theme="form"
      className="relative overflow-hidden bg-background py-24 sm:py-32 md:py-40 px-4 sm:px-6 lg:px-8"
    >
      {/* Background image — foto do time quase nítida (blur 3px só pra tirar
         o ruído). scale-105 evita borda transparente do blur. Fallback:
         bg-background do section mantém a seção legível se a imagem falhar. */}
      <img
        src="/oticas/team.webp"
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover scale-105 blur-[3px] opacity-100"
      />

      {/* Overlay único — vinheta: transparente no centro (foto respira),
         escurece só nas bordas; leve costura no topo/rodapé pra amarrar
         com as seções vizinhas. Sem empilhar camadas escuras. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,5,5,0.6), transparent 22%, transparent 78%, rgba(5,5,5,0.6)), radial-gradient(ellipse at center, rgba(5,5,5,0.35) 35%, rgba(5,5,5,0.78) 100%)',
        }}
      />

      {/* Content — text-shadow herda pros filhos pra legibilidade sobre a foto */}
      <div
        className="relative max-w-5xl mx-auto text-center"
        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
      >
        {/* Eyebrow */}
        <motion.div
          className="mb-7 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="eyebrow text-gradient-silver">
            <span className="block h-px w-7 bg-primary/50" />
            O propósito da B2Optic é
          </span>
        </motion.div>

        {/* Headline — gradient em span interno (h2 neutro), animação no bloco */}
        <motion.h2
          className="text-4xl sm:text-5xl lg:text-[64px] font-semibold tracking-[-0.025em] leading-[1.05] mb-8 sm:mb-10 [filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.6))]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="text-gradient">
            FAZER SUA ÓTICA VENDER MAIS NO BALCÃO
          </span>
        </motion.h2>

        {/* Subtitle — palavra-chave "acelerar" em azul primary */}
        <motion.p
          className="text-xl sm:text-2xl lg:text-[28px] font-medium tracking-[-0.01em] leading-[1.25] text-foreground/95 mb-10 sm:mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          Um time preparado para{' '}
          <span className="text-primary">acelerar</span> a sua ótica
        </motion.p>

        {/* Paragraphs */}
        <motion.div
          className="space-y-5 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <p className="text-[16px] sm:text-[17px] leading-relaxed text-foreground/80">
            Na B2Optic, unimos estratégia, tecnologia e execução pra transformar o marketing da sua ótica em vendas reais no balcão. Somos especialistas em captação qualificada, automação de agendamento e estruturação do processo comercial — tudo conectado pra gerar crescimento previsível.
          </p>
          <p className="text-[16px] sm:text-[17px] leading-relaxed text-foreground/80">
            Nosso time trabalha lado a lado com cada ótica parceira, criando soluções sob medida que transformam desafios em oportunidades. Mais de 200 óticas aceleradas e +R$ 13 milhões em vendas geradas comprovam: a gente vive aquilo que entrega.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
