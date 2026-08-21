import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { EASE_OUT_QUINT } from '@/components/motion';
import { submitLead } from '@/lib/submitLead';
import { trackFormStart } from '@/lib/metaPixel';
import { FORM, CTA, REVENUE_OPTIONS, ADS_OPTIONS } from '@/content';

/**
 * Card do formulário de diagnóstico, isolado do contexto onde aparece.
 *
 * Existe em DOIS lugares: dentro do hero e na seção do fim da página. Cada
 * instância tem estado próprio (é o comportamento esperado — quem começa a
 * preencher no topo e rola até o fim não deveria ver o formulário meio
 * preenchido lá embaixo). Manter uma implementação só evita as duas versões
 * divergirem com o tempo.
 */

const REVENUE_VALUES = REVENUE_OPTIONS.map((o) => o.value) as [
  string,
  ...string[],
];
const ADS_VALUES = ADS_OPTIONS.map((o) => o.value) as [string, ...string[]];

const schema = z.object({
  name: z.string().trim().min(2, FORM.errors.name),
  whatsapp: z
    .string()
    .trim()
    // 10 dígitos = fixo com DDD, 11 = celular com DDD. Valida a quantidade de
    // dígitos, não a máscara — quem digita sem parênteses não deve ser barrado.
    .refine((v) => {
      const digits = v.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 13;
    }, FORM.errors.whatsapp),
  opticsName: z.string().trim().min(2, FORM.errors.opticsName),
  revenue: z.enum(REVENUE_VALUES, { message: FORM.errors.revenue }),
  adsExperience: z.enum(ADS_VALUES, { message: FORM.errors.ads }),
});

type FormData = z.infer<typeof schema>;

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

const labelClass = 'mb-1.5 block text-[13px] font-medium text-heading';

interface LeadFormProps {
  /** Cabeçalho dentro do card. Omitir quando a seção já tiver título próprio. */
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function LeadForm({
  title,
  subtitle,
  className = '',
}: LeadFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitted, setSubmitted] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [comecou, setComecou] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', whatsapp: '', opticsName: '' },
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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setSendError(null);
    try {
      await submitLead(data);
      setSubmitted(true);
    } catch (error) {
      // Nunca mostrar sucesso quando o envio falhou — ele precisa poder tentar
      // de novo, e a gente precisa não perder o lead.
      console.error('[LeadForm] falha ao enviar lead', error);
      setSendError(FORM.errors.network);
    }
  };

  return (
    <div className={`card-surface elevated p-6 sm:p-7 ${className}`}>
      {submitted ? (
        <SuccessState />
      ) : (
        <>
          {title && (
            <div className="mb-6">
              <h3 className="text-[20px] sm:text-[22px]">{title}</h3>
              {subtitle && (
                <p className="mt-1.5 text-[14px] text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <ProgressIndicator step={step} />

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="relative min-h-[290px] overflow-hidden">
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
                  {step === 1 && <Step1 register={register} errors={errors} />}
                  {step === 2 && (
                    <StepRadio
                      title={FORM.steps[2].title}
                      name="revenue"
                      options={REVENUE_OPTIONS}
                      control={control}
                    />
                  )}
                  {step === 3 && (
                    <StepRadio
                      title={FORM.steps[3].title}
                      name="adsExperience"
                      options={ADS_OPTIONS}
                      control={control}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {sendError && (
              <p
                role="alert"
                className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-[13px] text-destructive"
              >
                <AlertCircle className="mt-px h-4 w-4 shrink-0" />
                {sendError}
              </p>
            )}

            <div className="mt-6 flex items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={back}
                  disabled={isSubmitting}
                  className="btn-secondary"
                >
                  {CTA.formBack}
                </button>
              )}

              <button
                type={step === 3 ? 'submit' : 'button'}
                onClick={step === 3 ? undefined : next}
                disabled={isSubmitting}
                className="btn-primary flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {FORM.sending}
                  </>
                ) : step === 3 ? (
                  CTA.form
                ) : (
                  CTA.formNext
                )}
              </button>
            </div>
          </form>

          <p className="mt-4 flex items-center justify-center gap-2 text-center text-[12.5px] text-muted-foreground">
            <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
            {FORM.privacy}
          </p>
        </>
      )}
    </div>
  );
}

function ProgressIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="mb-7">
      <div className="mb-2.5 flex items-center justify-between text-[12px] font-medium text-muted-foreground">
        <span>{FORM.steps[step].label}</span>
        <span>{FORM.stepCounter(step)}</span>
      </div>
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-line">
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary"
          initial={false}
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
    <div className="space-y-4">
      <h4 className="text-[17px] font-semibold text-heading">
        {FORM.steps[1].title}
      </h4>

      <Field
        id="name"
        label={FORM.fields.name.label}
        placeholder={FORM.fields.name.placeholder}
        error={errors.name?.message}
        autoComplete="name"
        {...register('name')}
      />

      <Field
        id="whatsapp"
        label={FORM.fields.whatsapp.label}
        placeholder={FORM.fields.whatsapp.placeholder}
        error={errors.whatsapp?.message}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        {...register('whatsapp')}
      />

      <Field
        id="opticsName"
        label={FORM.fields.opticsName.label}
        placeholder={FORM.fields.opticsName.placeholder}
        error={errors.opticsName?.message}
        autoComplete="organization"
        {...register('opticsName')}
      />
    </div>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

function Field({ id, label, error, ...rest }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        className="spotlight-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12.5px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function StepRadio<TName extends 'revenue' | 'adsExperience'>({
  title,
  name,
  options,
  control,
}: {
  title: string;
  name: TName;
  options: ReadonlyArray<{ value: string; label: string; sub: string }>;
  control: ReturnType<typeof useForm<FormData>>['control'];
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-4">
          <h4 className="text-[17px] font-semibold text-heading">{title}</h4>

          <div
            role="radiogroup"
            aria-label={title}
            className="grid grid-cols-1 gap-2.5"
          >
            {options.map((opt) => {
              const active = field.value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => field.onChange(opt.value)}
                  className={`rounded-xl border px-4 py-3 text-left transition-[border-color,background-color] duration-240 ${
                    active
                      ? 'border-primary bg-primary-soft'
                      : 'border-line bg-card hover:border-line-strong'
                  }`}
                >
                  <span className="block text-[14px] font-semibold text-heading">
                    {opt.label}
                  </span>
                  <span className="block text-[12.5px] text-muted-foreground">
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>

          {fieldState.error?.message && (
            <p className="text-[12.5px] text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

function SuccessState() {
  return (
    <motion.div
      className="flex flex-col items-center py-8 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT_QUINT }}
    >
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
        <Check className="h-7 w-7" strokeWidth={2.5} />
      </span>
      <h3 className="text-[20px]">{FORM.success.title}</h3>
      <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-foreground">
        {FORM.success.body}
      </p>
    </motion.div>
  );
}
