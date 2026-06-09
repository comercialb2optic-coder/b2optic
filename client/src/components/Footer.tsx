import { motion } from 'framer-motion';
import { Instagram, Linkedin, MessageCircle, Youtube } from 'lucide-react';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const SOCIAL_LINKS = [
  {
    label: 'WhatsApp',
    href: 'https://wa.me/55XXXXXXXXXXX', // [PREENCHER]
    Icon: MessageCircle,
  },
  {
    label: 'YouTube',
    href: '#', // [PREENCHER]
    Icon: Youtube,
  },
  {
    label: 'LinkedIn',
    href: '#', // [PREENCHER]
    Icon: Linkedin,
  },
  {
    label: 'Instagram',
    href: '#', // [PREENCHER]
    Icon: Instagram,
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          className="flex flex-col items-center text-center gap-7 sm:gap-9"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          viewport={{ once: true, margin: '-40px' }}
        >
          {/* Social row */}
          <ul className="flex items-center justify-center gap-5 sm:gap-6">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/40 text-foreground/60 transition-[color,border-color,background-color] duration-300 hover:text-primary hover:border-primary/45 hover:bg-primary/[0.06]"
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </a>
              </li>
            ))}
          </ul>

          {/* Copyright */}
          <p className="text-[11.5px] text-muted-foreground/75 leading-relaxed text-center">
            Copyright © | 2026 B2Optic
          </p>

          {/* Legal links */}
          <p className="text-[11.5px] text-muted-foreground/70">
            <a
              href="#"
              className="transition-colors duration-300 hover:text-foreground"
            >
              Termos de uso
            </a>
            <span aria-hidden className="mx-2 text-muted-foreground/40">
              |
            </span>
            <a
              href="#"
              className="transition-colors duration-300 hover:text-foreground"
            >
              Políticas de privacidade
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
