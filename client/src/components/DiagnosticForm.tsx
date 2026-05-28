import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Lock } from 'lucide-react';
import { EASE_OUT_QUINT } from '@/components/motion';

const REVENUE_VALUES = ['ate-30k', '30-100k', '100-250k', 'acima-250k'] as const;
const ADS_VALUES = ['agencia', 'conta-propria', 'nunca', 'insatisfeito'] as const;

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  whatsapp: z
    .string()
    .min(10, 'WhatsApp inválido')
    .regex(/[\d\s()+-]+/, 'WhatsApp inválido'),
  opticsName: z.string().min(2, 'Informe o nome da ótica'),
  revenue: z.enum(REVENUE_VALUES),
  adsExperience: z.enum(ADS_VALUES),
});

type FormData = z.infer<typeof schema>;

const REVENUE_OPTIONS: Array<{
  value: (typeof REVENUE_VALUES)[number];
  label: string;
  sub: string;
}> = [
  { value: 'ate-30k', label: 'Até R$ 30 mil', sub: 'Começando' },
  { value: '30-100k', label: 'R$ 30 a 100 mil', sub: 'Estabelecida' },
  { value: '100-250k', label: 'R$ 100 a 250 mil', sub: 'Crescendo' },
  { value: 'acima-250k', label: 'Acima de R$ 250 mil', sub: 'Operação madura' },
];

const ADS_OPTIONS: Array<{
  value: (typeof ADS_VALUES)[number];
  label: string;
  sub: string;
}> = [
  { value: 'agencia', label: 'Já anuncio com agência', sub: 'Tenho parceiro hoje' },
  { value: 'conta-propria', label: 'Já tentei por conta própria', sub: 'Sem agência atual' },
  { value: 'nunca', label: 'Nunca anunciei', sub: 'Vou começar agora' },
  { value: 'insatisfeito', label: 'Anuncio mas tô insatisfeito', sub: 'Quero trocar' },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: -dir * 40, opacity: 0 }),
};

const stepFields: Record<1 | 2 | 3, Array<keyof FormData>> = {
  1: ['name', 'whatsapp', 'opticsName'],
  2: ['revenue'],
  3: ['adsExperience'],
};

const labelClass =
  'mb-2.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground';

export default function DiagnosticForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      whatsapp: '',
      opticsName: '',
    },
  });

  const next = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid && step < 3) {
      setDirection(1);
      setStep((s) => (s + 1) as 1 | 2 | 3);
    }
  };

  const back = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => (s - 1) as 1 | 2 | 3);
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // eslint-disable-next-line no-console
    console.log('B2Optic — diagnóstico aplicado:', data);
    setSubmitted(true);
  };

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
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.025em] leading-[1.05] text-foreground">
            Dar o próximo passo leva apenas{' '}
            <span className="text-primary">1 minuto</span>
          </h2>
          <p className="mt-6 text-[16px] text-muted-foreground leading-relaxed">
            Preencha em 1 minuto. Nossa equipe entra em contato em até 12h pra agendar a conversa.
          </p>
        </motion.div>

        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-80px' }}
        >
          {submitted ? (
            <SuccessState />
          ) : (
            <>
              <ProgressIndicator step={step} />

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="relative min-h-[280px] overflow-hidden">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: EASE_OUT_QUINT }}
                      className="transform-gpu will-change-transform"
                    >
                      {step === 1 && (
                        <Step1 register={register} errors={errors} />
                      )}
                      {step === 2 && (
                        <StepRadio
                          eyebrow="Etapa 2 · Faturamento"
                          title="Qual o faturamento mensal da sua ótica?"
                          name="revenue"
                          options={REVENUE_OPTIONS}
                          control={control}
                        />
                      )}
                      {step === 3 && (
                        <StepRadio
                          eyebrow="Etapa 3 · Experiência com anúncios"
                          title="Como sua ótica anuncia hoje?"
                          name="adsExperience"
                          options={ADS_OPTIONS}
                          control={control}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-9 flex items-center gap-3">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={back}
                      className="btn-secondary"
                    >
                      Voltar
                    </button>
                  )}

                  <button
                    type={step === 3 ? 'submit' : 'button'}
                    onClick={step === 3 ? undefined : next}
                    disabled={isSubmitting}
                    className="btn-primary flex-1"
                  >
                    {step === 3 ? 'Solicitar diagnóstico' : 'Continuar'}
                  </button>
                </div>
              </form>

              <TrustRow />
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function ProgressIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="mb-9">
      <div className="mb-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        <span>Passo {step} de 3</span>
        <span>{Math.round((step / 3) * 100)}%</span>
      </div>
      <div className="relative h-px w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left bg-primary transform-gpu will-change-transform"
          animate={{ scaleX: step / 3 }}
          transition={{ duration: 0.45, ease: EASE_OUT_QUINT }}
        />
      </div>
    </div>
  );
}

function Step1({
  register,
  errors,
}: {
  register: ReturnType<typeof useForm<FormData>>['register'];
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors'];
}) {
  return (
    <div className="space-y-5">
      <div>
        <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-primary/85 mb-1">
          Etapa 1 · Identificação
        </span>
        <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-foreground">
          Conta um pouco sobre você
        </h3>
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          Nome completo
        </label>
        <input
          id="name"
          type="text"
          placeholder="João Silva"
          className="spotlight-input w-full"
          {...register('name')}
        />
        {errors.name?.message && (
          <p className="mt-1.5 text-[12px] text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="whatsapp" className={labelClass}>
          WhatsApp
        </label>
        <input
          id="whatsapp"
          type="tel"
          placeholder="(11) 99999-9999"
          className="spotlight-input w-full"
          {...register('whatsapp')}
        />
        {errors.whatsapp?.message && (
          <p className="mt-1.5 text-[12px] text-destructive">{errors.whatsapp.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="opticsName" className={labelClass}>
          Nome da ótica
        </label>
        <input
          id="opticsName"
          type="text"
          placeholder="Ótica Vista Bela"
          className="spotlight-input w-full"
          {...register('opticsName')}
        />
        {errors.opticsName?.message && (
          <p className="mt-1.5 text-[12px] text-destructive">{errors.opticsName.message}</p>
        )}
      </div>
    </div>
  );
}

function StepRadio<TName extends 'revenue' | 'adsExperience'>({
  eyebrow,
  title,
  name,
  options,
  control,
}: {
  eyebrow: string;
  title: string;
  name: TName;
  options: Array<{ value: FormData[TName]; label: string; sub: string }>;
  control: ReturnType<typeof useForm<FormData>>['control'];
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-5">
          <div>
            <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-primary/85 mb-1">
              {eyebrow}
            </span>
            <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-foreground">
              {title}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((opt) => {
              const active = field.value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.onChange(opt.value)}
                  className={`group relative text-left rounded-lg border p-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active
                      ? 'border-primary/60 bg-primary/[0.08]'
                      : 'border-border bg-card/40 hover:border-white/22 hover:bg-card/60'
                  }`}
                >
                  <span
                    className={`block text-[14px] font-semibold tracking-[-0.005em] mb-0.5 ${
                      active ? 'text-foreground' : 'text-foreground/90'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="block text-[12px] text-muted-foreground">
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>

          {fieldState.error?.message && (
            <p className="text-[12px] text-destructive">
              Selecione uma opção pra continuar
            </p>
          )}
        </div>
      )}
    />
  );
}

function TrustRow() {
  return (
    <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-muted-foreground/85">
      <Lock className="h-3 w-3" strokeWidth={2} />
      <span>Seus dados estão seguros · Resposta em até 12h</span>
    </div>
  );
}

function SuccessState() {
  return (
    <motion.div
      className="text-center py-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
    >
      <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/[0.08]">
        <Check className="h-7 w-7 text-primary" strokeWidth={2.5} />
      </div>
      <h3 className="mb-3 text-2xl font-semibold tracking-[-0.02em] text-foreground">
        Aplicação recebida
      </h3>
      <p className="text-[15px] text-muted-foreground leading-relaxed max-w-sm mx-auto">
        Nossa equipe entra em contato no WhatsApp em até 12h pra agendar a reunião de diagnóstico.
      </p>
    </motion.div>
  );
}
