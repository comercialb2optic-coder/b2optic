import type { CSSProperties } from 'react';

/**
 * Textura de fundo de seção.
 *
 * O tema claro sozinho fica chapado. Estas camadas dão profundidade sem virar
 * decoração — todas em CSS puro (sem canvas, sem imagem, custo ~zero) e todas
 * com máscara radial, então nunca encostam na borda da seção com força.
 *
 * Regra de uso: no MÁXIMO uma textura por seção, e nunca em duas seções
 * seguidas. Se tudo tem textura, nada tem — vira ruído e a página fica pesada
 * de ler. Ver `.claude/skills/b2optic-design/SKILL.md`.
 */

type Variant = 'dots' | 'grid' | 'rings' | 'glow';

interface SectionBackdropProps {
  variant: Variant;
  /** Onde a máscara concentra a textura. Padrão: centro-topo. */
  origin?: string;
  className?: string;
}

const DOT_SIZE = 22;
const GRID_SIZE = 64;

function styleFor(variant: Variant, origin: string): CSSProperties {
  const fade = `radial-gradient(ellipse 80% 70% at ${origin}, #000 0%, transparent 72%)`;

  switch (variant) {
    case 'dots':
      return {
        backgroundImage:
          'radial-gradient(circle, rgba(11,18,32,0.13) 1px, transparent 1px)',
        backgroundSize: `${DOT_SIZE}px ${DOT_SIZE}px`,
        maskImage: fade,
        WebkitMaskImage: fade,
      };

    case 'grid':
      return {
        backgroundImage: `
          linear-gradient(to right, rgba(11,18,32,0.055) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(11,18,32,0.055) 1px, transparent 1px)
        `,
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        maskImage: fade,
        WebkitMaskImage: fade,
      };

    // Anéis concêntricos — motivo de lente. É o único ornamento da página que
    // diz algo sobre o negócio em vez de só preencher espaço.
    case 'rings':
      return {
        backgroundImage: `repeating-radial-gradient(
          circle at ${origin},
          transparent 0px,
          transparent 78px,
          rgba(0,85,255,0.055) 78px,
          rgba(0,85,255,0.055) 79px
        )`,
        maskImage: fade,
        WebkitMaskImage: fade,
      };

    case 'glow':
      return {
        backgroundImage: `radial-gradient(60% 90% at ${origin}, rgba(0,85,255,0.07), transparent 70%)`,
      };
  }
}

export default function SectionBackdrop({
  variant,
  origin = '50% 0%',
  className = '',
}: SectionBackdropProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={styleFor(variant, origin)}
    />
  );
}
