import { motion } from 'framer-motion';
import { Instagram, Linkedin, MessageCircle, Youtube } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { EASE_OUT_QUINT } from '@/components/motion';
import { SOCIAL, FOOTER } from '@/content';

const ICONS: Record<string, LucideIcon> = {
  whatsapp: MessageCircle,
  youtube: Youtube,
  linkedin: Linkedin,
  instagram: Instagram,
};

export default function Footer() {
  return (
    <footer className="border-t border-line bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center gap-7 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_QUINT }}
          viewport={{ once: true, margin: '-40px' }}
        >
          <img
            src="/b2optic-logo.png"
            alt="B2Optic"
            width={140}
            height={30}
            className="h-6 w-auto opacity-90"
          />

          <ul className="flex items-center justify-center gap-4">
            {SOCIAL.map(({ label, href, icon }) => {
              const Icon = ICONS[icon];
              return (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted-foreground transition-[color,border-color,background-color] duration-240 hover:border-primary hover:bg-primary-soft hover:text-primary"
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground">{FOOTER.copyright}</p>
            <p className="text-xs text-muted-foreground">
              <a
                href="#"
                className="transition-colors duration-200 hover:text-primary"
              >
                {FOOTER.terms}
              </a>
              <span aria-hidden className="mx-2 text-line-strong">
                |
              </span>
              <a
                href="#"
                className="transition-colors duration-200 hover:text-primary"
              >
                {FOOTER.privacy}
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
