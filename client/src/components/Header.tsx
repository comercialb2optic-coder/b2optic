import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Logo do header — teste azul+prata. Reverter trocando pela linha comentada abaixo.
const HEADER_LOGO_SRC = '/oticas/b2optic-logo-azul-prata.png';
// const HEADER_LOGO_SRC = '/b2optic-logo-branca.png';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        isScrolled
          ? 'bg-background/70 backdrop-blur-xl border-b border-border/60'
          : 'bg-transparent border-b border-transparent'
      }`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-center">
        <a
          href="/"
          aria-label="B2Optic — voltar ao topo"
          className="inline-flex items-center transition-opacity duration-300 hover:opacity-90"
        >
          <img
            src={HEADER_LOGO_SRC}
            alt="B2Optic"
            className="h-9 sm:h-11 lg:h-12 w-auto select-none"
            draggable={false}
          />
        </a>
      </div>
    </motion.header>
  );
}
