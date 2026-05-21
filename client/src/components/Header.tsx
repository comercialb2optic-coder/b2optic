import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Como funciona', target: 'how-it-works' },
  { label: 'Cases', target: 'cases' },
  { label: 'Quem somos', target: 'about' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between gap-6">
        {/* Logo */}
        <a
          href="/"
          className="text-xl font-semibold tracking-[-0.01em] text-foreground hover:opacity-90 transition-opacity duration-300 shrink-0"
        >
          <span className="text-primary">B2</span>Optic
        </a>

        {/* Nav — desktop only */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <button
              key={link.target}
              type="button"
              onClick={() => scrollTo(link.target)}
              className="text-[13.5px] font-medium text-foreground/70 transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA Button — ghost variant */}
        <button
          type="button"
          onClick={() => scrollTo('form-section')}
          className="group inline-flex shrink-0 items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-4 sm:px-5 py-2 sm:py-2.5 text-[13px] sm:text-sm font-medium text-foreground/90 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.05] hover:text-foreground hover:shadow-[0_8px_20px_-10px_rgba(0,0,0,0.6)]"
        >
          <span>Falar com consultor</span>
          <span
            aria-hidden
            className="text-foreground/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-foreground/70"
          >
            →
          </span>
        </button>
      </div>
    </motion.header>
  );
}
