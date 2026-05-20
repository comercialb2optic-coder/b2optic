import { motion } from 'framer-motion';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const QUICK_LINKS = [
  { label: 'Sobre', href: '#' },
  { label: 'Serviços', href: '#' },
  { label: 'Contato', href: '#' },
];

const CONTACT_LINKS = [
  { label: 'contato@b2optic.com', href: 'mailto:contato@b2optic.com' },
  { label: '+55 (11) 9 9999-9999', href: 'tel:+5511999999999' },
];

const headingClass =
  'mb-5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground';

export default function Footer() {
  return (
    <footer className="relative bg-background border-t border-border/60">
      <div className="section-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          viewport={{ once: true, margin: '-40px' }}
        >
          {/* Brand */}
          <div>
            <h3
              className="text-xl font-semibold tracking-[-0.01em] text-foreground mb-4"
            >
              <span className="text-primary">B2</span>Optic
            </h3>
            <p className="text-[14px] leading-relaxed text-muted-foreground max-w-[260px]">
              O sucesso da sua ótica é o nosso negócio.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <span className={headingClass}>Links rápidos</span>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[14px] text-foreground/70 hover:text-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className={headingClass}>Contato</span>
            <ul className="space-y-3">
              {CONTACT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[14px] text-foreground/70 hover:text-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Subtle inner divider */}
        <div className="section-divider" />

        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT }}
          viewport={{ once: true }}
        >
          <p className="text-[12px] text-muted-foreground/80">
            © 2026 B2Optic. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-[12px] text-muted-foreground/80 hover:text-foreground transition-colors duration-300"
            >
              Política de Privacidade
            </a>
            <a
              href="#"
              className="text-[12px] text-muted-foreground/80 hover:text-foreground transition-colors duration-300"
            >
              Termos de Serviço
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
