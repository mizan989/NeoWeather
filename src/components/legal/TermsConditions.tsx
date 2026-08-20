import React from 'react';
import { FileText, AlertTriangle, CloudSun, Scale, Code2, ShieldAlert, RefreshCcw, HelpCircle } from 'lucide-react';

export const TermsConditions: React.FC = () => {
  return (
    <div className="space-y-8 text-white/80 font-normal leading-relaxed">
      {/* Header Badge & Intro */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
            <FileText className="size-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Terms of Service</h3>
            <p className="text-xs text-white/50">Effective: January 2025</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-white/70">
          Welcome to <strong className="text-white">Skylio</strong>. By accessing or using the Skylio web application, you agree to comply with and be bound by the following terms and conditions. If you do not agree, please discontinue using the service.
        </p>
      </div>

      {/* Critical Alert Disclaimer */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4.5 text-sm text-amber-200/90 shadow-[0_0_24px_rgba(245,158,11,0.08)]">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-display font-semibold text-amber-200">Critical Weather Safety Notice</h4>
            <p className="text-xs leading-relaxed text-amber-300/80">
              Skylio provides atmospheric visualizations and numerical model outputs for general informational and personal convenience only. It is <strong>NOT</strong> certified for safety-critical applications, aviation flight planning, marine navigation, or severe weather disaster defense. Always rely on official meteorological agencies (e.g. NOAA, Met Office, IMD) for emergency directives.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Acceptance & Service Description */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <CloudSun className="size-4.5 text-[var(--sky)]" />
          <h4 className="font-display text-base font-semibold text-white">1. Nature of Service</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm space-y-2">
          <p>
            Skylio is an open, modern frontend client that retrieves atmospheric data, hourly forecasts, and telemetry metrics from open meteorological datasets. The service is provided free of charge on an "as is" and "as available" basis.
          </p>
        </div>
      </section>

      {/* Section 2: Data Sources & Accuracy */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Scale className="size-4.5 text-teal-400" />
          <h4 className="font-display text-base font-semibold text-white">2. Meteorological Accuracy & Third-Party Outages</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm space-y-2">
          <p>
            Forecast data displayed within Skylio is computed by global numerical prediction models (including ECMWF, GFS, DWD ICON, and others via Open-Meteo). We do not guarantee:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-white/70">
            <li>100% precision, timeliness, or accuracy of precipitation, wind, UV, or temperature models.</li>
            <li>Uninterrupted or error-free continuous service availability.</li>
            <li>Real-time reflection of microclimatic or rapidly emerging localized storm events.</li>
          </ul>
        </div>
      </section>

      {/* Section 3: Permitted Use */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <Code2 className="size-4.5 text-violet-400" />
          <h4 className="font-display text-base font-semibold text-white">3. Acceptable Use & Fair Access</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm space-y-2">
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-white/70">
            <li>Execute automated scraping bots or denial-of-service scripts that overburden the upstream weather APIs.</li>
            <li>Attempt to reverse-engineer, inject harmful code, or disrupt the application's runtime.</li>
            <li>Misrepresent forecasts obtained from Skylio as certified meteorological hazard alerts.</li>
          </ul>
        </div>
      </section>

      {/* Section 4: Open Source & Intellectual Property */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <FileText className="size-4.5 text-blue-400" />
          <h4 className="font-display text-base font-semibold text-white">4. Intellectual Property & MIT License</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm space-y-2">
          <p>
            The Skylio frontend codebase and design system are open-source and released under the <strong className="text-white">MIT License</strong>. Weather icons and meteorological assets remain subject to their respective open-source attributions.
          </p>
        </div>
      </section>

      {/* Section 5: Limitation of Liability */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="size-4.5 text-rose-400" />
          <h4 className="font-display text-base font-semibold text-white">5. Limitation of Liability</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm space-y-2 text-white/70">
          <p>
            To the maximum extent permitted by applicable law, neither the developer (Md Mizan) nor contributors to Skylio shall be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this service, or reliance upon any weather forecast or metric presented.
          </p>
        </div>
      </section>

      {/* Section 6: Changes to Terms */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <RefreshCcw className="size-4.5 text-sky-300" />
          <h4 className="font-display text-base font-semibold text-white">6. Amendments to Terms</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm">
          <p className="text-white/70">
            We reserve the right to modify these Terms and Conditions as new features or meteorological APIs are integrated. Continued use of Skylio constitutes your acknowledgment and acceptance of any revised terms.
          </p>
        </div>
      </section>

      {/* Section 7: Questions & Contact */}
      <section className="space-y-3">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="size-4.5 text-white/80" />
          <h4 className="font-display text-base font-semibold text-white">7. Questions</h4>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4 text-sm">
          <p className="text-white/70">
            Questions regarding these Terms can be submitted through our GitHub repository at{' '}
            <a href="https://github.com/mizan989" target="_blank" rel="noreferrer" className="text-[var(--sky)] hover:underline">
              github.com/mizan989
            </a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
