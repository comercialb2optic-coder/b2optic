import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { FileText, PhoneCall } from 'lucide-react';
import { EASE_OUT_QUINT } from '@/components/motion';

const KOMMO_FORM_ID = '1712891';
const KOMMO_SCRIPT_ID = `amoforms_script_${KOMMO_FORM_ID}`;
const KOMMO_SCRIPT_SRC =
  'https://forms.kommo.com/forms/assets/js/amoforms.js?1780936967';

export default function DiagnosticForm() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inicialização inline do Kommo (equivalente ao primeiro <script> do embed).
    // amoforms.js procura por essas globais (amo_forms_*) para renderizar o form.
    const w = window as unknown as Record<string, any>;
    w.amo_forms_params = w.amo_forms_params || {
      setMeta(p: unknown) {
        this.params = (this.params || []).concat([p]);
      },
    };
    w.amo_forms_load =
      w.amo_forms_load ||
      function (f: unknown) {
        (w.amo_forms_load.f = w.amo_forms_load.f || []).push(f);
      };
    w.amo_forms_load({
      id: KOMMO_FORM_ID,
      hash: '1b8f3f7810664dc7f2acef4979291e70',
      locale: 'pt',
    });
    w.amo_forms_loaded =
      w.amo_forms_loaded ||
      function (f: unknown, k: unknown) {
        (w.amo_forms_loaded.f = w.amo_forms_loaded.f || []).push([f, k]);
      };

    // Injeta o amoforms.js apenas uma vez (evita duplicar em re-renders).
    // O form é renderizado adjacente ao <script>, então injetamos dentro do
    // container pra o embed cair no lugar certo do layout.
    if (!document.getElementById(KOMMO_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = KOMMO_SCRIPT_ID;
      script.async = true;
      script.charset = 'utf-8';
      script.src = KOMMO_SCRIPT_SRC;
      (containerRef.current ?? document.body).appendChild(script);
    }

    return () => {
      // Cleanup opcional: remove o script injetado ao desmontar.
      document.getElementById(KOMMO_SCRIPT_ID)?.remove();
    };
  }, []);

  return (
    <section
      id="form-section"
      data-backdrop-theme="form"
      className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="mb-6 flex justify-center">
            <span className="eyebrow">
              <span className="block h-px w-7 bg-primary/50" />
              Vamos acelerar?
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.025em] leading-[1.05] text-gradient">
            Dar o próximo passo leva apenas 1 minuto
          </h2>
        </motion.div>

        <motion.ul
          className="mb-14 sm:mb-16 max-w-xl mx-auto space-y-5 sm:space-y-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <FlowStep
            icon={<FileText className="h-5 w-5 text-primary" strokeWidth={1.8} />}
            title="Preencha o formulário"
            body="Leva 1 minuto. Seus dados estão seguros."
          />
          <FlowStep
            icon={<PhoneCall className="h-5 w-5 text-primary" strokeWidth={1.8} />}
            title="Receba uma ligação"
            body="Em até 12 horas, um especialista liga pra agendar a reunião e montar seu plano de leads qualificados."
          />
        </motion.ul>

        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          {/* Container onde o amoforms.js injeta o formulário do Kommo. */}
          <div ref={containerRef} className="w-full min-h-[280px]" />
        </motion.div>
      </div>
    </section>
  );
}

function FlowStep({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-4 sm:gap-5 text-left">
      <span className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/[0.08]">
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-full bg-primary/[0.15] blur-md"
        />
        <span className="relative">{icon}</span>
      </span>
      <div className="pt-0.5">
        <h3 className="text-[15px] sm:text-[16px] font-semibold tracking-[-0.005em] text-foreground">
          {title}
        </h3>
        <p className="mt-1 text-[14px] sm:text-[15px] leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </li>
  );
}
