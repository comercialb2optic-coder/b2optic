import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { EASE_OUT_QUINT } from '@/components/motion';
import { NAV } from '@/content';

// Wordmark azul e prata, aparado da margem transparente que vinha no arquivo.
// Proporção 11,8:1 — a 22px de altura dá ~260px de largura, que ainda cabe em
// tela de 320px com o padding do cabeçalho. Alternativas no public:
// '/b2optic-monograma.png' (só o "B2", 3,6:1) e '/b2optic-logo.png'.
const HEADER_LOGO_SRC = '/b2optic-logo-azul-prata.png';
const HEADER_LOGO_ALT = 'B2Optic';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Limiar curto de propósito: o fundo precisa chegar junto com o gesto. Com
    // os 24px anteriores a barra ficava transparente durante o primeiro trecho
    // da rolagem e a logo aparecia atrasada, sobre o conteúdo em movimento.
    const handleScroll = () => setIsScrolled(window.scrollY > 6);
    // Lê já na montagem — quem recarrega a página no meio dela chegava aqui com
    // o cabeçalho transparente até o primeiro evento de scroll.
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-200 ${
        isScrolled
          ? 'border-b border-line bg-background/90 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT_QUINT }}
    >
      {/* max-w-6xl, não 7xl: é a largura de container do resto da página. Com
          7xl a logo caía 64px à esquerda do texto do hero e a navegação passava
          da borda direita do formulário. */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <a
          href="/"
          aria-label="B2Optic — voltar ao topo"
          className="inline-flex shrink-0 items-center transition-opacity duration-300 hover:opacity-70"
        >
          <img
            src={HEADER_LOGO_SRC}
            alt={HEADER_LOGO_ALT}
            width={1240}
            height={105}
            className="h-[22px] w-auto select-none sm:h-6"
            draggable={false}
          />
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollTo(item.id)}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
