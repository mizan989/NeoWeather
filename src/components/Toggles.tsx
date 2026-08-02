import { Moon, Sun } from 'lucide-react';
import type { TempUnit } from '../types/weather';

export function UnitToggle({ unit, onChange }: { unit: TempUnit; onChange: (u: TempUnit) => void }) {
  return (
    <div className="flex items-center font-mono text-xs" style={{ color: 'var(--ink-soft)' }}>
      <button
        onClick={() => onChange('celsius')}
        className="px-1.5 py-0.5"
        style={unit === 'celsius' ? { color: 'var(--ink)', fontWeight: 500 } : undefined}
      >
        °C
      </button>
      <span>/</span>
      <button
        onClick={() => onChange('fahrenheit')}
        className="px-1.5 py-0.5"
        style={unit === 'fahrenheit' ? { color: 'var(--ink)', fontWeight: 500 } : undefined}
      >
        °F
      </button>
    </div>
  );
}

export function ThemeToggle({ dark, onChange }: { dark: boolean; onChange: (d: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!dark)}
      aria-label="Toggle dark mode"
      className="flex items-center justify-center rounded-full p-1.5 transition-colors"
      style={{ color: 'var(--ink-soft)' }}
    >
      {dark ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
    </button>
  );
}
