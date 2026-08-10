import { CERTIFICATIONS } from '@/content';

/**
 * Selos de certificação. Os SVGs vêm da versão anterior da página — são as
 * marcas corretas do Google e do Facebook, com os paths oficiais. Não
 * substituir por ícone genérico nem adicionar selo que a operação não tenha.
 */

function GoogleLogo({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function FacebookLogo({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.955.926-1.955 1.875v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
    </svg>
  );
}

const LOGOS: Record<string, (p: { className: string }) => React.JSX.Element> = {
  google: GoogleLogo,
  meta: FacebookLogo,
};

interface Props {
  /** `compact` é a versão do hero — o selo apoia a promessa, não compete com ela. */
  size?: 'compact' | 'default';
  align?: 'left' | 'center';
  className?: string;
}

export default function CertificationBadges({
  size = 'default',
  align = 'center',
  className = '',
}: Props) {
  const compact = size === 'compact';
  const logoClass = compact ? 'h-5 w-5 shrink-0' : 'h-7 w-7 shrink-0';

  return (
    <div className={`${align === 'left' ? 'text-left' : 'text-center'} ${className}`}>
      <p
        className={`${compact ? 'text-[12px]' : 'text-[13px]'} text-muted-foreground`}
      >
        {CERTIFICATIONS.label}
      </p>
      <ul
        className={`mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 ${
          align === 'left' ? 'justify-start' : 'justify-center'
        }`}
      >
        {CERTIFICATIONS.items.map((cert) => {
          const Logo = LOGOS[cert.id];
          return (
            <li key={cert.id} className="flex items-center gap-2">
              {Logo && <Logo className={logoClass} />}
              <span className="text-left leading-tight">
                <span
                  className={`block font-semibold text-heading ${
                    compact ? 'text-[12.5px]' : 'text-[14px]'
                  }`}
                >
                  {cert.name}
                </span>
                <span
                  className={`block text-muted-foreground ${
                    compact ? 'text-[11px]' : 'text-[12px]'
                  }`}
                >
                  {cert.sub}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
