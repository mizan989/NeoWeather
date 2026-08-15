import { Moon, Sun } from 'lucide-react';
import type { TempUnit } from '../types/weather';

interface UnitToggleProps {
  unit: TempUnit;
  onChange: (u: TempUnit) => void;
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className="flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] p-0.5 backdrop-blur-md">
      <button
        onClick={() => onChange('celsius')}
        className={`rounded-full px-2 py-0.5 font-mono text-xs transition-all duration-200 ${
          unit === 'celsius'
            ? 'bg-white/15 text-white font-medium'
            : 'text-white/40 hover:text-white/70'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => onChange('fahrenheit')}
        className={`rounded-full px-2 py-0.5 font-mono text-xs transition-all duration-200 ${
          unit === 'fahrenheit'
            ? 'bg-white/15 text-white font-medium'
            : 'text-white/40 hover:text-white/70'
        }`}
      >
        °F
      </button>
    </div>
  );
}

interface ThemeToggleProps {
  dark: boolean;
  onChange: (d: boolean) => void;
}

export function ThemeToggle({ dark, onChange }: ThemeToggleProps) {
  return (
    <button
      onClick={() => onChange(!dark)}
      aria-label="Toggle dark mode"
      className="flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] p-1.5 text-white/50 backdrop-blur-md transition-all hover:border-white/20 hover:text-white active:scale-95"
    >
      {dark ? (
        <Sun size={14} strokeWidth={1.5} className="text-[var(--gold)]" />
      ) : (
        <Moon size={14} strokeWidth={1.5} className="text-[var(--sky)]" />
      )}
    </button>
  );
}
