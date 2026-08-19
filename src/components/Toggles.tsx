import { motion } from 'framer-motion';
import type { TempUnit } from '../types/weather';

interface UnitToggleProps {
  unit: TempUnit;
  onChange: (u: TempUnit) => void;
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className="relative flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] p-0.5 backdrop-blur-md">
      {(['celsius', 'fahrenheit'] as const).map((u) => {
        const isActive = unit === u;
        return (
          <motion.button
            key={u}
            whileTap={{ scale: 0.92 }}
            onClick={() => onChange(u)}
            className={`relative z-10 rounded-full px-2.5 py-0.5 font-mono text-xs transition-colors duration-200 ${
              isActive ? 'text-white font-medium' : 'text-white/40 hover:text-white/80'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-unit-pill"
                className="absolute inset-0 z-[-1] rounded-full border border-white/20 bg-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}
            {u === 'celsius' ? '°C' : '°F'}
          </motion.button>
        );
      })}
    </div>
  );
}
