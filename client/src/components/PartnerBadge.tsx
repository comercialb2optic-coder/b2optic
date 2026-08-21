import { PARTNER } from '@/content';

interface Props {
  /** `onDark` troca para o wordmark branco original, dentro de `.section-dark`. */
  onDark?: boolean;
  className?: string;
}

/**
 * Selo de parceria. Fica logo abaixo do formulário do hero, no respiro entre a
 * dobra e a faixa de clientes — é a última coisa que o lead vê antes de decidir
 * preencher, então funciona como reforço de credibilidade, não como enfeite.
 *
 * A proporção da imagem é 900x344; a altura fixa e `w-auto` mantêm isso sem
 * precisar repetir o número aqui.
 *
 * Alinhamento: dentro do PNG a marca gráfica ocupa o terço de cima e a palavra
 * "ssÓtica" só começa por volta de 46% da altura — centralizar a CAIXA da
 * imagem deixa a palavra visivelmente mais baixa que o rótulo ao lado. O
 * `-translate-y` sobe a imagem até o miolo da palavra bater com o do texto;
 * como é transform, não empurra layout nenhum. O valor é % da própria altura,
 * então continua certo quando o logo cresce no `sm`.
 */
export default function PartnerBadge({
  onDark = false,
  className = '',
}: Props) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 ${className}`}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:text-[12px]">
        {PARTNER.label}
      </span>
      <img
        src={onDark ? PARTNER.logoOnDark : PARTNER.logo}
        alt={`${PARTNER.name}, parceira oficial da B2Optic`}
        width={900}
        height={344}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="h-7 w-auto -translate-y-[24%] select-none sm:h-8"
      />
    </div>
  );
}
