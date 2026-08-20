import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  FileText,
  ArrowUp,
  ExternalLink,
  Compass,
  Clock,
  CalendarDays,
  Activity,
  Layers,
  Sparkles,
  Heart
} from 'lucide-react';
import type { WeatherViewTab } from '../types/weather';

interface SocialLink {
  name: string;
  url: string;
  hoverColor: string;
  hoverBorder: string;
  hoverGlow: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/mizan989',
    hoverColor: 'hover:text-white hover:bg-white/[0.08]',
    hoverBorder: 'hover:border-white/30',
    hoverGlow: 'hover:shadow-[0_0_16px_rgba(255,255,255,0.2)]',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    ),
  },
  {
    name: 'X',
    url: 'https://x.com/mizanmohammadd',
    hoverColor: 'hover:text-white hover:bg-white/[0.08]',
    hoverBorder: 'hover:border-white/30',
    hoverGlow: 'hover:shadow-[0_0_16px_rgba(255,255,255,0.25)]',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/mizann989/',
    hoverColor: 'hover:text-[#0A66C2] hover:bg-[#0A66C2]/10',
    hoverBorder: 'hover:border-[#0A66C2]/40',
    hoverGlow: 'hover:shadow-[0_0_18px_rgba(10,102,194,0.35)]',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/mizanmohammadd',
    hoverColor: 'hover:text-[#E4405F] hover:bg-[#E4405F]/10',
    hoverBorder: 'hover:border-[#E4405F]/40',
    hoverGlow: 'hover:shadow-[0_0_18px_rgba(228,64,95,0.35)]',
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 0 000-2.881z"
        />
      </svg>
    ),
  },
];

interface FooterProps {
  onOpenLegal?: (tab: 'privacy' | 'terms') => void;
  onNavigateTab?: (tab: WeatherViewTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onNavigateTab }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabClick = (tab: WeatherViewTab) => {
    onNavigateTab?.(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 mb-8 flex flex-col gap-6">
      {/* Horizon Hairline Separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />

      {/* Futuristic Glassmorphic Footer Island */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-[0_16px_50px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all duration-300 hover:border-white/[0.14] sm:p-8 md:p-10">
        {/* Soft Ambient Light Cones */}
        <div className="pointer-events-none absolute -top-24 left-1/4 -z-10 h-48 w-80 rounded-full bg-[var(--sky)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-48 w-80 rounded-full bg-amber-500/5 blur-3xl" />

        {/* Main Grid: Multi-Column Layout */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          
          {/* Column 1: Brand, Tagline & Live Status (lg: 5 cols) */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="flex size-9 items-center justify-center rounded-2xl border border-sky-400/30 bg-gradient-to-br from-sky-400/20 to-blue-600/20 text-[var(--sky)] shadow-[0_0_15px_rgba(220,232,255,0.15)]"
              >
                <Sparkles className="size-5" />
              </motion.div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold tracking-tight text-white">
                  Sky<span className="text-[var(--sky)]">lio</span>
                </span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/65 max-w-sm">
              Hyperlocal atmospheric intelligence, precision forecasts, and real-time celestial telemetry crafted with fluid motion and minimalist design.
            </p>

            {/* Live Atmospheric Telemetry Beacon */}
            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3 py-1.5 text-xs text-emerald-300 backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-[11px] font-medium">Sensors: Live • Open-Meteo v1</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-mono text-white/50">
                <Layers className="size-3 text-white/40" />
                <span>ECMWF & GFS Models</span>
              </div>
            </div>
          </div>

          {/* Column 2: Atmospheric Views (lg: 2 cols) */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-white/40">
              Atmosphere
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-white/70">
              <li>
                <button
                  type="button"
                  onClick={() => handleTabClick('overview')}
                  className="flex items-center gap-2 transition-colors hover:text-white group text-left"
                >
                  <Compass className="size-3.5 text-white/40 group-hover:text-[var(--sky)] transition-colors" />
                  <span>Overview Matrix</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleTabClick('hourly')}
                  className="flex items-center gap-2 transition-colors hover:text-white group text-left"
                >
                  <Clock className="size-3.5 text-white/40 group-hover:text-[var(--sky)] transition-colors" />
                  <span>24h Hourly Graph</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleTabClick('daily')}
                  className="flex items-center gap-2 transition-colors hover:text-white group text-left"
                >
                  <CalendarDays className="size-3.5 text-white/40 group-hover:text-[var(--sky)] transition-colors" />
                  <span>7-Day Synoptic</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleTabClick('telemetry')}
                  className="flex items-center gap-2 transition-colors hover:text-white group text-left"
                >
                  <Activity className="size-3.5 text-white/40 group-hover:text-[var(--sky)] transition-colors" />
                  <span>Atmospheric Bento</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Governance (lg: 2 cols) */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-white/40">
              Governance
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-white/70">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('privacy')}
                  className="flex items-center gap-2 transition-colors hover:text-[var(--sky)] group text-left"
                >
                  <ShieldCheck className="size-3.5 text-sky-400/80 group-hover:text-[var(--sky)] transition-colors" />
                  <span className="font-medium">Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('terms')}
                  className="flex items-center gap-2 transition-colors hover:text-[var(--gold)] group text-left"
                >
                  <FileText className="size-3.5 text-amber-400/80 group-hover:text-[var(--gold)] transition-colors" />
                  <span className="font-medium">Terms of Service</span>
                </button>
              </li>
              <li>
                <a
                  href="https://open-meteo.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-white/55 transition-colors hover:text-white group"
                >
                  <span>Data Attribution</span>
                  <ExternalLink className="size-3 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/mizan989/skylio/blob/main/LICENSE"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-white/55 transition-colors hover:text-white group"
                >
                  <span>MIT License</span>
                  <ExternalLink className="size-3 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Creator & Connect (lg: 3 cols) */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-3">
            <div className="flex flex-col gap-3">
              <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-white/40">
                Connect
              </h4>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-1.5 text-white/80">
                  <span>Crafted with</span>
                  <Heart className="size-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                  <span>by</span>
                  <span className="font-semibold text-white">Md Mizan</span>
                </div>
                <p className="text-xs text-white/50">Full-Stack Engineer & Designer</p>
              </div>

              {/* Social Media Pill Dock */}
              <div className="mt-2 flex items-center gap-2">
                {SOCIAL_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.name}
                      title={link.name}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                      className={`flex size-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/60 transition-all duration-200 ${link.hoverColor} ${link.hoverBorder} ${link.hoverGlow}`}
                    >
                      <Icon className="size-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Back To Top Button */}
            <div>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={scrollToTop}
                className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/70 shadow-sm transition-all hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                <ArrowUp className="size-3.5 text-[var(--sky)]" />
                <span>Back to Zenith</span>
              </motion.button>
            </div>

          </div>

        </div>

        {/* Bottom Sub-Footer: Copyright & Privacy Badge */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row text-xs text-white/45">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>© {currentYear} Skylio. Built for precision & meteorological elegance.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenLegal?.('privacy')}
              className="text-white/45 hover:text-white transition-colors"
            >
              Privacy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onOpenLegal?.('terms')}
              className="text-white/45 hover:text-white transition-colors"
            >
              Terms
            </button>
            <span>•</span>
            <span className="text-emerald-400/80 font-mono text-[11px]">100% Tracker-Free</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
