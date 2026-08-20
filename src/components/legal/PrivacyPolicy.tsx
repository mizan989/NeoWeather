import React from 'react';
import { ShieldCheck, MapPin, Database, Cookie, Globe, Lock, UserCheck, Mail } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="space-y-8 text-white/80 font-normal leading-relaxed">
      {/* Header Badge & Intro */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/10 text-sky-300">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Privacy by Architecture</h3>
            <p className="text-xs text-white/50">Effective: January 2025</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-white/70">
          At <strong className="text-white">Skylio</strong>, we believe meteorological information should be fast, beautiful, and fundamentally respectful of your personal privacy. We do not require account registration, do not run user tracking scripts, and do not monetize your personal data.
        </p>
      </div>

      {/* Section 1: Data We Handle */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <MapPin className="size-4.5 text-[var(--sky)]" />
          <h4 className="font-display text-base font-semibold text-white">1. Geolocation & Atmospheric Queries</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm space-y-2">
          <p>
            When you request weather for your current location via the <span className="font-mono text-xs text-sky-300">"Locate"</span> button:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-white/70">
            <li>Your device coordinates (latitude and longitude) are accessed strictly within your browser via the standard HTML5 Geolocation API.</li>
            <li>Coordinates are sent directly to the open-source <strong className="text-white/90">Open-Meteo weather API</strong> to fetch relevant forecast telemetry.</li>
            <li>Coordinates are never stored on any backend server belonging to Skylio and are never linked to any personal identifier.</li>
          </ul>
        </div>
      </section>

      {/* Section 2: Local Storage & Preferences */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Database className="size-4.5 text-[var(--gold)]" />
          <h4 className="font-display text-base font-semibold text-white">2. Local Storage Usage</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm space-y-2">
          <p>
            Skylio utilizes standard browser <code className="font-mono text-xs text-amber-200">localStorage</code> exclusively on your device for user experience continuity:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-white/70">
            <li><strong className="text-white/90">Bookmarked Locations:</strong> Saved cities and custom coordinates pinned to your dashboard.</li>
            <li><strong className="text-white/90">Last Active City:</strong> Your most recently searched location so your forecast loads instantly on your next visit.</li>
            <li><strong className="text-white/90">Measurement Units:</strong> Temperature scale selection (°C / °F).</li>
          </ul>
          <p className="text-xs text-white/50 pt-1">
            This data never leaves your device and can be cleared at any time via your browser settings or by removing bookmarks directly in the UI.
          </p>
        </div>
      </section>

      {/* Section 3: Cookies & Analytics */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Cookie className="size-4.5 text-emerald-400" />
          <h4 className="font-display text-base font-semibold text-white">3. Zero Cookies & Zero Tracker Policy</h4>
        </div>
        <div className="rounded-xl border border-emerald-500/15 bg-emerald-950/10 p-4 text-sm">
          <p className="text-emerald-100/90">
            Skylio does <strong>not</strong> use advertising cookies, marketing pixels, social trackers, or cross-site profiling technologies. We do not sell, rent, or trade your usage habits to third parties.
          </p>
        </div>
      </section>

      {/* Section 4: Third-Party APIs */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Globe className="size-4.5 text-sky-400" />
          <h4 className="font-display text-base font-semibold text-white">4. Upstream Meteorological Providers</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm space-y-2">
          <p>
            Weather data is retrieved in real-time from the <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="text-[var(--sky)] underline underline-offset-2 hover:text-white">Open-Meteo API</a>. Geocoding city search queries are resolved using Open-Meteo's geocoding engine. Please consult Open-Meteo’s privacy documentation for specifics on their server infrastructure and operational log rotation.
          </p>
        </div>
      </section>

      {/* Section 5: Security & HTTPS */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Lock className="size-4.5 text-violet-400" />
          <h4 className="font-display text-base font-semibold text-white">5. Communications Security</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm space-y-2">
          <p>
            All network requests between Skylio and weather API endpoints are strictly transmitted over encrypted <strong className="text-white/90">HTTPS (TLS 1.3)</strong>, preventing tampering or eavesdropping on your network queries.
          </p>
        </div>
      </section>

      {/* Section 6: User Rights & Control */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <UserCheck className="size-4.5 text-teal-400" />
          <h4 className="font-display text-base font-semibold text-white">6. Your Rights & Data Control</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm space-y-2">
          <p>
            Because we do not maintain a user database or store personal data, there is no personal profile to delete. You retain complete sovereignty over your device:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-white/70">
            <li>You can revoke location permissions in your browser at any time.</li>
            <li>You can clear local preferences by clearing your browser cache and site data for this domain.</li>
          </ul>
        </div>
      </section>

      {/* Section 7: Contact Information */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Mail className="size-4.5 text-white/80" />
          <h4 className="font-display text-base font-semibold text-white">7. Inquiries & Feedback</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm">
          <p className="text-white/70">
            For privacy inquiries or technical feedback regarding Skylio, visit the open-source repository or reach out via GitHub at{' '}
            <a href="https://github.com/mizan989" target="_blank" rel="noreferrer" className="text-[var(--sky)] hover:underline">
              github.com/mizan989
            </a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
